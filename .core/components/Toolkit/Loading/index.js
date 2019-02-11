import React, { Component } from 'react';
import { TweenMax } from 'gsap/umd/TweenMax';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Loading
 * -----------------------------------------------------------------------------
 */

export default class Loading extends Component {
    constructor(props) {
        super(props);

        this.container = React.createRef();
        this.fadeOut = this.fadeOut.bind(this);
    }

    componentDidMount() {
        this.fadeOut();
    }

    fadeOut() {
        const { onComplete } = this.props;
        const elm = this.container.current;

        TweenMax.to(elm, 0.25, { opacity: 0, delay: 0.5, onComplete });
    }

    render() {
        return (
            <div className='re-toolkit-loading' ref={this.container}>
                <div className='loader' />
            </div>
        );
    }
}
