export default {
    id: {
      type: 'uuid',
      primary: true
    },
    timePlayed: 'datetime',
    gameState: {
        type: 'string',
        required: 'true',
    }, // to be stored as a JSON string
};
