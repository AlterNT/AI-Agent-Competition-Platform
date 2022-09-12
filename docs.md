# Domain



# Typings

## Utility Types

```typescript
// utility
type Integer        = Number;               // unfortunately Number and Int aren't different in typescript

// domain logic
type AgentId        = String;               // e.g. 'ce030dee-1533-4b62-b53b-568ef9f7ef8c'
type StudentNumber  = String;               // e.g. '20000000'
type GameScores     = Map<AgentId, Float>;  // agentId : agentScore
type GameState      = String;               // JSON string of the game state
type History        = Integer;              // number of recent events requested, 0 means all of them
```

## Domain Objects

```typescript
type Game = {
    agentScores: GameScores,
    gameState: GameState,
};

type Winrate = {
    agentId: AgentId,
    gamesPlayed: Integer,
    wins: Integer,
    winPercent: Integer,
};

type Improvement = {
    agentId: AgentId,
    initialWinPercent: Float,
    lastWinPercent: Float,
    percentageImproved: Float,
};
```

# Queries

Queries have no parameters if no `Request` type is specified for them.
The return type of the response terminates in the suffix `-Response`.

---

## Historical Game Data

Queries that return previous game data needed for historical analysis of agents or are needed to use the historical data API.

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
    studentNumber: StudentNumber,
    agentId: AgentId,
}[]
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
    agentId: AgentId,
}[]
```

---

### Games

Returns the outcome and state of the past 'history' games (or all of them is `history == 0`).

#### Route

```
/api/games?history=History
```

#### Response Type:

```typescript
type Games = {
    games: Game[],
}
```

---

### Agent Games

Returns the past 'history' games for agent (or all of them if `history == 0`).

#### Route

```
/api/agent-games?history=History
```

#### Response Type:

```typescript
type AgentGames = {
    games: Game[], // games.length = History
}
```

---

## Batch Queries

Queries that return a statistic for each node.

### Top Winrate

Returns all agents and their winrates, sorted by descending order of winrate.

#### Route

```
/api/top-winrate
```

#### Response Type:

```typescript
type TopWinrate = {
   winrate: Winrate[],
}
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
   improvements: Improvement[],
}
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
   improvements: Improvement[],
}
```

---

## individual queries

### Winrate

Returns the overall winrate of a single agent.

#### Route

```
/api/winrate?agentId=AgentId
```

#### Response Type:

```typescript
type Winrate = {
   winrate: Winrate,
}
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
   improvement: Improvement,
}
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
   improvement: Improvement,
}
```
