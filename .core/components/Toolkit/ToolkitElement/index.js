
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { connect } from 'react-redux';
import ToolkitElement from './ToolkitElement';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * Inject Redux State and Actions into React Component: ToolkitElement
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({
    ...state.ToolkitElement,
    ...props,
});

const mapDispatchToProps = (dispatch) => ({
    mount: () => dispatch(deps.actions.ToolkitElement.mount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolkitElement);
