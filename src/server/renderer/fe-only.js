module.exports = (req, res, context) => {
    return `<html>
        <head>
            <link rel="stylesheet" href="/assets/style/style.css" />
        </head>
        <body>
            <Component type="DevTools"></Component>
            <div id="router"></div>

            <script>
                window.ssr = false;
                window.restAPI = '/api';
                window.parseAppId = '${parseAppId}'
            </script>
            ${req.scripts}
        </body>
    </html>`;
};
