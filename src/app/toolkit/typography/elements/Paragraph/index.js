/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";
import P from "./P";

/**
 * -----------------------------------------------------------------------------
 * React Component: Paragraph
 * -----------------------------------------------------------------------------
 */

export default class Paragraph extends Component {
    static dependencies() {
        if (module) {
            return module.children;
        }
    }

    render() {
        return (
            <div>
                <P />
                <P>The quick brown fox jumps over a lazy dog.</P>
                <P className="number">1 2 3 4 5 6 7 8 9 10</P>
            </div>
        );
    }
}

export { P };
