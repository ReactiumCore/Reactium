
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { connect } from 'react-redux';
import Settings from './Settings';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * Inject Redux State and Actions into React Component: Settings
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({
    ...state.Settings,
    ...props,
});

const mapDispatchToProps = (dispatch) => ({
    mount: () => dispatch(deps.actions.Settings.mount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
