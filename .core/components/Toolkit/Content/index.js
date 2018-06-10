
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Preview from './Preview';
import op from 'object-path';
import Card from './Card';
import Code from './Code';


/**
 * -----------------------------------------------------------------------------
 * React Component: Content
 * -----------------------------------------------------------------------------
 */

export default class Content extends Component {
    constructor(props) {
        super(props);

        this.cards             = {};
        this.codes             = {};
        this.previews          = {};
        this.watcher           = null;
        this.state             = { ...this.props };
        this.onWatch           = this.onWatch.bind(this);
        this.registerPreview   = this.registerPreview.bind(this);
        this.onCardButtonClick = this.onCardButtonClick.bind(this);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }

        this.watcher = setInterval(this.onWatch, this.state.watchTimer);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onCardButtonClick(e, card) {

        let { id:action } = e.currentTarget;

        // Toggle the preview
        // if (op.has(card, 'state.id') && action !== 'toggle-fullscreen') {
        //     let preview = this.previews[card.state.id];
        //     if (preview) {
        //         let { visible:previewVis } = preview.state;
        //         previewVis = !previewVis;
        //         preview.setState({visible: previewVis});
        //     }
        // }

        switch(action) {
            case 'toggle-code': {



                return;
            }

        }


        //console.log('[Reactium]', this.cards);
        //console.log('[Reactium] onCardButtonClick:', e.currentTarget.id, card.state);
    }

    onWatch() {
        // Resize previews
        Object.values(this.previews).forEach(preview => preview.resize());
    }

    registerCard({ elm, id }) {
        if (!elm) { return; }
        this.cards[id] = elm;
    }

    registerCode({ elm, id }) {
        if (!elm) { return; }
        this.codes[id] = elm;
    }

    registerPreview({ elm, id }) {
        if (!elm) { return; }
        this.previews[id] = elm;
    }

    renderCards({ data, card, group }) {

        this.cards    = {};
        this.codes    = {};
        this.previews = {};

        return Object.keys(data).map((key, k) => {
            let id   = [group, key].join('_');
            let item = data[key];

            let { label, component } = item;
            let { buttons = {} } = card;

            buttons = JSON.stringify(buttons);
            buttons = JSON.parse(buttons);

            return (
                <Card
                    id={id}
                    title={label}
                    buttons={buttons}
                    key={`card-${id}`}
                    onButtonClick={this.onCardButtonClick}
                    ref={(elm) => { this.registerCard({elm, id}); }} >

                    <Preview
                        ref={(elm) => { this.registerPreview({elm, id}); }}
                        component={component}
                        group={group}
                        id={id}
                    />

                    <Code
                        ref={(elm) => { this.registerCode({elm, id}); }}
                        component={component}
                        group={group}
                        id={id}
                    />

                </Card>
            );
        });
    }

    renderCrumbs({title, group, element}) {
        let { onCrumbClick } = this.state;
        let elms = [];

        if (!element) {
            elms.push(<span key={`group-${group}`}>{title}</span>);
        } else {
            elms.push(<span key={`group-${group}-element`}><Link to={`/toolkit/${group}`} onClick={onCrumbClick}>{title}</Link></span>);
        }

        return (
            <div className={'re-toolkit-content-crumbs'}>
                {elms.map(elm => elm)}
            </div>
        );
    }

    render() {
        let { card, title, data, element, group } = this.state;

        if (!data) { return null; }

        if (typeof data !== 'function') {

            element = data[element] || {};

            let { label = null } = element;

            return (
                <Fragment>
                    <section className={'re-toolkit-content'}>
                        {this.renderCrumbs({title, group, element: label})}
                        {this.renderCards({ data, card, group })}
                    </section>
                </Fragment>
            );
        } else {
            const Component = data;
            return (
                <Fragment>
                    <section className={'re-toolkit-content'}>
                        {this.renderCrumbs({title})}
                        {<Component />}
                    </section>
                </Fragment>
            )
        }
    }
}

Content.defaultProps = {
    onCrumbClick : null,
    title        : null,
    watchTimer   : 200,
    data         : {},
    card         : {
        buttons: {
            header: [
                {name: 'toggle-fullscreen', title: 'toggle fullscreen', icon: '#re-icon-fullscreen'}
            ],
            footer: [
                {name: 'toggle-code', title: 'code view', icon: '#re-icon-markup'},
                {name: 'toggle-link', title: 'dependencies', icon: '#re-icon-link'},
                {name: 'toggle-docs', title: 'docs', icon: '#re-icon-docs'},
            ],
        }
    }
};
