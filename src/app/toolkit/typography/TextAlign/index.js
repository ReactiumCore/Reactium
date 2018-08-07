/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: TextAlign
 * -----------------------------------------------------------------------------
 */

class TextAlign extends Component {
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
                <p>
                    Easily align text to components with text alignment classes.
                </p>
                <div className={'mb-32'}>
                    <div className={'row'}>
                        <div className={'col-xs-12 col-sm-4'}>
                            <div className={'p-10 bg-grey-light'}>
                                <div
                                    className={
                                        'text-xs-right text-sm-left number'
                                    }
                                >
                                    <span className={'hide-xs-only'}>
                                        text-sm-left
                                    </span>
                                    <span className={'hide-sm'}>
                                        text-xs-right
                                    </span>
                                </div>
                            </div>
                            <p className={'p-10 text-sm-left text-xs-right'}>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed eget odio sit amet leo
                                faucibus sollicitudin. Fusce aliquet auctor
                                erat, varius dictum mauris laoreet quis. Sed
                                ultrices nisi eget ante luctus consequat. Morbi
                                scelerisque imperdiet magna, euismod tincidunt
                                lectus sodales nec. Duis auctor cursus
                                tincidunt.
                            </p>
                        </div>
                        <div className={'col-xs-12 col-sm-4'}>
                            <div className={'p-10 bg-grey-light'}>
                                <div className={'text-xs-center number'}>
                                    text-xs-center
                                </div>
                            </div>
                            <p className={'p-10 text-xs-center'}>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed eget odio sit amet leo
                                faucibus sollicitudin. Fusce aliquet auctor
                                erat, varius dictum mauris laoreet quis. Sed
                                ultrices nisi eget ante luctus consequat. Morbi
                                scelerisque imperdiet magna, euismod tincidunt
                                lectus sodales nec. Duis auctor cursus
                                tincidunt.
                            </p>
                        </div>
                        <div className={'col-xs-12 col-sm-4'}>
                            <div className={'p-10 bg-grey-light'}>
                                <div
                                    className={
                                        'text-sm-right text-xs-left number'
                                    }
                                >
                                    <span className={'hide-xs-only'}>
                                        text-sm-right
                                    </span>
                                    <span className={'hide-sm'}>
                                        text-xs-left
                                    </span>
                                </div>
                            </div>
                            <p className={'p-10 text-sm-right text-xs-left'}>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed eget odio sit amet leo
                                faucibus sollicitudin. Fusce aliquet auctor
                                erat, varius dictum mauris laoreet quis. Sed
                                ultrices nisi eget ante luctus consequat. Morbi
                                scelerisque imperdiet magna, euismod tincidunt
                                lectus sodales nec. Duis auctor cursus
                                tincidunt.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-xs-12'}>
                        <div className={'p-10 bg-grey-light'}>
                            <div className={'number'}>text-justify</div>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-xs-12'}>
                        <p className={'p-10 text-justify'}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed eget odio sit amet leo faucibus
                            sollicitudin. Fusce aliquet auctor erat, varius
                            dictum mauris laoreet quis. Sed ultrices nisi eget
                            ante luctus consequat. Morbi scelerisque imperdiet
                            magna, euismod tincidunt lectus sodales nec. Duis
                            auctor cursus tincidunt. Fusce sit amet sollicitudin
                            diam, ut finibus ante. Sed hendrerit interdum neque.
                            Quisque dapibus ipsum ipsum, eget interdum ligula
                            tincidunt vitae. Proin pharetra, felis et pulvinar
                            laoreet, lacus eros cursus erat, ut dapibus est
                            mauris a orci. Etiam dapibus, risus vitae semper
                            blandit, justo urna efficitur justo, eget malesuada
                            enim enim ut purus. Quisque auctor tellus vitae quam
                            sodales, id accumsan sapien blandit.
                        </p>
                    </div>
                </div>
            </Fragment>
        );
    }
}

// Default properties
TextAlign.defaultProps = {};

export default TextAlign;
