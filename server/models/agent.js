export default {
    id: {
      type: 'uuid',
      primary: true
    },
    srcPath: {
        type: 'string',
        required: true,
        unique: true,
    }, // potential URI to a tar file on the server?
    controls: {
        type: 'relationship',
        relationship: 'CONTROLS',
        direction: 'in',
        unique: true,
        eager: true,
    },
    playedIn: {
        type: 'relationship',
        relationship: 'PLAYED_IN',
        direction: 'out',
        properties: {
            score: {
                type: 'float', // don't use abstract supertype 'number'
                default: 0.0
            }
        },
    },
};
