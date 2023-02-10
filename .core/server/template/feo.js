import serialize from 'serialize-javascript';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: req => {
        return `<!DOCTYPE html>
        <html>
            <head>
                ${req.headTags}
                ${req.styles}
            </head>
            <body>
                ${req.headerScripts}
                ${req.appBindings}

                <div data-reactium-bind="Loader"></div>
                <div data-reactium-bind="App"></div>
                <div data-reactium-bind="Foo"></div>
                <div data-reactium-bind="Bar"></div>

                <script>
                    window.defines = ${serialize(defines)};
                    ${req.appGlobals}
                </script>
                ${req.scripts}
                ${req.appAfterScripts}
            </body>
        </html>`;
    },
};
