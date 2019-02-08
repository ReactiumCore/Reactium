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
 * Inject Redux State and Actions into React Component: Test
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({
    ...state.Test,
    ...props,
});

const mapDispatchToProps = dispatch => ({
    mount: data => dispatch(deps.actions.Test.mount(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Test);
