/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'appdir/app';


/**
 * -----------------------------------------------------------------------------
 * React Component: Test
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => {
    return Object.assign({}, state['Test'], props);
};

const mapDispatchToProps = (dispatch, props) => ({
    test: {
        click: () => dispatch(actions.Test.click()),
    }
});

class Test extends Component {
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
        return (
            <div className="test-component">
                <div>{this.state.msg}</div>
                <button type="button" onClick={this.onClick.bind(this)}>
                    Click Me
                </button>
                <div>{this.state.count || 0}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
