
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { connect } from 'react-redux';
import Toolkit from './Toolkit';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * Inject Redux State and Actions into React Component: Toolkit
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({
    ...state.Toolkit,
    ...props,
});

const mapDispatchToProps = (dispatch) => ({
    mount: () => dispatch(deps.actions.Toolkit.mount()),
    menuItemClick: (url) => dispatch(deps.actions.Toolkit.menuItemClick(url)),
    set: (data) => dispatch(deps.actions.Toolkit.set(data)),
    setTheme: (data) => dispatch(deps.actions.Toolkit.setTheme(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolkit);
