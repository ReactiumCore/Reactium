module.exports = {
    "header": {
        "logo": "/assets/images/atomic-reactor-logo.svg",
        "title": "Style Guide",
        "version": "ver 2.0.1"
    },
    "overview": require('appdir/toolkit/overview').default,
    "themes": [{
        "name": "Default",
        "css": "/assets/style/style.css",
        "selected": true
    }, {
        "name": "Test",
        "css": "/assets/style/style-test.css"
    }],
    "sidebar": {
        "closed": false,
        "position": "left"
    },
    "toolbar": {
        "buttons": [{
            "icon": "#re-icon-dna",
            "name": "filter-all",
            "label": "All Elements"
        }, {
            "icon": "#re-icon-atom",
            "name": "filter-atom",
            "label": "Atoms"
        }, {
            "icon": "#re-icon-molecule",
            "name": "filter-molecule",
            "label": "Molecules"
        }, {
            "icon": "#re-icon-organism",
            "name": "filter-organism",
            "label": "Organisms"
        }, {
            "icon": "#re-icon-catalyst",
            "name": "filter-catalyst",
            "label": "Catalyst"
        }, {
            "icon": "#re-icon-page",
            "name": "filter-page",
            "label": "Pages"
        }, {
            "icon": "#re-icon-template",
            "name": "filter-template",
            "label": "Templates"
        }, {
            "name": "spacer"
        }, {
            "icon": "#re-icon-settings",
            "name": "toggle-settings",
            "cls": "toggle"
        }]
    },
    "menu": {
        "typography": {
            "label": "Typography",
            "route": "/toolkit/typography",
            "elements": {
                "paragraph": {
                    "type": "atom",
                    "label": "Paragraph",
                    "route": "/toolkit/typography/paragraph",
                    "dna": "/toolkit/typography/elements/Paragraph",
                    "component": require('appdir/toolkit/typography/elements/Paragraph').default,
                    "readme": require('appdir/toolkit/typography/elements/Paragraph/readme').default
                },
                "headings": {
                    "type": "atom",
                    "label": "Headings",
                    "route": "/toolkit/typography/headings",
                    "dna": "/toolkit/typography/elements/Headings",
                    "component": require('appdir/toolkit/typography/elements/Headings').default
                },
                "text-link": {
                    "type": "atom",
                    "label": "Text Link",
                    "route": "/toolkit/typography/text-link",
                    "dna": "/toolkit/typography/elements/TextLink",
                    "component": require('appdir/toolkit/typography/elements/TextLink').default
                },
                "lists": {
                    "type": "molecule",
                    "label": "Lists",
                    "route": "/toolkit/typography/lists",
                    "dna": "/toolkit/typography/elements/Lists",
                    "component": require('appdir/toolkit/typography/elements/Lists').default
                },
                "article": {
                    "type": "organism",
                    "label": "Article",
                    "route": "/toolkit/typography/article",
                    "dna": "/toolkit/typography/elements/Article",
                    "component": require('appdir/toolkit/typography/elements/Article').default
                }
            }
        },
        "buttons": {
            "label": "Buttons",
            "route": "/toolkit/buttons",
            "elements": {}
        },
        "components": {
            "label": "Components",
            "route": "/toolkit/components",
            "elements": {
                "test-component": {
                    "type": "organism",
                    "label": "Test Component",
                    "route": "/toolkit/components/test-component",
                    "dna": "/components/Test",
                    "component": "/test"
                }
            }
        },
        "pages": {
            "label": "Pages",
            "route": "/toolkit/pages",
            "elements": {}
        },
        "form": {
            "label": "Form Elements",
            "route": "/toolkit/form",
            "elements": {
                "text-input": {
                    "type": "atom",
                    "label": "Text Input",
                    "route": "/toolkit/form/TextInput",
                    "dna": "/toolkit/form/elements/TextInput",
                    "component": require('appdir/toolkit/form/elements/TextInput').default,
                    "readme": require('appdir/toolkit/form/elements/TextInput/readme').default
                },
                "text-area": {
                    "type": "atom",
                    "label": "Text Area",
                    "route": "/toolkit/form/text-area",
                    "dna": "/toolkit/form/elements/TextArea",
                    "component": require('appdir/toolkit/form/elements/TextArea').default,
                    "readme": require('appdir/toolkit/form/elements/TextArea/readme').default
                },
                "number-input": {
                    "type": "atom",
                    "label": "Number Input",
                    "route": "/toolkit/form/number-input",
                    "dna": "/toolkit/form/elements/NumberInput",
                    "component": require('appdir/toolkit/form/elements/NumberInput').default,
                    "readme": require('appdir/toolkit/form/elements/NumberInput/readme').default
                },
                "checkbox": {
                    "type": "atom",
                    "label": "Checkbox",
                    "route": "/toolkit/form/checkbox",
                    "dna": "/toolkit/form/elements/Checkbox",
                    "component": require('appdir/toolkit/form/elements/Checkbox').default,
                    "readme": require('appdir/toolkit/form/elements/Checkbox/readme').default
                },
                "radio-input": {
                    "type": "atom",
                    "label": "Radio",
                    "route": "/toolkit/form/radio-input",
                    "dna": "/toolkit/form/elements/RadioInput",
                    "component": require('appdir/toolkit/form/elements/RadioInput').default,
                    "readme": require('appdir/toolkit/form/elements/RadioInput/readme').default
                },
            }
        }
    },
    "settings": [{
        "text": ["Sidebar position: left", "Sidebar position: right"],
        "values": ["left", "right"],
        "pref": "sidebar.position",
        "labels": ["R", "L"],
        "default": "left"
    }, {
        "text": ["Expand documentation", "Collapse documentation"],
        "values": [false, true],
        "pref": "docs.all",
        "help": "Expand or collapse all documentation",
        "default": false
    }, {
        "text": ["Expand DNA", "Collapse DNA"],
        "values": [false, true],
        "pref": "link.all",
        "help": "Expand or collapse all DNA views",
        "default": false
    }, {
        "text": ["Expand code view", "Collapse code view"],
        "values": [false, true],
        "pref": "code.all",
        "help": "Expand or collapse all code views",
        "default": false
    }, {
        "text": ["Syntax highlighting: light", "Syntax highlighting: dark"],
        "values": ["light", "dark"],
        "pref": "codeColor.all",
        "help": "Switch the code view syntax highlighting",
        "default": "dark"
    }]
};
