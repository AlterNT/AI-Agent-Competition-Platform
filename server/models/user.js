export default {
    id: {
      type: 'uuid',
    },
    studentNumber: {
        type: 'string',
        required: true,
        primary: true,
        unique: true,
    },
    authToken: {
        type: 'string',
        required: true,
        unique: true,
    },
    displayName: {
        type: 'string',
        required: false,
        unique: false,
    },
    controls: {
        type: 'relationship',
        relationship: 'CONTROLS',
        direction: 'out',
        unique: true,
        eager: true,
    },
};