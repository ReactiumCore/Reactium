module.exports = (req, res, context) => {
    return `<html>
        <head>
            ${req.styles}
        </head>
        <body>
            <Component type="DevTools"></Component>
            <div id="router"></div>

            <script>
                window.ssr = false;
                window.restAPI = '/api';
                window.parseAppId = '${parseAppId}';
            </script>
            ${req.scripts}
        </body>
    </html>`;
};
