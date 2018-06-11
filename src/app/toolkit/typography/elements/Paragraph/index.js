/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Paragraph
 * -----------------------------------------------------------------------------
 */
export default class Paragraph extends Component {
    render() {
        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non orci cursus diam blandit tristique sit amet et nisi. Cras egestas viverra leo et pharetra. Suspendisse sodales velit ac scelerisque pellentesque. Phasellus non tortor vitae erat euismod mattis eget id nulla. Duis orci felis, pellentesque vitae neque maximus, venenatis consectetur nunc. Phasellus tincidunt, nunc ut aliquam congue, risus lectus pellentesque tellus, et ultricies augue nibh at augue. Phasellus fermentum iaculis risus, a blandit nisl lobortis in.
                </p>
                <p>
                    The quick brown fox jumps over a lazy dog.
                </p>
                <p class='number'>
                    1 2 3 4 5 6 7 8 9 10
                </p>
            </div>
        );
    }
}
