export default {
    id: {
      type: 'uuid',
    },
    studentNumberString: {
        type: 'string',
        required: true,
        primary: true,
        unique: true,
    },
    authenticationTokenString: {
        type: 'string',
        required: true,
        unique: true,
    },
    controls: {
        type: 'relationship',
        relationship: 'CONTROLS',
        direction: 'out',
        unique: true,
        eager: true,
    },
};
