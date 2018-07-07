const version = "2.1.0";
const renderer = (req, res, context) => {
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

module.exports = {
    version,
    renderer
};
