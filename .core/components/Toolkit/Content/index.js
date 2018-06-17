
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Preview from './Preview';
import op from 'object-path';
import _ from 'underscore';
import Card from './Card';
import Code from './Code';
import Docs from './Docs';
import Dna from './Dna';


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
        this.docs              = {};
        this.link              = {};
        this.previews          = {};
        this.watcher           = null;
        this.state             = { ...this.props };
        this.onWatch           = this.onWatch.bind(this);
        this.registerPreview   = this.registerPreview.bind(this);
        this.onCardButtonClick = this.onCardButtonClick.bind(this);
    }

    // Handlers
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

        let { onButtonClick } = this.state;
        let { id:action }     = e.currentTarget;

        let evtdata = card;

        switch(action) {
            case 'toggle-link':
            case 'toggle-docs':
            case 'toggle-code': {

                if (op.has(card, 'state.id')) {
                    let k = (action === 'toggle-code') ? 'codes' : 'docs';
                        k = (action === 'toggle-link') ? 'link' : k;

                    let cmp = this[k][card.state.id];
                    if (cmp) { cmp.toggle(); }
                }

                break;
            }
        }

        if (typeof onButtonClick === 'function') {
            e['type'] = action;
            onButtonClick(e, evtdata);
        }
    }

    onWatch() {
        // Resize previews
        Object.values(this.previews).forEach(preview => preview.resize());
    }

    // Registers
    registerCard({ elm, id }) {
        if (!elm) { return; }
        this.cards[id] = elm;
    }

    registerCode({ elm, id }) {
        if (!elm) { return; }
        this.codes[id] = elm;
    }

    registerDocs({ elm, id }) {
        if (!elm) { return; }
        this.docs[id] = elm;
    }

    registerDnas({ elm, id }) {
        if (!elm) { return; }
        this.link[id] = elm;
    }

    registerPreview({ elm, id }) {
        if (!elm) { return; }
        this.previews[id] = elm;
    }

    // Renderers
    renderCards({ data, card, group }) {

        let { onButtonClick, prefs, update, style, menu } = this.state;

        this.cards    = {};
        this.codes    = {};
        this.docs     = {};
        this.link     = {};
        this.previews = {};

        return Object.keys(data).map((key, k) => {
            let id   = [group, key].join('_');
            let item = data[key];

            let { label, component, readme, dna, path } = item;
            let { buttons = {} } = card;

            buttons = JSON.stringify(buttons);
            buttons = JSON.parse(buttons);

            const Cmp = component;

            let noCode = Boolean(typeof component === 'string');
            if (noCode === true) {
                let idx = _.indexOf(_.pluck(buttons.footer, 'name'), 'toggle-code');
                buttons.footer.splice(idx, 1);
            }

            if (!dna || typeof component === 'string') {
                let idx = _.indexOf(_.pluck(buttons.footer, 'name'), 'toggle-link');
                buttons.footer.splice(idx, 1);
            }

            if (!readme) {
                let idx = _.indexOf(_.pluck(buttons.footer, 'name'), 'toggle-docs');
                buttons.footer.splice(idx, 1);
            }

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
                        update={update}
                        group={group}
                        style={style}
                        path={path}
                        id={id}
                    />
                    {
                        (noCode !== true)
                        ? (
                            <Code
                                ref={(elm) => { this.registerCode({elm, id}); }}
                                onButtonClick={onButtonClick}
                                component={component}
                                update={update}
                                prefs={prefs}
                                group={group}
                                id={id}
                            />
                        )
                        : null
                    }
                    {
                        (readme)
                        ? (
                            <Docs
                                ref={(elm) => { this.registerDocs({elm, id}); }}
                                title={'Documentation'}
                                component={readme}
                                update={update}
                                prefs={prefs}
                                id={id}
                            />
                        )
                        : null
                    }
                    <Dna
                        ref={(elm) => { this.registerDnas({elm, id}); }}
                        component={component}
                        update={update}
                        prefs={prefs}
                        menu={menu}
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
        let { card, title, data, element, group, defaultComponent, update } = this.state;

        if (!data) {
            if (!defaultComponent) { return null; }

            const Overview = defaultComponent;
            return (
                <section className={'re-toolkit-content'}>
                    <Overview />
                </section>
            );
        }

        if (typeof data !== 'function') {

            element = data[element] || {};

            let { label = null } = element;

            return (
                <section className={'re-toolkit-content'}>
                    {this.renderCrumbs({title, group, element: label})}
                    {this.renderCards({ data, card, group })}
                </section>
            );
        } else {
            const Component = data;
            return (
                <section className={'re-toolkit-content'}>
                    {this.renderCrumbs({title})}
                    {<Component />}
                </section>
            );
        }
    }
}

Content.defaultProps = {
    onButtonClick : null,
    onCrumbClick  : null,
    title         : null,
    update        : null,
    style         : null,
    watchTimer    : 200,
    data          : {},
    prefs         : {},
    menu          : {},
    card          : {
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
