
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { renderToString } from 'react-dom/server';
//import TestRenderer from 'react-test-renderer';


/**
 * -----------------------------------------------------------------------------
 * React Component: Card
 * -----------------------------------------------------------------------------
 */
const Preview = (props) => {
    let { title } = props;
    return (
        <div>{title}</div>
    );
};

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    render() {
        // const testRenderer = TestRenderer.create(
        //   <Preview title={'testing'} />
        // );

        let cont = renderToString(<Preview title={'testing'} />);

        return (
            <div className={'re-toolkit-card'}>
                <div className={'re-toolkit-card-heading'}>
                    <h3>Card</h3>
                    <button type={'button'} title={'fullscreen mode'}>
                        <svg>
                            <use xlinkHref={'#re-icon-fullscreen'}></use>
                        </svg>
                    </button>
                </div>
                <div className={'re-toolkit-card-body'}>
                    <div className={'re-toolkit-card-body-wrap'}>
                        <iframe srcDoc={cont} />
                    </div>
                </div>
                <div className={'re-toolkit-card-footer'}>
                    Footer
                </div>
            </div>
        );
    }
}

Card.defaultProps = {};
