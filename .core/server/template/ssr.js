import serialize from 'serialize-javascript';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: (content, helmet, store, req, res) => {
        return `<html ${helmet.htmlAttributes.toString()}>
            <head>
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
                    window.INITIAL_STATE = ${serialize(store.getState())}
                    window.restAPI = '/api';
                    window.parseAppId = '${parseAppId}'
                </script>
                ${req.scripts}
            </body>
        </html>`;
    }
};
