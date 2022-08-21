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
    playedIn: {
        type: 'relationship',
        relationship: 'PLAYED_IN',
        direction: 'in',
        properties: {
            score: {
                type: 'float', // don't use abstract supertype 'number'
                default: 0.0
            }
        },
        eager: true,
    },
};
