/**
 * Created by rkanculakunta on 9/18/17.
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
const FileInput = props => (
    <div className="file-input-wrapper">
        <input type="file" name="file" id="file" className="input-file" data-multiple-caption="{count} files selected" multiple/>
        <label htmlFor="file"><i className="icon lnr-upload2"></i>{props.message}</label>
    </div>
);

/**
 * -----------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------
 */
module.exports = FileInput;

