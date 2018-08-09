/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Textarea
 * -----------------------------------------------------------------------------
 */

class Textarea extends Component {
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
                    <textarea
                        name={'textarea'}
                        placeholder={'your message here'}
                        autoComplete={'off'}
                    />
                </div>
                <div className={'form-group'}>
                    <textarea
                        name={'textarea'}
                        autoComplete={'off'}
                        readOnly
                        defaultValue={'read only'}
                    />
                </div>
                <div className={'form-group'}>
                    <textarea
                        name={'textarea'}
                        placeholder={'disabled'}
                        autoComplete={'off'}
                        disabled
                    />
                </div>
                <div className={'form-group'}>
                    <label>
                        Focused:
                        <textarea
                            name={'textarea'}
                            className={'focus'}
                            autoComplete={'off'}
                        />
                        <small>Some small text</small>
                    </label>
                </div>
                <div className={'form-group error'}>
                    <label>
                        Error:
                        <textarea name={'textarea'} autoComplete={'off'} />
                        <small>Error message yo!</small>
                    </label>
                </div>
            </form>
        );
    }
}

// Default properties
Textarea.defaultProps = {};

export default Textarea;
