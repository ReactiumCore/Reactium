/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Checkbox
 * -----------------------------------------------------------------------------
 */

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = { ...this.props };
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.input;
        this.label;

        let { type } = this.state;
        if (!window[`__elm-${type}`]) {
            window[`__elm-${type}`] = [];
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    componentDidMount() {
        let { type } = this.state;
        window[`__elm-${type}`].push(this);
    }

    uncheckAll(checked) {
        let { type, value } = this.state;

        let evt = {};

        if (type === 'radio' && checked === true) {
            window[`__elm-${type}`].forEach(item => {
                if (item.state.value !== value) {
                    item.setState({ checked: false });

                    // Trigger the change event on the element
                    if (typeof item.state['onChange'] === 'function') {
                        evt = {
                            type: 'change',
                            currentTarget: item.input,
                            target: item
                        };
                        item.state.onChange(evt);
                    }
                }
            });
        }
    }

    onChange(e) {
        let { checked, onChange, type, value, disabled } = this.state;
        if (disabled === true) {
            return;
        }

        checked = !checked;
        this.setState({ checked });

        this.uncheckAll(checked);

        if (typeof onChange === 'function') {
            evt = { type: 'change', currentTarget: this.input, target: this };
            onChange(evt);
        }
    }

    onKeyUp(e) {
        if (e.which === 13 || e.which === 32) {
            let { checked, type, value, disabled } = this.state;
            if (disabled === true) {
                return;
            }

            e.preventDefault();

            checked = !checked;
            if (type === 'radio') {
                checked = true;
            }

            this.setState({ checked });

            this.uncheckAll(checked);
        }
    }

    render() {
        let {
            text,
            align,
            type,
            value,
            checked,
            disabled,
            style,
            className = ''
        } = this.state;
        let iprop = Object.assign({}, this.state);
        delete iprop.align;
        delete iprop.text;
        delete iprop.onChange;
        delete iprop.style;
        delete iprop.className;

        let cls = [`${type}-${align}`];
        if (disabled === true) {
            cls.push('disabled');
        }
        if (checked === true) {
            cls.push('checked');
        }

        return (
            <label
                className={cls.join(' ')}
                onKeyUp={this.onKeyUp}
                style={style}
                tabIndex={0}
                ref={elm => {
                    this.label = elm;
                }}
            >
                {text ? <span>{text}</span> : null}
                <input
                    onChange={this.onChange}
                    {...iprop}
                    ref={elm => {
                        this.input = elm;
                    }}
                />
            </label>
        );
    }
}

Checkbox.defaultProps = {
    align: 'right',
    checked: false,
    disabled: false,
    id: null,
    name: null,
    required: false,
    text: null,
    type: 'checkbox',
    value: null
};

export default Checkbox;
