# Domain

## Platform Overview

This project is a platform for multiplayer games where multiple agents (users) can connect to a central server and play against each other. The server handles the matchmaking and provides an API to the state and actions while the agents use the API to query the updated gamestate and to play their turn.

The platform must be flexible to reprogram for other games, but the game 'LoveLetter' will be implemented as part of the project.

The program consists of the server that runs the games, and the client (agent) program that plays the games. The clients are all located on different machines and communicate to the server remotely.

## Entities

There are three entities in the domain: Users, Agents, and Games.

### Users

Users represent the real human person who is participating in the tournament.
They have a student number and an authentication token: each user also owns an agent.

There is a 'bot' user that controls all non-student controlled agents. Its student number is set as '00000000'

### Agents

Agents represent the code on the client program that is making actions in the game.
They have a unique id and have their source code uploaded and store on the server. The source code is available on demand after the tournament.

Each agent is owned by a user and participates in games.

### Games

Games represent instances of the game played on the server. Every game played has its actions logged on the server.
The events of the game are stored in the gamestate and each agent participating is assigned a score.

Each game is played by multiple agents.

# Database

## Structure

The schema of the database. The database is a Neo4J Graph Database. Nodes are analogous to tables of a relational databases and relationships are analogous to relations of a relational database. The relationships, like in a relational database are bidirectional (although they appear directed in the schema diagrams).

A graph database was used as the relationships in a graph database are far less rigid than in relational databases and so the same schema can be used for any game without having to pad the database with `NULL` values.

## Schema

![](schema.png)

# Typings

All typings are written in Typescript types in order to formalize

## Utility Types

```typescript
// utility
type Integer = Number; // unfortunately Number and Int aren't different in typescript
type Float = Number; // unfortunately Number and Float aren't different in typescript

// domain logic
type AgentId = String; // uuid of an agent:    e.g. 'ce030dee-1533-4b62-b53b-568ef9f7ef8c'
type StudentNumber = String; // UWA student number:  e.g. '20000000'
type GameScores = Map<AgentId, Float>; // maps agent ids to scores: agentId : agentScore
type GameState = String; // JSON string of game state
```

## Domain Objects

```typescript
type Game = {
  agentScores: GameScores;
  gameState: GameState;
};

type Winrate = {
  agentId: AgentId;
  gamesPlayed: Integer;
  wins: Integer;
  winPercent: Integer;
};

type Improvement = {
  agentId: AgentId;
  initialWinPercent: Float;
  lastWinPercent: Float;
  percentageImproved: Float;
};
```

# Queries

For each query their route is specified (which includes potential parameters) as well as their return type which is written as a Typescript type. This type represents a javascript object and is equivalent to JSON.

Queries are cached and therefore do not update in real time, but should always provide recent data.

---

## Historical Game Data

Queries that return previous game data needed for historical analysis of agents or are needed to use the historical data API. These are used if an agent wants to look to past events in order to decide on a future action.

### Agents

Returns every agent their corresponding student number.
Student number of '00000000' is reserved for the bot user.

#### Route

```
/api/agents
```

#### Response Type:

```typescript
type Agents = {
  agents: {
    studentNumber: StudentNumber;
    agentId: AgentId;
  }[];
};
```

---

### Bots

Returns every bot agent. Student number is assumed to be '00000000'

#### Route

```
/api/bots
```

#### Response Type:

```typescript
type Bots = {
  bots: {
    agentId: AgentId;
  }[];
};
```

---

### Games

Returns the outcome and state of all past games.

#### Route

```
/api/games
```

#### Response Type:

```typescript
type Games = {
  games: Game[];
};
```

---

### Agent Games

Returns all past games for the given agent

#### Route

```
/api/agent-games?agentId=AgentId
```

#### Response Type:

```typescript
type AgentGames = {
  games: Game[];
};
```

---

## Statistics (Batch)

Queries that return a statistic (such as the winrate) for every single agent. This is useful when comparing all agents against each other. The intended use-case is mainly for a website that will display the statistics of all agents.

### Top Winrate

Returns all agents and their winrates, sorted by descending order of winrate.

#### Route

```
/api/top-winrate
```

#### Response Type:

```typescript
type TopWinrate = {
  winrate: Winrate[];
};
```

---

### Most Improved

Returns agents and their improvement since they first started playing, sorted by descending order of improvement.

#### Route

```
/api/most-improved
```

#### Response Type:

```typescript
type MostImproved = {
  improvements: Improvement[];
};
```

---

### Most Improving

Returns agents and their improvement in their recent few games, sorted by descending order of improvement.

#### Route

```
/api/most-improving
```

#### Response Type:

```typescript
type MostImproving = {
  improvements: Improvement[];
};
```

---

## Statistics (Individual)

Returns statistics about a given agent when supplied with the agent's id. Is the same as the ['batch' queries](#statistics-batch) but only returns a single instance instead of a list. Returns `null` in the case that the agentId supplied is invalid or does not have enough data to be analysed.

### Winrate

Returns the overall winrate of a single agent.

#### Route

```
/api/winrate?agentId=AgentId
```

#### Response Type:

```typescript
type Winrate = {
  winrate: Winrate | null;
};
```

---

### Total Improvement

Returns improvement of an agent since its first game.

#### Route

```
/api/improvement?agentId=AgentId
```

#### Response Type:

```typescript
type Improvement = {
  improvement: Improvement | null;
};
```

---

### Rate of Improvement

Returns current improvement for an agent.

#### Route

```
/api/improvement-rate?agentId=AgentId
```

#### Response Type:

```typescript
type ImprovementRate = {
  improvement: Improvement | null;
};
```
