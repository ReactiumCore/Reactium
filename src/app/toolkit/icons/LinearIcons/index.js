/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
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

    render() {
        const keys = Object.keys(Icon);
        keys.sort();

        return (
            <Fragment>
                <p className={'mb-32 text-center'}>
                    A collection of SVGs from the{' '}
                    <a
                        href={'https://linearicons.com/'}
                        target={'_blank'}
                        style={{ textDecoration: 'underline' }}>
                        Linearicons
                    </a>{' '}
                    package
                </p>
                <div className={'mb--32'}>
                    <div className={'row'}>
                        {keys.map((item, i) => {
                            const Ico = Icon[item];
                            return (
                                <div
                                    key={`icon-${i}`}
                                    className={'col-xs-4 col-sm-2 col-xl-1'}>
                                    <div className={'text-center'}>
                                        <Ico width={24} height={24} />
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
            </Fragment>
        );
    }
}
