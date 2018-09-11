import serialize from 'serialize-javascript';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: (content, helmet, store, req, res) => {
        return `<!DOCTYPE html>
        <html ${helmet.htmlAttributes.toString()}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                ${req.styles}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                <Component type="DevTools"></Component>
                <div id="router">${content}</div>

                <script>
                    window.ssr = true;
                    window.defines = ${serialize(defines)};
                    window.INITIAL_STATE = ${serialize(store.getState())}
                    window.restAPI = '/api';
                    window.parseAppId = '${parseAppId}'
                </script>
                ${req.scripts}
            </body>
        </html>`;
    }
};
