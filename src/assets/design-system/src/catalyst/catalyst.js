'use strict';

/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */

const React       = require('react');
const ReactDOM    = require('react-dom');

/**
 * -----------------------------------------------------------------------------
 * Scan DOM for elements that have `[data-cmp]` attribute and render React
 * components inside of them.
 * -----------------------------------------------------------------------------
 */

let reactify = document.querySelectorAll('[data-cmp]');
if (reactify.length > 0) {
    reactify.forEach((elm) => {

        let req      = null;
        let cname    = (elm.dataset.hasOwnProperty('cmp')) ? elm.dataset.cmp : null;

        if (cname === null) { return; }

        // Load component from `components` directory
        try { req = require(__dirname + '/components/' + cname + '.js'); } catch (err) { }

        // Look in node_modules for component if not found in `components` directory
        if (req === null) { try { req = require(cname); } catch (err) { } }


        if (req !== null) {
            // Get parameters from container element
            let params    = {};
            let attrs     = elm.attributes;

            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                if (attr.name === 'data-cmp') { continue; }

                params[attr.name] = attr.value;
            }

            // Create the React element and apply parameters
            let cmp = React.createElement(req, params);

            // Render the React element
            ReactDOM.render(cmp, elm);

        } else {
            console.log(`${cname} component does not exist`);
        }
    });
}

