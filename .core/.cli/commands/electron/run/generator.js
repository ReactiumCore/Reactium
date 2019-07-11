const ActionSequence = require('action-sequence');

module.exports = ({ action, params, props }) => {
    const actions = require('./actions')();

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            return success;
        })
        .catch(error => {
            return error;
        });
};
