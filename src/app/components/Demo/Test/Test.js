/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";

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
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    onClick() {
        this.props.test.click();
    }

    render() {
        let title = "Redux | Reactium";
        let style = "/assets/style/demo-redux.css";
        let { count = 0, msg } = this.state;

        return (
            <Fragment>
                <Helmet>
                    <link rel="stylesheet" href={style} />
                    <title>{title}</title>
                    <meta
                        name="description"
                        content="This is an example Reactium + Redux component"
                    />
                    <html lang="en" />
                    <body className="demo-redux" />
                </Helmet>
                <div className={"demo-redux-wrap"}>
                    <div>{msg}</div>
                    <button type="button" onClick={this.onClick.bind(this)}>
                        Click Me
                    </button>
                    <div>{count}</div>
                </div>
            </Fragment>
        );
    }
}
