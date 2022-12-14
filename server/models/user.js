export default {
  id: {
    type: "uuid",
  },
  studentNumber: {
    type: "string",
    required: true,
    primary: true,
    unique: true,
  },
  authToken: {
    type: "string",
    required: true,
    unique: true,
  },
  displayName: {
    type: "string",
    required: true,
    unique: false,
  },
  isBot: {
    type: "boolean",
    required: true,
    unique: false,
    default: false,
  },
  controls: {
    type: "relationship",
    relationship: "CONTROLS",
    direction: "out",
    unique: true,
    eager: true,
  },
};
