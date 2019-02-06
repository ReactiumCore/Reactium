/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Test from './Test';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * React Component: Test
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => {
    const { count, msg } = state.Test;
    return {
        count,
        msg,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    click: () => dispatch(deps.actions.Test.click()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Test);
