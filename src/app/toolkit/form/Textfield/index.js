/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Textfield
 * -----------------------------------------------------------------------------
 */

class Textfield extends Component {
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
            <form>
                <div className={'form-group'}>
                    <input
                        type="text"
                        autoComplete={'off'}
                        name={'text-input'}
                        placeholder={'placeholder'}
                    />
                </div>

                <div className={'form-group'}>
                    <input
                        type="text"
                        autoComplete={'off'}
                        name={'text-input'}
                        readOnly
                        defaultValue={'read only'}
                    />
                </div>

                <div className={'form-group'}>
                    <input
                        type="text"
                        autoComplete={'off'}
                        name={'text-input'}
                        placeholder={'disabled'}
                        disabled
                    />
                </div>

                <div className={'form-group'}>
                    <label>
                        Focused:
                        <input
                            type="text"
                            autoComplete={'off'}
                            name={'text-input'}
                            className={'focus'}
                        />
                        <small>Something about this textfield</small>
                    </label>
                </div>

                <div className={'form-group error'}>
                    <label>
                        Error:
                        <input
                            type="text"
                            autoComplete={'off'}
                            name={'text-input'}
                        />
                        <small>Something about this error</small>
                    </label>
                </div>

                <h3>Inline</h3>
                <div className={'row pt-xs-20'}>
                    <div className={'col-xs-12 col-sm-6 mb-xs-10'}>
                        <div className={'form-group pr-xs-0 pr-sm-20 inline'}>
                            <label className={'pr-xs-10 pr-sm-20'}>
                                Field 1:
                            </label>
                            <input
                                type="text"
                                autoComplete={'off'}
                                name={'text-input'}
                            />
                        </div>
                    </div>
                    <div className={'col-xs-12 col-sm-6'}>
                        <div className={'form-group inline'}>
                            <label className={'pr-xs-10 pr-sm-20'}>
                                Field 2:
                            </label>
                            <input
                                type="text"
                                autoComplete={'off'}
                                name={'text-input'}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

// Default properties
Textfield.defaultProps = {};

export default Textfield;
