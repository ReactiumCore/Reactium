export default {
    menu: {
        typography: {
            label: 'Typography',
            link: '/toolkit/typography',
            elements: {
                'paragraph': {
                    type: 'atom',
                    label: 'Paragraph',
                    link: '/toolkit/typography/paragraph',
                    component: require('appdir/toolkit/typography/elements/Paragraph').default,
                },
                'text-link': {
                    type: 'atom',
                    label: 'Text Link',
                    link: '/toolkit/typography/text-link',
                    component: require('appdir/toolkit/typography/elements/TextLink').default,
                },
                'test-component': {
                    type: 'organism',
                    label: 'Test Component',
                    link: '/toolkit/typography/test-component',
                    component: '/test',
                },
            },
        },
        custom: {
            label: 'Custom Component',
            link: '/toolkit/custom',
            component: require('appdir/toolkit/typography').default,
        },
        navaway: {
            label: 'Nav Away',
            link: '/test',
            redirect: true,
            elements: {
                'navaway-sub': {
                    type: 'page',
                    label: 'Nav Away - Element',
                    link: '/test',
                    redirect: true
                },
            }
        },
        navout: {
            label: 'Nav Away Blank',
            link: '/test',
            redirect: true,
            target: '_blank',
            elements: {
                'navout-sub': {
                    type: 'page',
                    label: 'Nav Away - Element Blank',
                    link: '/test',
                    redirect: true,
                    target: '_blank',
                }
            }
        }
    },
}
