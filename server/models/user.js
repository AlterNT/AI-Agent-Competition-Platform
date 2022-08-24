export default {
    id: {
      type: 'uuid',
    },
    studentNumberString: {
        type: 'string',
        required: true,
    },
    authenticationTokenString: {
        type: 'string',
        primary: true,
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
