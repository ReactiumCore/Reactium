/**
 * Created by Cam Tullos on 11/30/17
 */

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { connect } from 'react-redux';
import Test from './Test';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * React Component: Test
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = state => {
    const { count, msg } = state.Test;
    return {
        count,
        msg,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addRoute: path =>
            dispatch(
                deps.actions.Routes.add({
                    path,
                    component: 'Demo/Test',
                    exact: true,
                    order: 0,
                }),
            ),
        click: () => dispatch(deps.actions.Test.click()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Test);
