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

const mapDispatchToProps = dispatch => ({
    mount: () => dispatch(deps.actions.Toolkit.mount()),
    menuItemClick: url => dispatch(deps.actions.Toolkit.menuItemClick(url)),
    menuToggle: elm => dispatch(deps.actions.Toolkit.menuToggle(elm)),
    notice: {
        hide: params => dispatch(deps.actions.Toolkit.notice.hide(params)),
        show: params => dispatch(deps.actions.Toolkit.notice.show(params)),
    },
    set: data => dispatch(deps.actions.Toolkit.set(data)),
    setTheme: data => dispatch(deps.actions.Toolkit.setTheme(data)),
    toggleSettings: () => dispatch(deps.actions.Toolkit.toggleSettings()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Toolkit);
