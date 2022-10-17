export default {
  // TODO: refactor out
  id: {
    type: "uuid",
    primary: true,
  },
  srcPath: {
    type: "string",
    required: true,
    unique: true,
  }, // potential URI to a tar file on the server?
  controls: {
    type: "relationship",
    relationship: "CONTROLS",
    direction: "in",
    unique: true,
    eager: true,
  },
  playedIn: {
    type: "relationships",
    relationship: "PLAYED_IN",
    target: "Game",
    direction: "out",
    properties: {
      score: {
        type: "float", // don't use abstract supertype 'number'
        default: 0.0,
      },
    },
  },
};
