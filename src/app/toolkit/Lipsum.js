/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Lipsum
 * -----------------------------------------------------------------------------
 */

export default class Lipsum extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    render() {
        let { length = 0, index, text } = this.state;

        length = length === 0 ? text.length : length;

        let str = String(text).substr(index, length);

        return <Fragment>{str}</Fragment>;
    }
}

Lipsum.defaultProps = {
    length: 0,
    index: 0,
    text:
        'Nullam ac pellentesque lorem. Nullam vestibulum vestibulum ipsum sit amet cursus. Quisque ornare elit et nibh rutrum laoreet. Etiam eros erat, maximus eget felis quis, ullamcorper blandit ante. Vivamus facilisis, lacus ut suscipit dapibus, nisl lacus dapibus neque, non mollis diam metus eget sem. Praesent malesuada ornare nisl, quis gravida nisi lobortis id. Cras at enim viverra, facilisis massa ac, maximus ante. Nunc non magna purus. Suspendisse volutpat scelerisque ex, id sollicitudin nunc vulputate a. Vivamus id sapien at urna dictum vehicula. Phasellus vitae tortor in mi pellentesque elementum. Mauris vitae augue lacinia, tincidunt justo quis, maximus nibh. Donec varius imperdiet nunc ac vulputate. Nullam accumsan ultrices arcu a tincidunt. Vivamus ut metus ligula. Proin tempor metus ac quam cursus temporInteger malesuada, nisi eget consequat ullamcorper, nisl tortor ullamcorper metus, id faucibus tortor neque mattis magna. Etiam nec metus luctus, dictum est vel, ultrices orci. Mauris non odio condimentum, lacinia urna sed, dictum odio. Cras faucibus odio in vulputate dignissim. Nunc quis orci faucibus, aliquet erat ac, euismod lacus. Nulla vehicula dictum condimentum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed non consequat dui. Nulla lacinia placerat quam sed tempus. Curabitur a urna id odio tincidunt lacinia sollicitudin at erat. Mauris tristique feugiat ante nec tempus. Donec fringilla neque vitae justo suscipit eleifend. Nunc volutpat erat ac libero porta blandit. Aenean eget dolor sapien. Phasellus tincidunt magna leo, ac convallis erat feugiat a. Vestibulum eleifend pharetra interdum. Integer luctus rutrum mauris a lacinia. Phasellus libero urna, laoreet eget tempor et, tristique at erat.'
};
