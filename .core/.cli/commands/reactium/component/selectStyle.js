const { _, chalk, prefix } = arcli;
const suffix = chalk.magenta(': ');
const styleTypes = require('./styleTypes');

const selectStyle = props => ({
    prefix,
    suffix,
    default: _.first(styleTypes).name,
    type: 'list',
    name: 'styleType',
    choices: _.pluck(styleTypes, 'name'),
    message: 'Select stylesheet type',
    ...props,
});

module.exports = {
    selectStyle,
    styleTypes,
    default: selectStyle,
};
