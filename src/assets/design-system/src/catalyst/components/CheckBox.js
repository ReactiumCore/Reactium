/**
 * Created by rkanculakunta on 9/19/17.
 */
'use strict';

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const React = require('react');


/**
 * -----------------------------------------------------------------------------
 * Simple component to demonstrate the toolkit's ability to compile React
 * -----------------------------------------------------------------------------
 */
const CheckBox = props => (
    <label className="checkbox" data-dna="label" role="checkbox" tabIndex="0">
        <input type="checkbox" data-dna="checkbox" tabIndex="-1"/>
        <span className="checkbox__box" tabIndex="-1"></span>
        <span className="checkbox__text" tabIndex="-1">{props.label}</span>
    </label>
);


/**
 * -----------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------
 */
module.exports = CheckBox;
