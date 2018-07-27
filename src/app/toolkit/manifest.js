module.exports = {
    header: {
        logo: '/assets/images/atomic-reactor-logo.svg',
        title: 'Style Guide',
        version: 'ver 2.0.1'
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
        base: {
            label: 'Base Styles',
            route: '/toolkit/base',
            elements: {
                colors: {
                    type: 'atom',
                    label: 'Colors',
                    hideCode: true,
                    route: '/toolkit/base/colors',
                    dna: '/toolkit/base/elements/Colors',
                    component: require('appdir/toolkit/base/elements/Colors')
                        .default,
                    readme: require('appdir/toolkit/base/elements/Colors/readme')
                        .default
                }
            }
        },
        typography: {
            label: 'Typography',
            route: '/toolkit/typography',
            elements: {
                paragraph: {
                    type: 'atom',
                    label: 'Paragraph',
                    route: '/toolkit/typography/paragraph',
                    dna: '/toolkit/typography/elements/Paragraph',
                    component: require('appdir/toolkit/typography/elements/Paragraph')
                        .default,
                    readme: require('appdir/toolkit/typography/elements/Paragraph/readme')
                        .default
                },
                headings: {
                    type: 'atom',
                    label: 'Headings',
                    route: '/toolkit/typography/headings',
                    dna: '/toolkit/typography/elements/Headings',
                    component: require('appdir/toolkit/typography/elements/Headings')
                        .default
                },
                'text-link': {
                    type: 'atom',
                    label: 'Text Link',
                    route: '/toolkit/typography/text-link',
                    dna: '/toolkit/typography/elements/TextLink',
                    component: require('appdir/toolkit/typography/elements/TextLink')
                        .default
                },
                lists: {
                    type: 'molecule',
                    label: 'Lists',
                    route: '/toolkit/typography/lists',
                    dna: '/toolkit/typography/elements/Lists',
                    component: require('appdir/toolkit/typography/elements/Lists')
                        .default
                },
                article: {
                    type: 'organism',
                    label: 'Article',
                    route: '/toolkit/typography/article',
                    dna: '/toolkit/typography/elements/Article',
                    component: require('appdir/toolkit/typography/elements/Article')
                        .default
                }
            }
        },
        components: {
            label: 'Components',
            route: '/toolkit/components',
            elements: {
                'redux-component': {
                    type: 'catalyst',
                    label: 'Redux Component',
                    route: '/toolkit/components/redux-component',
                    dna: '/components/Demo/Test',
                    component: '/demo/redux'
                }
            }
        },
        pages: {
            label: 'Pages',
            route: '#',
            elements: {
                'demo-site': {
                    redirect: true,
                    label: 'Demo Site',
                    target: '_blank',
                    route: '/demo/site',
                    type: 'page'
                }
            }
        },
        form: {
            label: 'Form Elements',
            route: '/toolkit/form',
            elements: {
                'text-input': {
                    type: 'atom',
                    label: 'Text Input',
                    route: '/toolkit/form/text-input',
                    dna: '/toolkit/form/elements/TextInput',
                    component: require('appdir/toolkit/form/elements/TextInput')
                        .default,
                    readme: require('appdir/toolkit/form/elements/TextInput/readme')
                        .default
                },
                'text-area': {
                    type: 'atom',
                    label: 'Text Area',
                    route: '/toolkit/form/text-area',
                    dna: '/toolkit/form/elements/TextArea',
                    component: require('appdir/toolkit/form/elements/TextArea')
                        .default,
                    readme: require('appdir/toolkit/form/elements/TextArea/readme')
                        .default
                },
                'number-input': {
                    type: 'atom',
                    label: 'Number Input',
                    route: '/toolkit/form/number-input',
                    dna: '/toolkit/form/elements/NumberInput',
                    component: require('appdir/toolkit/form/elements/NumberInput')
                        .default,
                    readme: require('appdir/toolkit/form/elements/NumberInput/readme')
                        .default
                },
                checkbox: {
                    type: 'atom',
                    label: 'Checkbox',
                    route: '/toolkit/form/checkbox',
                    dna: '/toolkit/form/elements/Checkbox',
                    component: require('appdir/toolkit/form/elements/Checkbox')
                        .default,
                    readme: require('appdir/toolkit/form/elements/Checkbox/readme')
                        .default
                },
                'radio-input': {
                    type: 'atom',
                    label: 'Radio',
                    route: '/toolkit/form/radio-input',
                    dna: '/toolkit/form/elements/RadioInput',
                    component: require('appdir/toolkit/form/elements/RadioInput')
                        .default,
                    readme: require('appdir/toolkit/form/elements/RadioInput/readme')
                        .default
                },
                select: {
                    type: 'atom',
                    label: 'Select',
                    route: '/toolkit/form/select',
                    dna: '/toolkit/form/elements/Select',
                    component: require('appdir/toolkit/form/elements/Select')
                        .default,
                    readme: require('appdir/toolkit/form/elements/Select/readme')
                        .default
                }
            }
        }
    }
};
