export default {
    id: {
      type: 'uuid',
    },
    adminToken: {
        type: 'string',
        required: true,
        primary: true,
        unique: true,
    },
};
