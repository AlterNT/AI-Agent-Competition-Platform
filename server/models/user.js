export default {
    id: {
      type: 'uuid',
      primary: true
    },
    studentNumberString: {
        type: 'string',
        required: true,
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
    },
};
