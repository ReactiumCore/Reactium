module.exports = {
    header: {
        logo: '/assets/images/atomic-reactor-logo.svg',
        title: 'Style Guide',
        version: '2.1.1',
    },
    overview: require('appdir/toolkit/overview').default,
    themes: [
        {
            name: 'Default',
            css: '/assets/style/style.css',
            selected: true,
        },
        {
            name: 'Theme 1',
            css: '/assets/style/theme-1.css',
        },
        {
            name: 'Theme 2',
            css: '/assets/style/theme-2.css',
        },
    ],
    sidebar: {
        closed: false,
        position: 'left',
    },
    toolbar: {
        buttons: [
            {
                icon: '#re-icon-dna',
                name: 'filter-all',
                label: 'All Elements',
            },
            {
                icon: '#re-icon-atom',
                name: 'filter-atom',
                label: 'Atoms',
            },
            {
                icon: '#re-icon-molecule',
                name: 'filter-molecule',
                label: 'Molecules',
            },
            {
                icon: '#re-icon-organism',
                name: 'filter-organism',
                label: 'Organisms',
            },
            {
                icon: '#re-icon-catalyst',
                name: 'filter-catalyst',
                label: 'Catalyst',
            },
            {
                icon: '#re-icon-page',
                name: 'filter-page',
                label: 'Pages',
            },
            {
                icon: '#re-icon-template',
                name: 'filter-template',
                label: 'Templates',
            },
            {
                name: 'spacer',
            },
            {
                icon: '#re-icon-settings',
                name: 'toggle-settings',
                cls: 'toggle',
            },
        ],
    },
    menu: {
        global: {
            label: 'Global',
            route: '/toolkit/global',
            elements: {
                theming: {
                    type: 'organism',
                    label: 'Theming',
                    route: '/toolkit/global/theming',
                    dna: '/toolkit/global/Theming',
                    component: require('appdir/toolkit/global/Theming').default,
                    readme: require('appdir/toolkit/global/Theming/readme')
                        .default,
                    hideCode: true,
                    hideDna: true,
                    hideDocs: false,
                },
                colors: {
                    type: 'atom',
                    label: 'Colors',
                    hideCode: true,
                    route: '/toolkit/global/colors',
                    dna: '/toolkit/global/Colors',
                    component: require('appdir/toolkit/global/Colors').default,
                    readme: require('appdir/toolkit/global/Colors/readme')
                        .default,
                },
                grid: {
                    type: 'atom',
                    label: 'Responsive Grid',
                    route: '/toolkit/global/grid',
                    dna: '/toolkit/global/Grid',
                    hideCode: true,
                    hideDna: true,
                    hideDocs: true,
                    component: require('appdir/toolkit/global/Grid').default,
                    readme: require('appdir/toolkit/global/Grid/readme')
                        .default,
                },
                spacing: {
                    type: 'atom',
                    label: 'Spacing',
                    route: '/toolkit/global/spacing',
                    dna: '/toolkit/global/Spacing',
                    hideCode: true,
                    hideDna: true,
                    hideDocs: true,
                    component: require('appdir/toolkit/global/Spacing').default,
                    readme: require('appdir/toolkit/global/Spacing/readme')
                        .default,
                },
            },
        },
        typography: {
            label: 'Typography',
            route: '/toolkit/typography',
            elements: {
                fonts: {
                    type: 'atom',
                    label: 'Fonts',
                    route: '/toolkit/typography/fonts',
                    dna: '/toolkit/typography/Fonts',
                    hideDna: true,
                    hideCode: true,
                    hideDocs: true,
                    component: require('appdir/toolkit/typography/Fonts')
                        .default,
                    readme: require('appdir/toolkit/typography/Fonts/readme')
                        .default,
                },
                headings: {
                    type: 'atom',
                    label: 'Headings',
                    route: '/toolkit/typography/headings',
                    dna: '/toolkit/typography/Headings',
                    hideCode: true,
                    component: require('appdir/toolkit/typography/Headings')
                        .default,
                    readme: require('appdir/toolkit/typography/Headings/readme')
                        .default,
                },
                paragraph: {
                    type: 'atom',
                    label: 'Paragraph',
                    route: '/toolkit/typography/paragraph',
                    dna: '/toolkit/typography/Paragraph',
                    component: require('appdir/toolkit/typography/Paragraph')
                        .default,
                    readme: require('appdir/toolkit/typography/Paragraph/readme')
                        .default,
                },
                'text-link': {
                    type: 'atom',
                    label: 'Text Link',
                    route: '/toolkit/typography/text-link',
                    dna: '/toolkit/typography/TextLink',
                    hideDna: true,
                    hideCode: true,
                    component: require('appdir/toolkit/typography/TextLink')
                        .default,
                    readme: require('appdir/toolkit/typography/TextLink/readme')
                        .default,
                },
                'text-strong': {
                    type: 'atom',
                    label: 'Strong Text',
                    route: '/toolkit/typography/text-strong',
                    dna: '/toolkit/typography/TextStrong',
                    component: require('appdir/toolkit/typography/TextStrong')
                        .default,
                    readme: require('appdir/toolkit/typography/TextStrong/readme')
                        .default,
                },
                'text-italic': {
                    type: 'atom',
                    label: 'Italic Text',
                    route: '/toolkit/typography/text-italic',
                    dna: '/toolkit/typography/TextItalic',
                    component: require('appdir/toolkit/typography/TextItalic')
                        .default,
                    readme: require('appdir/toolkit/typography/TextItalic/readme')
                        .default,
                },
                'text-underline': {
                    type: 'atom',
                    label: 'Underlined Text',
                    route: '/toolkit/typography/text-underline',
                    dna: '/toolkit/typography/TextUnderline',
                    component: require('appdir/toolkit/typography/TextUnderline')
                        .default,
                    readme: require('appdir/toolkit/typography/TextUnderline/readme')
                        .default,
                },
                'text-strike': {
                    type: 'atom',
                    label: 'Strikethrough Text',
                    route: '/toolkit/typography/text-strike',
                    dna: '/toolkit/typography/TextStrike',
                    component: require('appdir/toolkit/typography/TextStrike')
                        .default,
                    readme: require('appdir/toolkit/typography/TextStrike/readme')
                        .default,
                },
                'text-super': {
                    type: 'atom',
                    label: 'Superscript',
                    route: '/toolkit/typography/text-super',
                    dna: '/toolkit/typography/TextSuper',
                    component: require('appdir/toolkit/typography/TextSuper')
                        .default,
                    readme: require('appdir/toolkit/typography/TextSuper/readme')
                        .default,
                },
                'text-sub': {
                    type: 'atom',
                    label: 'Subscript',
                    route: '/toolkit/typography/text-sub',
                    dna: '/toolkit/typography/TextSub',
                    component: require('appdir/toolkit/typography/TextSub')
                        .default,
                    readme: require('appdir/toolkit/typography/TextSub/readme')
                        .default,
                },
                'text-small': {
                    type: 'atom',
                    label: 'Small Text',
                    route: '/toolkit/typography/text-small',
                    dna: '/toolkit/typography/TextSmall',
                    component: require('appdir/toolkit/typography/TextSmall')
                        .default,
                    readme: require('appdir/toolkit/typography/TextSmall/readme')
                        .default,
                },
                blockquote: {
                    type: 'atom',
                    label: 'Blockquote',
                    route: '/toolkit/typography/blockquote',
                    dna: '/toolkit/typography/Blockquote',
                    component: require('appdir/toolkit/typography/Blockquote')
                        .default,
                    readme: require('appdir/toolkit/typography/Blockquote/readme')
                        .default,
                },
                'list-unordered': {
                    type: 'atom',
                    label: 'Unordered List',
                    route: '/toolkit/typography/list-unordered',
                    dna: '/toolkit/typography/ListUnordered',
                    component: require('appdir/toolkit/typography/ListUnordered')
                        .default,
                    readme: require('appdir/toolkit/typography/ListUnordered/readme')
                        .default,
                },
                'list-ordered': {
                    type: 'atom',
                    label: 'Ordered List',
                    route: '/toolkit/typography/list-ordered',
                    dna: '/toolkit/typography/ListOrdered',
                    component: require('appdir/toolkit/typography/ListOrdered')
                        .default,
                    readme: require('appdir/toolkit/typography/ListOrdered/readme')
                        .default,
                },
                'text-align': {
                    type: 'atom',
                    label: 'Text Align',
                    hideCode: true,
                    hideDna: true,
                    hideDocs: true,
                    route: '/toolkit/typography/text-align',
                    dna: '/toolkit/typography/TextAlign',
                    component: require('appdir/toolkit/typography/TextAlign')
                        .default,
                    readme: require('appdir/toolkit/typography/TextAlign/readme')
                        .default,
                },
            },
        },
        buttons: {
            label: 'Buttons',
            route: '/toolkit/buttons/button-overview',
            elements: {
                'button-overview': {
                    type: 'organism',
                    label: 'Overview',
                    route: '/toolkit/buttons/button-overview',
                    dna: '/toolkit/buttons/ButtonOverview',
                    hideCode: true,
                    component: require('appdir/toolkit/buttons/ButtonOverview')
                        .default,
                },
                'button-primary': {
                    type: 'atom',
                    label: 'Primary Button',
                    route: '/toolkit/buttons/button-primary',
                    dna: '/toolkit/buttons/ButtonPrimary',
                    hideDna: true,
                    hideCode: true,
                    component: require('appdir/toolkit/buttons/ButtonPrimary')
                        .default,
                    readme: require('appdir/toolkit/buttons/ButtonPrimary/readme')
                        .default,
                },
                'button-secondary': {
                    type: 'atom',
                    label: 'Secondary Button',
                    route: '/toolkit/buttons/button-secondary',
                    dna: '/toolkit/buttons/ButtonSecondary',
                    hideDna: true,
                    hideCode: true,
                    component: require('appdir/toolkit/buttons/ButtonSecondary')
                        .default,
                    readme: require('appdir/toolkit/buttons/ButtonSecondary/readme')
                        .default,
                },
                'button-tertiary': {
                    type: 'atom',
                    label: 'Tertiary Button',
                    route: '/toolkit/buttons/button-tertiary',
                    dna: '/toolkit/buttons/ButtonTertiary',
                    hideDna: true,
                    hideCode: true,
                    component: require('appdir/toolkit/buttons/ButtonTertiary')
                        .default,
                    readme: require('appdir/toolkit/buttons/ButtonTertiary/readme')
                        .default,
                },
                'button-state': {
                    type: 'atom',
                    label: 'Button States',
                    route: '/toolkit/buttons/button-state',
                    dna: '/toolkit/buttons/ButtonState',
                    hideDna: true,
                    hideCode: true,
                    component: require('appdir/toolkit/buttons/ButtonState')
                        .default,
                    readme: require('appdir/toolkit/buttons/ButtonState/readme')
                        .default,
                },
                'button-size': {
                    type: 'atom',
                    label: 'Button Sizing',
                    route: '/toolkit/buttons/button-size',
                    dna: '/toolkit/buttons/ButtonSize',
                    hideDna: true,
                    hideCode: true,
                    component: require('appdir/toolkit/buttons/ButtonSize')
                        .default,
                    readme: require('appdir/toolkit/buttons/ButtonSize/readme')
                        .default,
                },
                'button-block': {
                    type: 'atom',
                    label: 'Button Block',
                    route: '/toolkit/buttons/button-block',
                    dna: '/toolkit/buttons/ButtonBlock',
                    hideDna: true,
                    component: require('appdir/toolkit/buttons/ButtonBlock')
                        .default,
                    readme: require('appdir/toolkit/buttons/ButtonBlock/readme')
                        .default,
                },
            },
        },
        form: {
            label: 'Form Elements',
            route: '/toolkit/form',
            elements: {
                textfield: {
                    type: 'atom',
                    label: 'Text Field',
                    route: '/toolkit/form/textfield',
                    dna: '/toolkit/form/Textfield',
                    component: require('appdir/toolkit/form/Textfield').default,
                    readme: require('appdir/toolkit/form/Textfield/readme')
                        .default,
                },
                textarea: {
                    type: 'atom',
                    label: 'Text Area',
                    route: '/toolkit/form/textarea',
                    dna: '/toolkit/form/Textarea',
                    component: require('appdir/toolkit/form/Textarea').default,
                    readme: require('appdir/toolkit/form/Textarea/readme')
                        .default,
                },
                select: {
                    type: 'atom',
                    label: 'Select',
                    route: '/toolkit/form/select',
                    dna: '/toolkit/form/Select',
                    component: require('appdir/toolkit/form/Select').default,
                    readme: require('appdir/toolkit/form/Select/readme')
                        .default,
                },
                checkbox: {
                    type: 'catalyst',
                    label: 'Checkbox',
                    route: '/toolkit/form/checkbox',
                    dna: '/toolkit/form/CompCheckbox',
                    hideCode: true,
                    component: require('appdir/toolkit/form/CompCheckbox')
                        .default,
                    readme: require('appdir/toolkit/form/CompCheckbox/readme')
                        .default,
                },
                radio: {
                    type: 'catalyst',
                    label: 'Radio',
                    route: '/toolkit/form/radio',
                    dna: '/toolkit/form/CompRadio',
                    hideCode: true,
                    component: require('appdir/toolkit/form/CompRadio').default,
                    readme: require('appdir/toolkit/form/CompRadio/readme')
                        .default,
                },
            },
        },
        components: {
            label: 'Components',
            route: '/toolkit/components',
            hideEmpty: true,
            elements: {},
        },
        pages: {
            label: 'Pages',
            route: '#',
            hideEmpty: true,
            elements: {},
        },
        icons: {
            label: 'Icons',
            route: '/toolkit/icons',
            elements: {
                'linear-icons': {
                    type: 'molecule',
                    label: 'Linearicons',
                    route: '/toolkit/icons/linear-icons',
                    dna: '/toolkit/icons/LinearIcons',
                    component: require('appdir/toolkit/icons/LinearIcons')
                        .default,
                    readme: require('appdir/toolkit/icons/LinearIcons/readme')
                        .default,
                },
            },
        },
    },
};
