const { _ } = arcli;

const formatRoute = route => {
    const inputToArray = str => {
        str = String(str)
            .replace(/,/g, ' ')
            .replace(/\s\s+/g, ' ');

        return _.compact(str.split(' ')).map(item => {
            if (String(item).substring(0, 1) !== '/') {
                item = `/${item}`;
            }

            return item;
        });
    };

    return JSON.stringify(
        inputToArray(route)
            .sort()
            .reverse(),
    )
        .replace(/\"/g, "'")
        .replace(/,/g, ', ');
};

module.exports = formatRoute;
