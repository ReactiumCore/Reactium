import Parse from 'appdir/api';

const fetchHello = () => {
    return Parse.Cloud.run('hello');
};

export default {
    fetchHello,
}
