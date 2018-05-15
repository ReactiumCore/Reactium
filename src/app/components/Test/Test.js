/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';

/**
 * -----------------------------------------------------------------------------
 * React Component: Test
 * -----------------------------------------------------------------------------
 */
export default class Test extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    onClick() {
        this.props.test.click();
    }

    render() {
        let title = 'Test Component';

        return (
            <Fragment>
                <Helmet titleTemplate="%s | Reactium-SSR">
                    <title>{title}</title>
                    <meta name="description" content="This is an example Reactium component"/>
                    <meta property="og:title" content={title} />
                    <meta property="og:type" content="article" />
                    <html lang="en" />
                    <body className="test-body" />
                </Helmet>

                <div className="test-component">
                    <div>{this.state.msg}</div>
                    <button type="button" onClick={this.onClick.bind(this)}>
                        Click Me
                    </button>
                    <div>{this.state.count || 0}</div>
                </div>
            </Fragment>
        );
    }
}
