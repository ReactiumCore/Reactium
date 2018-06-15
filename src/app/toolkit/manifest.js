export default {
    header: {
        logo    : '/assets/images/logo.png',
        title   : 'Style Guide',
        version : 'ver 2.0.1',
    },
    overview: require('appdir/toolkit/overview').default,
    themes: [
        {name: 'Default', css: '/assets/style/style.css', selected: true},
        {name: 'Test', css: '/assets/style/style-test.css'},
    ],
    sidebar: {
        closed   : false,
        position : 'left',
    },
    toolbar: {
        buttons: [
            {icon:'#re-icon-dna', name: 'filter-all', label: 'All Elements'},
            {icon: '#re-icon-atom', name: 'filter-atom', label: 'Atoms'},
            {icon: '#re-icon-molecule', name: 'filter-molecule', label: 'Molecules'},
            {icon: '#re-icon-organism', name: 'filter-organism', label: 'Organisms'},
            {icon: '#re-icon-catalyst', name: 'filter-catalyst', label: 'Catalyst'},
            {icon: '#re-icon-page', name: 'filter-page', label: 'Pages'},
            {icon: '#re-icon-template', name: 'filter-template', label: 'Templates'},
            {name: 'spacer'},
            {icon: '#re-icon-settings', name: 'toggle-settings', cls: 'toggle'}
        ]
    },
    menu: {
        typography: {
            label    : 'Typography',
            route    : '/toolkit/typography',
            elements : {
                'paragraph': {
                    type      : 'atom',
                    label     : 'Paragraph',
                    route     : '/toolkit/typography/paragraph',
                    component : require('appdir/toolkit/typography/elements/Paragraph').default,
                    readme    : require('appdir/toolkit/typography/elements/Paragraph/readme').default,
                },
                'text-link': {
                    type      : 'atom',
                    label     : 'Text Link',
                    route     : '/toolkit/typography/text-link',
                    component : require('appdir/toolkit/typography/elements/TextLink').default,
                },
            },
        },
        components: {
            label    : 'Components',
            route    : '/toolkit/components',
            elements : {
                'test-component': {
                    type      : 'organism',
                    label     : 'Test Component',
                    route     : '/toolkit/components/test-component',
                    component : '/test',
                },
            }
        },
        custom: {
            type      : 'organism',
            label     : 'Custom View',
            route     : '/toolkit/custom',
            component : require('appdir/toolkit/typography').default,
        },
        // navaway: {
        //     label: 'Nav Away',
        //     route: '/test',
        //     redirect: true,
        //     elements: {
        //         'navaway-sub': {
        //             type: 'page',
        //             label: 'Nav Away - Element',
        //             route: '/test',
        //             redirect: true
        //         },
        //     }
        // },
        // navout: {
        //     label: 'Nav Away Blank',
        //     route: '/test',
        //     redirect: true,
        //     target: '_blank',
        //     elements: {
        //         'navout-sub': {
        //             type: 'page',
        //             label: 'Nav Away - Element Blank',
        //             route: '/test',
        //             redirect: true,
        //             target: '_blank',
        //         }
        //     }
        // }
    },
    settings: [
        {
            text: ['Sidebar position: left', 'Sidebar position: right'],
            values: ['left', 'right'],
            pref: 'sidebar.position',
            labels: ['R', 'L'],
            default: 'left',
        },
        {
            text: ['Expand documentation', 'Collapse documentation'],
            values: [false, true],
            pref: 'docs.all',
            help: 'Expand or collapse all documentation',
            default: false,
        },
        {
            text: ['Expand code view', 'Collapse code view'],
            values: [false, true],
            pref: 'code.all',
            help: 'Expand or collapse all code views',
            default: false,
        },
        {
            text: ['Syntax highlighting: light', 'Syntax highlighting: dark'],
            values: ['light', 'dark'],
            pref: 'codeColor.all',
            help: 'Switch the code view syntax highlighting',
            default: 'dark',
        },
    ]
}
