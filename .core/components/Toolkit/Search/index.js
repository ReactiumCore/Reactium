
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';


/**
 * -----------------------------------------------------------------------------
 * React Component: Search
 * -----------------------------------------------------------------------------
 */

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.input = null;
        this.state = { ...this.props };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onInput(e) {
        let { onChange } = this.state;

        if (typeof onChange === 'function') {
            onChange(e);
        }
    }

    onSearchClear(e) {
        let { onSearchClear } = this.state;
        this.input.value = '';

        this.input.focus();
        onSearchClear();
    }


    render() {
        let { text } = this.state;

        return (
            <div className={'re-toolkit-search'}>
                <input
                    ref={(elm) => { this.input = elm; }}
                    name={'search'}
                    type={'text'}
                    placeholder={'search'}
                    onChange={this.onInput.bind(this)}
                    onKeyUp={this.onInput.bind(this)} />

                <button type={'button'} className={'re-toolkit-search-clear'} onClick={this.onSearchClear.bind(this)}>
                    <svg><use xlinkHref={'#re-icon-close'}></use></svg>
                </button>
            </div>
        );
    }
}

Search.defaultProps = {
    text: null,
    onChange: null,
    onSearchClear: null,
};
