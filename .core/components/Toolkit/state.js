/**
 Toolkit Initial State
*/

export default {
    persist: ['prefs', 'style'],
    version: '2.0.2',
    style: '/assets/style/style.css',
    prefs: {
        code: {
            all: false,
        },
        codeColor: {
            all: 'light',
        },
        docs: {
            all: false,
        },
        dna: {
            all: false,
        },
        sidebar: {
            position: 'left',
            expanded: true,
        },
        menu: {
            all: false,
        },
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
            text: ['Menu: expanded', 'Menu: collapsed'],
            values: [false, true],
            pref: 'menu.all',
            help: 'Expand or collapse all menu items',
            default: false,
        },
        {
            text: ['Documentation: collapsed', 'Documentation: expanded'],
            values: [false, true],
            pref: 'docs.all',
            help: 'Expand or collapse all documentation',
            default: false,
        },
        {
            text: ['DNA: collapsed', 'DNA: expanded'],
            values: [false, true],
            pref: 'link.all',
            help: 'Expand or collapse all DNA views',
            default: false,
        },
        {
            text: ['Code view: collapsed', 'Code view: expanded'],
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
            default: 'light',
        },
        {
            text: ['Syntax wrap text: no', 'Syntax wrap text: yes'],
            values: [false, true],
            pref: 'syntax.wrap',
            help: 'Wrap code view lines at 80 columns',
            default: false,
        },
    ],
};
