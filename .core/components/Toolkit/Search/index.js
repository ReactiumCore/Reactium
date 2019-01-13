/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Search
 * -----------------------------------------------------------------------------
 */

const noop = () => {};

export default class Search extends Component {
    static defaultProps = {
        text: null,
        onChange: noop,
        onSearchClear: noop,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.input = React.createRef();
    }

    onInput(e) {
        const { onChange } = this.props;
        onChange(e);
    }

    onSearchClear(e) {
        const { onSearchClear } = this.props;
        this.input.current.value = '';
        this.input.current.focus();
        onSearchClear();
    }

    render() {
        const { text } = this.props;

        return (
            <div className='re-toolkit-search'>
                <input
                    type='text'
                    name='search'
                    ref={this.input}
                    placeholder='search'
                    onKeyUp={this.onInput.bind(this)}
                    onChange={this.onInput.bind(this)}
                />

                <button
                    type='button'
                    className='re-toolkit-search-clear'
                    onClick={this.onSearchClear.bind(this)}>
                    <svg>
                        <use xlinkHref='#re-icon-close' />
                    </svg>
                </button>
            </div>
        );
    }
}
