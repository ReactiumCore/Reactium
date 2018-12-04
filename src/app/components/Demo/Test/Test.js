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
import _ from 'underscore';
import { PlugableProvider, Plugins } from 'reactium-core/components/Plugable';

/**
 * -----------------------------------------------------------------------------
 * React Component: Test
 * -----------------------------------------------------------------------------
 */
export default class Test extends Component {
    constructor(props) {
        super(props);

        const { count, msg } = this.props;
        this.state = { count, msg };
    }

    componentDidUpdate(prevProps, prevState = {}) {
        if (!_.isMatch(this.props, prevState)) {
            const { count, msg } = this.props;
            this.setState({ count, msg });
        }
    }

    render() {
        let title = 'Redux | Reactium';
        let style = '/assets/style/demo-redux.css';
        let { count = 0, msg } = this.state;
        let { click } = this.props;

        return (
            <Fragment>
                <Helmet>
                    <link rel='stylesheet' href={style} />
                    <title>{title}</title>
                    <meta
                        name='description'
                        content='This is an example Reactium + Redux component'
                    />
                    <html lang='en' />
                    <body className='demo-redux' />
                </Helmet>
                <div className={'demo-redux-wrap'}>
                    <Plugins zone='demo-test' count={count} />

                    <div>{msg}</div>
                    <button type='button' onClick={click}>
                        Click It
                    </button>
                </div>
            </Fragment>
        );
    }
}
