/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Headings
 * -----------------------------------------------------------------------------
 */
const H = props => {
    switch (props.index) {
        case 1:
            return <h1>{props.children}</h1>;
        case 2:
            return <h2>{props.children}</h2>;
        case 3:
            return <h3>{props.children}</h3>;
        case 4:
            return <h4>{props.children}</h4>;
        case 5:
            return <h5>{props.children}</h5>;
        case 6:
            return <h6>{props.children}</h6>;
    }
};

export default class Headings extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    renderHeadings() {
        let output = [];

        for (let i = 1; i < 7; i++) {
            output.push(
                <div className={'flex-middle mb-12 mt-12'} key={`h-${i}`}>
                    <div style={{ width: 80 }}>
                        <small>
                            <kbd>.h{i}</kbd>
                        </small>
                    </div>
                    <div>
                        <H index={i}>Heading {i}</H>
                    </div>
                </div>
            );
        }

        return output;
    }

    render() {
        return <Fragment>{this.renderHeadings().map(item => item)}</Fragment>;
    }
}
