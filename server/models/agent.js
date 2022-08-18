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
};
