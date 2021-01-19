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

                <script>
                    window.ssr = false;
                    window.defines = ${serialize(defines)};
                    ${req.appGlobals}
                </script>
                ${req.scripts}
                ${req.appAfterScripts}
            </body>
        </html>`;
    },
};
