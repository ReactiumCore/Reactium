/** generated by createManifest.js **/
module.exports = {
    get: () => {
        return {
            allActions: {
                Test: require('components/Demo/Test/actions').default,
                Router: require('reactium-core/components/Router/actions')
                    .default,
                Toolkit: require('reactium-core/components/Toolkit/actions')
                    .default
            },
            allActionTypes: {
                Test: require('components/Demo/Test/actionTypes').default,
                Router: require('reactium-core/components/Router/actionTypes')
                    .default,
                Toolkit: require('reactium-core/components/Toolkit/actionTypes')
                    .default
            },
            allReducers: {
                Test: require('components/Demo/Test/reducers').default,
                Router: require('reactium-core/components/Router/reducers')
                    .default,
                Toolkit: require('reactium-core/components/Toolkit/reducers')
                    .default
            },
            allInitialStates: {
                Test: require('components/Demo/Test/state').default,
                Router: require('reactium-core/components/Router/state')
                    .default,
                Toolkit: require('reactium-core/components/Toolkit/state')
                    .default
            },
            allRoutes: {
                About: require('components/Demo/Site/Pages/About/route')
                    .default,
                Catering: require('components/Demo/Site/Pages/Catering/route')
                    .default,
                Contact: require('components/Demo/Site/Pages/Contact/route')
                    .default,
                Home: require('components/Demo/Site/Pages/Home/route').default,
                Menu: require('components/Demo/Site/Pages/Menu/route').default,
                Test: require('components/Demo/Test/route').default,
                Toolkit: require('reactium-core/components/Toolkit/route')
                    .default
            },
            allServices: {
                Test: require('components/Demo/Test/services').default,
                Toolkit: require('reactium-core/components/Toolkit/services')
                    .default
            },
            allMiddleware: {
                redux: require('reactium-core/redux/middleware').default
            },
            allEnhancers: {
                redux: require('reactium-core/redux/enhancer').default
            }
        };
    },
    list: () => {
        return {
            allActions: {
                type: 'actions',
                imports: [
                    'components/Demo/Test/actions',
                    'reactium-core/components/Router/actions',
                    'reactium-core/components/Toolkit/actions'
                ]
            },
            allActionTypes: {
                type: 'actionTypes',
                imports: [
                    'components/Demo/Test/actionTypes',
                    'reactium-core/components/Router/actionTypes',
                    'reactium-core/components/Toolkit/actionTypes'
                ]
            },
            allReducers: {
                type: 'reducers',
                imports: [
                    'components/Demo/Test/reducers',
                    'reactium-core/components/Router/reducers',
                    'reactium-core/components/Toolkit/reducers'
                ]
            },
            allInitialStates: {
                type: 'state',
                imports: [
                    'components/Demo/Test/state',
                    'reactium-core/components/Router/state',
                    'reactium-core/components/Toolkit/state'
                ]
            },
            allRoutes: {
                type: 'route',
                imports: [
                    'components/Demo/Site/Pages/About/route',
                    'components/Demo/Site/Pages/Catering/route',
                    'components/Demo/Site/Pages/Contact/route',
                    'components/Demo/Site/Pages/Home/route',
                    'components/Demo/Site/Pages/Menu/route',
                    'components/Demo/Test/route',
                    'reactium-core/components/Toolkit/route'
                ]
            },
            allServices: {
                type: 'services',
                imports: [
                    'components/Demo/Test/services',
                    'reactium-core/components/Toolkit/services'
                ]
            },
            allMiddleware: {
                type: 'middleware',
                imports: ['reactium-core/redux/middleware']
            },
            allEnhancers: {
                type: 'enhancer',
                imports: ['reactium-core/redux/enhancer']
            }
        };
    }
};
