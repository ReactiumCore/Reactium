import serialize from 'serialize-javascript';
import { renderAppBindings } from '../renderer';

module.exports = {
    version: '%TEMPLATE_VERSION%',
    template: (store, req) => {
        return `<!DOCTYPE html>
        <html ${req.helmet.htmlAttributes.toString()}>
            <head>
                ${req.headTags}
                ${req.styles}
                ${req.helmet.title.toString()}
                ${req.helmet.meta.toString()}
                ${req.helmet.link.toString()}
            </head>
            <body ${req.helmet.bodyAttributes.toString()}>
                ${req.headerScripts}
                ${renderAppBindings(req)}

                <script>
                    window.ssr = true;
                    window.defines = ${serialize(defines)};
                    window.INITIAL_STATE = ${req.store &&
                        serialize(req.store.getState())};
                    ${req.appGlobals}
                </script>
                ${req.scripts}
                ${req.appAfterScripts}
            </body>
        </html>`;
    },
};
