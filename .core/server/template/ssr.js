import serialize from 'serialize-javascript';
import { renderAppBindings } from '../renderer';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: (content, helmet, store, req, res) => {
        return `<!DOCTYPE html>
        <html ${helmet.htmlAttributes.toString()}>
            <head>
                ${req.headTags}
                ${req.styles}
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                ${req.headerScripts}
                ${renderAppBindings(req)}

                <script>
                    window.ssr = true;
                    window.defines = ${serialize(defines)};
                    window.INITIAL_STATE = ${serialize(store.getState())};
                    ${req.appGlobals}
                </script>
                ${req.scripts}
                ${req.appAfterScripts}
            </body>
        </html>`;
    },
};
