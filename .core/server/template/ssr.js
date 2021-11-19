import serialize from 'serialize-javascript';
import { renderAppBindings } from '../renderer';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: req => {
        return `<!DOCTYPE html>
        <html ${req.helmet.htmlAttributes}>
            <head>
                ${req.headTags}
                ${req.styles}
                ${req.helmet.title}
                ${req.helmet.meta}
                ${req.helmet.link}
            </head>
            <body ${req.helmet.bodyAttributes}>
                ${req.headerScripts}
                ${renderAppBindings(req)}

                <script>
                    window.ssr = true;
                    window.defines = ${serialize(defines)};
                    ${req.appGlobals}
                </script>
                ${req.scripts}
                ${req.appAfterScripts}
            </body>
        </html>`;
    },
};
