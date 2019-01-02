/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import colorProfile from './colors';

/**
 * -----------------------------------------------------------------------------
 * React Component: Colors
 * -----------------------------------------------------------------------------
 */

class Colors extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    invertColor(color) {
        let isHex = color.charAt(0) === '#';
        if (isHex !== true) {
            return '#FFFFFF';
        }

        let cval = color.replace('#', '0x') / 1;
        let wval = 0xffffff - 0xffffff / 20;
        return cval > wval ? '#000000' : '#FFFFFF';
    }

    render() {
        return (
            <div className='re-toolkit-colors'>
                {Object.keys(colorProfile).map((k, i) => {
                    let css = `.${k}`;
                    let cname = k.split('color-').join('');
                    let code = String(colorProfile[k]).toUpperCase();
                    let txtColor = this.invertColor(code);

                    let cls = txtColor === '#000000' ? 'color-border' : '';

                    return (
                        <div key={`color-${i}`}>
                            <div className={`bg-${cname} ${cls}`}>
                                <span style={{ color: txtColor }}>{cname}</span>
                            </div>
                            <div>
                                <span>${k}</span>
                                <span>{code}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

// Default properties
Colors.defaultProps = {};

export default Colors;
