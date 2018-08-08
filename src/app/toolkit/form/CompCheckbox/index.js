/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Checkbox from 'components/common-ui/form/Checkbox';

/**
 * -----------------------------------------------------------------------------
 * React Component: CompCheckbox
 * -----------------------------------------------------------------------------
 */

class CompCheckbox extends Component {
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
            <div className={'row'}>
                <div className={'col-xs-12 col-sm-6 mb-xs-40 mb-sm-0'}>
                    <h4>Align Right</h4>
                    <div className={'mb-xs-10 mb-sm-20 mt-20'}>
                        <Checkbox
                            text={'Checkbox 1'}
                            value={1}
                            name={'demo-check-1'}
                            style={{ minWidth: 118 }}
                            checked
                        />
                    </div>
                    <div className={'mb-xs-10 mb-sm-20'}>
                        <Checkbox
                            text={'Checkbox 2'}
                            value={2}
                            name={'demo-check-1'}
                            style={{ minWidth: 118 }}
                        />
                    </div>
                    <div>
                        <Checkbox
                            text={'Disabled'}
                            value={3}
                            name={'demo-check-1'}
                            style={{ minWidth: 118 }}
                            disabled
                        />
                    </div>
                </div>
                <div className={'col-xs-12 col-sm-6'}>
                    <h4>Align Left</h4>
                    <div className={'mb-xs-10 mb-sm-20 mt-20'}>
                        <Checkbox
                            text={'Checkbox 1'}
                            value={4}
                            name={'demo-check-1'}
                            align={'left'}
                        />
                    </div>
                    <div className={'mb-xs-10 mb-sm-20'}>
                        <Checkbox
                            text={'Checkbox 2'}
                            value={5}
                            name={'demo-check-1'}
                            align={'left'}
                        />
                    </div>
                    <div>
                        <Checkbox
                            text={'Disabled'}
                            value={6}
                            name={'demo-check-1'}
                            align={'left'}
                            disabled
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// Default properties
CompCheckbox.defaultProps = {};

export default CompCheckbox;
