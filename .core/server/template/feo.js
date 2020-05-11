import serialize from 'serialize-javascript';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: req => {
        return `<!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                ${req.styles}
            </head>
            <body>
                ${req.headerScripts}
                ${req.appBindings}

                <script>
                    window.ssr = false;
                    window.defines = ${serialize(defines)};
                    window.restAPI = '/api';
                    window.actiniumAppId = '${actiniumAppId}';
                    ${req.appGlobals}
                </script>
                ${req.scripts}
                ${req.appAfterScripts}
            </body>
        </html>`;
    },
};
