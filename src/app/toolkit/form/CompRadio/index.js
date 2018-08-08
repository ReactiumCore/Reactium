/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Radio from 'components/common-ui/form/Radio';

/**
 * -----------------------------------------------------------------------------
 * React Component: CompRadio
 * -----------------------------------------------------------------------------
 */

class CompRadio extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    render() {
        return (
            <Fragment>
                <div className={'mb-xs-10 mb-sm-20'}>
                    <Radio
                        text={'Option 1'}
                        value={1}
                        name={'demo-radio-1'}
                        style={{ width: 135 }}
                        checked={true}
                    />
                </div>
                <div className={'mb-xs-10 mb-sm-20'}>
                    <Radio
                        text={'Option 2'}
                        value={2}
                        name={'demo-radio-1'}
                        style={{ width: 135 }}
                    />
                </div>
                <div>
                    <Radio
                        text={'Disabled'}
                        value={3}
                        name={'demo-radio-1'}
                        style={{ width: 135 }}
                        disabled={true}
                    />
                </div>
            </Fragment>
        );
    }
}

// Default properties
CompRadio.defaultProps = {};

export default CompRadio;
