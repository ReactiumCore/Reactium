
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'appdir/app';
import { NavLink } from 'react-router-dom'


/**
 * -----------------------------------------------------------------------------
 * React Component: RoutesTest
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = (dispatch) => ({});

class RoutesTest2 extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        let { match } = this.props;

        return (
            <div>
                <h1>RoutesTest2</h1>
                <p>Demonstrates adding multiple routes to route.js</p>
                <ul>
                    <li><NavLink exact={true} to="/routes-test">Base Route</NavLink></li>
                    <li><NavLink exact={true} to="/routes-test/1">Route w/1 parameter</NavLink></li>
                    <li><NavLink exact={true} to="/routes-test/1/2">Route w/2 parameters</NavLink></li>
                    <li><NavLink exact={true} to="/routes-test/1/2/3">Route w/3 parameters</NavLink></li>
                </ul>

                <h2>Current Route</h2>
                <div>
                    Matching Path: {match.path}
                </div>
                <div>
                    Params: {JSON.stringify(match.params)}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoutesTest2);
