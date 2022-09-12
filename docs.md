# Shared Types

## Utility Types

```typescript
// utility types
type Integer = Number; // unfortunately Number and Int aren't different in typescript

// domain logic
type AgentId = String;// e.g. "ce030dee-1533-4b62-b53b-568ef9f7ef8c"
type StudentNumber = String;// e.g. '20000000'
type GameScores = Map<AgentId, Float>; // agentId : agentScore
type GameState = String; // JSON string of gamestate
type History = Integer; // number of recent events requested, 0 = all of them

// complete response objects
type AgentGame = {
    "agentScores": GameScores,
    "gameState": GameState,
};
type Winrate = {
    "agentId": AgentId,
    "gamesPlayed": Integer,
    "wins": Integer,
    "winPercent": Integer,
}
type Improvement = {
    "agentId": AgentId,
    "initialWinPercent": Float,
    "lastWinPercent": Float,
    "percentageImproved": Float,
};
```

# Queries

Queries have no parameters if no `Request` type is specified for them.
The return type of the response terminates in the suffix `-Response`.

## Historical Game Data

Queries that return previous game data needed for historical analysis of agents or are needed to use the historical data API.

### Agents

Returns every agent their corresponding student number.
Student number of '00000000' is reserved for the bot user.

```typescript
// /api/agents
type AgentsResponse = {
    "studentNumber": StudentNumber,
    "agentId": AgentId,
}[]
```

### Bots

Returns every bot agent. Student number is assumed to be '00000000'

```typescript
// /api/bots
type BotsResponse = {
    "agentId": AgentId,
}[]
```

### Games

Returns the outcome and state of the past 'history' games (or all of them is `history == 0`).

```typescript
// /api/games
type GamesRequest = {
    "history": History, 
}

type GamesResponse = {
    "games": AgentGame[],
}
```

### Agent Games

Returns the past 'history' games for agent (or all of them if `history == 0`).

```typescript
// /api/agent-games
type AgentGamesRequest = {
    "history": History, 
}
type AgentGamesResponse = {
    "games": AgentGame[], // games.length = History
}
```

## Batch Queries

Queries that return a statistic for each node.

### Top Winrate

Returns all agents and their winrates, sorted by descending order of winrate.

```typescript
// /api/top-winrate
type TopWinrateResponse = {
   "winrate": Winrate[],
}
```

### Most Improved

Returns agents and their improvement since they first started playing, sorted by descending order of improvement.

```typescript
// /api/most-improved
type MostImprovedResponse = {
   "improvements": Improvement[],
}
```

### Most Improving

Returns agents and their improvement in their recent few games, sorted by descending order of improvement.

```typescript
// /api/most-improving
type MostImprovingResponse = {
   "improvements": Improvement[],
}
```

## individual queries

### Winrate

Returns the overall winrate of a single agent

```typescript
// /api/winrate
type WinrateRequest = {
    "agentId": AgentId,
}

type WinrateResponse = {
   "winrate": Winrate,
}
```

### Total Improvement

```typescript
// /api/improvement
type ImprovementRequest = {
    "agentId": AgentId,
}

type ImprovementResponse = {
   "improvement": Improvement,
}
```

### Rate of Improvement

```typescript
// /api/improvement-rate
type ImprovementRateRequest = {
    "agentId": AgentId,
}

type ImprovementRateResponse = {
   "improvement": Improvement,
}
```
