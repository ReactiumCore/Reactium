const ActionSequence = require('action-sequence');

module.exports = ({ action, props }) => {
    const actions = require('./actions')();

    return ActionSequence({
        actions,
        options: { props },
    })
        .then(success => success)
        .catch(error => error);
};
