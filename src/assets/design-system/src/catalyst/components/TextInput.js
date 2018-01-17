/**
 * Created by rkanculakunta on 9/15/17.
 */

"use strict";

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const React = require("react");

/**
 * -----------------------------------------------------------------------------
 * Simple component to demonstrate the toolkit's ability to compile React
 * -----------------------------------------------------------------------------
 */
const TextInput = props => (
    <div className="input-wrapper">
        <input className="input-wrapper__text-input" type="text" />
        <label className="input-wrapper__label">Form Label</label>
    </div>
);

/**
 * -----------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------
 */
module.exports = TextInput;
