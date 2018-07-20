module.exports = template => (req, res, context) =>
    Promise.resolve(template(req, res, context));
