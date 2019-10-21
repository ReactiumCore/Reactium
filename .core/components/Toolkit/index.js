/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { connect } from 'react-redux';
import deps from 'dependencies';
import { Plugins } from 'reactium-core/components/Plugable';

const Toolkit = props => <Plugins zone='toolkit' {...props} />;

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
    mount: params => dispatch(deps().actions.Toolkit.mount(params)),
    menuItemClick: url => dispatch(deps().actions.Toolkit.menuItemClick(url)),
    menuToggle: () => dispatch(deps().actions.Toolkit.menuToggle()),
    notice: {
        hide: params => dispatch(deps().actions.Toolkit.notice.hide(params)),
        show: params => dispatch(deps().actions.Toolkit.notice.show(params)),
    },
    set: data => dispatch(deps().actions.Toolkit.set(data)),
    setTheme: data => dispatch(deps().actions.Toolkit.setTheme(data)),
    toggleSettings: () => dispatch(deps().actions.Toolkit.toggleSettings()),
    loaded: () => dispatch(deps().actions.Toolkit.loaded()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Toolkit);
