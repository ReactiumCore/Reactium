
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';


/**
 * -----------------------------------------------------------------------------
 * React Component: Toolkit
 * -----------------------------------------------------------------------------
 */

export default class Toolkit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        //console.log(manifest);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    render() {
        let { manifest = {} } = this.state;
        let { menu = {} } = manifest;

        return (
            <Fragment>
                <Header />
                <main className={'re-toolkit-container'}>
                    <Sidebar menu={menu} />
                    <Content />
                </main>
            </Fragment>
        );
    }
}

Toolkit.defaultProps = {};
