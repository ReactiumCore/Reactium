module.exports = {
    header: {
        logo: '/assets/images/atomic-reactor-logo.svg',
        title: 'Style Guide',
        version: 'ver 2.1.1'
    },
    overview: require('appdir/toolkit/overview').default,
    themes: [
        {
            name: 'Default',
            css: '/assets/style/style.css',
            selected: true
        }
    ],
    sidebar: {
        closed: false,
        position: 'left'
    },
    toolbar: {
        buttons: [
            {
                icon: '#re-icon-dna',
                name: 'filter-all',
                label: 'All Elements'
            },
            {
                icon: '#re-icon-atom',
                name: 'filter-atom',
                label: 'Atoms'
            },
            {
                icon: '#re-icon-molecule',
                name: 'filter-molecule',
                label: 'Molecules'
            },
            {
                icon: '#re-icon-organism',
                name: 'filter-organism',
                label: 'Organisms'
            },
            {
                icon: '#re-icon-catalyst',
                name: 'filter-catalyst',
                label: 'Catalyst'
            },
            {
                icon: '#re-icon-page',
                name: 'filter-page',
                label: 'Pages'
            },
            {
                icon: '#re-icon-template',
                name: 'filter-template',
                label: 'Templates'
            },
            {
                name: 'spacer'
            },
            {
                icon: '#re-icon-settings',
                name: 'toggle-settings',
                cls: 'toggle'
            }
        ]
    },
    menu: {
        global: {
            label: 'Global',
            route: '/toolkit/global',
            elements: {
                colors: {
                    type: 'atom',
                    label: 'Colors',
                    hideCode: true,
                    route: '/toolkit/global/colors',
                    dna: '/toolkit/global/Colors',
                    component: require('appdir/toolkit/global/Colors').default,
                    readme: require('appdir/toolkit/global/Colors/readme')
                        .default
                },
                grid: {
                    type: 'atom',
                    label: 'Grid',
                    route: '/toolkit/global/grid',
                    dna: '/toolkit/global/Grid',
                    component: require('appdir/toolkit/global/Grid').default,
                    readme: require('appdir/toolkit/global/Grid/readme').default
                }
            }
        },
        typography: {
            label: 'Typography',
            route: '/toolkit/typography',
            elements: {}
        },
        buttons: {
            label: 'Buttons',
            route: '/toolkit/buttons',
            elements: {}
        },
        form: {
            label: 'Form Elements',
            route: '/toolkit/form',
            elements: {}
        },
        components: {
            label: 'Components',
            route: '/toolkit/components',
            elements: {}
        },
        pages: {
            label: 'Pages',
            route: '#',
            elements: {}
        }
    }
};
