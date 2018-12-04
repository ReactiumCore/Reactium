/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { connect } from 'react-redux';
import Provider from './Provider';
import deps from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * Inject Redux State and Actions into React Component: Provider
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({
    plugins: Object.values(state.Plugable.byId),
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Provider);
