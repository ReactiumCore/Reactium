module.exports = gulp => name => {
    const func = function(done) {
        return gulp.task(name)(done);
    };
    func.displayName = name;

    return func;
};
