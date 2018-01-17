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
const Radio = props => (
    <div className="radio-button-container" role="radiogroup">
        <div className="radio-wrapper" role="complementary">
            <label id="label-groupName-0" className="radio " aria-checked="false">
                <input tabindex="-1" type="radio" name="groupName" value="" id="radio-0"/>
                <span className="focus-state" tabindex="0"></span>
                <span className="radio__circle"></span>
                <div className="radio__text-container">
                    <span data-trigger="Radio 1" class="radio__text">Radio 1 </span>
                </div>
            </label>
        </div>
    </div>
);


/**
 * -----------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------
 */
module.exports = Radio;
