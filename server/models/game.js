export default {
  id: {
    type: "uuid",
    primary: true,
  },
  timePlayed: {
    type: "datetime",
    default: () => new Date(),
    required: true,
  },
  gameState: {
    type: "string",
    default: "[]",
    required: true,
  }, // to be stored as a JSON string
  isTournament: {
    type: "boolean",
    required: true,
    unique: false,
    default: false,
  },
  playedIn: {
    type: "relationships",
    relationship: "PLAYED_IN",
    direction: "in",
    target: "Agent",
    properties: {
      score: {
        type: "float", // don't use abstract supertype 'number'
        default: 0.0,
      },
    },
    eager: true,
  },
};
