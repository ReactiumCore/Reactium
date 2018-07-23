import DevTools from 'reactium-core/components/DevTools';

export default (enhancers = [], isServer = false) => {
    return [
        {
            name: 'devtools',
            order: -1000,
            enhancer:
                process.env.NODE_ENV === 'development'
                    ? DevTools.instrument()
                    : _ => _
        },
        ...enhancers
    ];
};
