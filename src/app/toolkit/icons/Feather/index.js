/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

import _ from 'underscore';
import React, { Component } from 'react';
import Icon from 'components/common-ui/Icon';

/**
 * -----------------------------------------------------------------------------
 * React Component: Icons
 * -----------------------------------------------------------------------------
 */

export default class LinearIcons extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    state = {
        filtered: [],
        icons: [],
        inputStyle: {
            color: '#666666',
            width: 60,
            textAlign: 'center',
            paddingLeft: 12,
            marginLeft: 10,
            borderRadius: 4,
            border: '1px solid #DCDCDC',
            fontSize: 12,
        },
        ready: false,
        search: null,
        searchStyle: {
            marginLeft: 10,
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: 'left',
            width: 150,
        },
        size: 32,
    };

    componentDidMount() {
        const icons = Object.keys(Icon.Feather);
        icons.sort();

        setTimeout(() => {
            this.setState({ icons, ready: true });
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('resize'));
            }
        }, 100);
    }

    onSearchChange(e) {
        const { icons } = this.state;
        const search = e.target.value;
        const filtered = icons.filter(icon => {
            const reg = new RegExp(search, 'gi');
            return icon.search(reg) > -1;
        });

        this.setState({ filtered, search });
    }

    onSizeChange(e) {
        const size = e.target.value;
        this.setState({ size });
    }

    render() {
        const {
            filtered = [],
            icons = [],
            inputStyle,
            ready,
            search,
            searchStyle,
            size = 24,
        } = this.state;
        const items = search ? filtered : icons;

        return ready === false ? null : (
            <div className={'mb--32'}>
                <div className='flex right middle pb-xs-20'>
                    <label
                        htmlFor='size'
                        style={{
                            color: '#666666',
                            flexGrow: 0,
                            textAlign: 'right',
                        }}>
                        Icon Size:
                    </label>
                    <input
                        type='number'
                        placeholder='Icon Size'
                        value={size}
                        id='size'
                        onChange={this.onSizeChange.bind(this)}
                        style={inputStyle}
                        max={120}
                        min={10}
                    />
                    <input
                        type='search'
                        placeholder='Search'
                        value={search || ''}
                        id='search'
                        onChange={this.onSearchChange.bind(this)}
                        style={{
                            ...inputStyle,
                            ...searchStyle,
                        }}
                    />
                </div>
                <div className={'row'}>
                    {items.map((item, i) => {
                        const Ico = Icon.Feather[item];
                        return (
                            <div
                                key={`icon-${i}`}
                                className={'col-xs-4 col-sm-2 col-xl-1'}>
                                <div className={'text-center'}>
                                    <Ico width={size} height={size} />
                                    <div
                                        className={
                                            'text-center small mt-16 mb-32'
                                        }>
                                        {item}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
