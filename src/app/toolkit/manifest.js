export default {
    sidebar: {
        closed: false,
        position: 'left',
    },
    toolbar: {
        buttons: [
            {icon:'#re-icon-dna', name: 'filter-all', label: 'All Elements'},
            {icon: '#re-icon-atom', name: 'filter-atom', label: 'Atoms'},
            {icon: '#re-icon-molecule', name: 'filter-molecule', label: 'Molecules'},
            {icon: '#re-icon-organism', name: 'filter-organism', label: 'Organisms'},
            {icon: '#re-icon-catalyst', name: 'filter-catalyst', label: 'Catalysts'},
            {icon: '#re-icon-template', name: 'filter-template', label: 'Templates'},
            {name: 'spacer'},
            {icon: '#re-icon-settings', name: 'toggle-settings', cls: 'toggle'}
        ]
    },
    menu: {
        typography: {
            label: 'Typography',
            route: '/toolkit/typography',
            elements: {
                'text-link': {
                    type: 'atom',
                    label: 'Text Link',
                    route: '/toolkit/typography/text-link',
                    component: require('appdir/toolkit/typography/elements/TextLink').default,
                },
                'paragraph': {
                    type: 'atom',
                    label: 'Paragraph',
                    route: '/toolkit/typography/paragraph',
                    component: require('appdir/toolkit/typography/elements/Paragraph').default,
                },
            },
        },
        components: {
            label: 'Components',
            route: '/toolkit/components',
            elements: {
                'test-component': {
                    type: 'organism',
                    label: 'Test Component',
                    route: '/toolkit/components/test-component',
                    component: '/test',
                },
            }
        },
        // custom: {
        //     type: 'organism',
        //     label: 'Custom Component',
        //     route: '/toolkit/custom',
        //     component: require('appdir/toolkit/typography').default,
        // },
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
}
