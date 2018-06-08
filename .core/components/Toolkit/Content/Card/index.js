
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import Test from 'components/Test/Test';

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

    resizeIframe(e) {
        let h = e.target.contentWindow.document.body.scrollHeight;
        h = (h < 500) ? 500 : h;
        this.setState({height: h});
    }

    render() {

        let { height = 0 } = this.state;
        let cmp = renderToString(<Preview title={'cool!'} />);

        let markup = `
            <html>
                <head>
                    <link rel="stylesheet" href="/assets/style/style.css">
                </head>
                <body id="toolkit-preview">
                    ${cmp}
                </body>
            </html>
        `;

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
                        <iframe sandbox={'allow-scripts allow-same-origin'} src={'/preview/test'} onLoad={this.resizeIframe.bind(this)} style={{height}} />
                    </div>
                </div>
                <div className={'re-toolkit-card-footer'}>
                    Footer
                </div>
            </div>
        );
    }
}

Card.defaultProps = {
    height: 0,
};
