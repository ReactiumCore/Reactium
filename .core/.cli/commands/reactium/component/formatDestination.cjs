const formatDestination = val => {
    const { cwd } = arcli.props;

    val = arcli.normalizePath(val);
    val = String(val).replace(/^~\/|^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);
    val = String(val).replace(
        /^\/core\/|^core\/|^core/i,
        `${cwd}/.core/components/`,
    );
    val = String(val).replace(
        /^\/components\/|^components\/|^components$/i,
        `${cwd}/src/app/components/`,
    );
    val = String(val).replace(
        /^\/common-ui\/|^common-ui\/|^common-ui$/i,
        `${cwd}/src/app/components/common-ui/`,
    );

    return arcli.normalizePath(val);
};

module.exports = formatDestination;
