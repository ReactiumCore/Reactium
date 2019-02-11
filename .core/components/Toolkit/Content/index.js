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

        this.cards = {};
        this.codes = {};
        this.docs = {};
        this.link = {};
        this.previews = {};
        this.watcher = null;
        this.state = {};
        this.onCardButtonClick = this.onCardButtonClick.bind(this);
    }

    // Handlers
    componentDidMount() {
        if (this.props.hasOwnProperty('mount')) {
            this.props.mount(this);
        }
    }

    onCardButtonClick(e, card) {
        let { onButtonClick } = this.props;
        let { id: action } = e.currentTarget;

        let evtdata = card;

        switch (action) {
            case 'toggle-link':
            case 'toggle-docs':
            case 'toggle-code': {
                if (op.has(card, 'state.id')) {
                    let k = action === 'toggle-code' ? 'codes' : 'docs';
                    k = action === 'toggle-link' ? 'link' : k;

                    let cmp = this[k][card.state.id];
                    if (cmp) {
                        cmp.toggle();
                    }
                }

                break;
            }
        }

        if (typeof onButtonClick === 'function') {
            e['type'] = action;
            onButtonClick(e, evtdata);
        }
    }

    // Registers
    registerCard({ elm, id }) {
        if (!elm) {
            return;
        }
        this.cards[id] = elm;
    }

    registerCode({ elm, id }) {
        if (!elm) {
            return;
        }
        this.codes[id] = elm;
    }

    registerDocs({ elm, id }) {
        if (!elm) {
            return;
        }
        this.docs[id] = elm;
    }

    registerDnas({ elm, id }) {
        if (!elm) {
            return;
        }
        this.link[id] = elm;
    }

    // Renderers
    renderCards({ data, card, group }) {
        let {
            onButtonClick,
            onCopyClick,
            prefs,
            update,
            style,
            menu,
        } = this.props;

        this.cards = {};
        this.codes = {};
        this.docs = {};
        this.link = {};

        const defItem = {
            label: '',
            component: null,
            readme: null,
            dna: null,
            hideCode: false,
            hideDna: false,
            hideDocs: false,
        };

        return Object.keys(data).map((key, k) => {
            const id = [group, key].join('_');
            const item = { ...defItem, ...data[key] };

            let {
                label,
                component,
                readme,
                dna,
                path,
                hideCode,
                hideDna,
                hideDocs,
            } = item;

            let { buttons = {} } = card;

            buttons = JSON.stringify(buttons);
            buttons = JSON.parse(buttons);

            let noCode = Boolean(typeof component === 'string');
            noCode = hideCode === true ? hideCode : noCode;

            if (noCode === true) {
                let idx = _.indexOf(
                    _.pluck(buttons.footer, 'name'),
                    'toggle-code',
                );
                buttons.footer.splice(idx, 1);
            }

            if (
                !dna ||
                hideDna == true ||
                typeof component === 'string' ||
                process.env.NODE_ENV !== 'development'
            ) {
                let idx = _.indexOf(
                    _.pluck(buttons.footer, 'name'),
                    'toggle-link',
                );
                buttons.footer.splice(idx, 1);
            }

            if (!readme || hideDocs === true) {
                let idx = _.indexOf(
                    _.pluck(buttons.footer, 'name'),
                    'toggle-docs',
                );
                buttons.footer.splice(idx, 1);
            }

            return (
                <Card
                    id={id}
                    title={label}
                    buttons={buttons}
                    key={`card-${id}`}
                    onButtonClick={this.onCardButtonClick}
                    ref={elm => {
                        //this.registerCard({ elm, id });
                    }}>
                    <Preview
                        component={component}
                        update={update}
                        group={group}
                        style={style}
                        dna={dna}
                        id={id}
                    />
                    {noCode !== true ? (
                        <Code
                            ref={elm => {
                                this.registerCode({ elm, id });
                            }}
                            onButtonClick={onButtonClick}
                            component={component}
                            update={update}
                            prefs={prefs}
                            group={group}
                            id={id}
                        />
                    ) : null}
                    {readme && hideDocs !== true ? (
                        <Docs
                            ref={elm => {
                                this.registerDocs({ elm, id });
                            }}
                            title={'Documentation'}
                            component={readme}
                            update={update}
                            prefs={prefs}
                            id={id}
                        />
                    ) : null}
                    {hideDna !== true ? (
                        <Dna
                            ref={elm => {
                                this.registerDnas({ elm, id });
                            }}
                            component={component}
                            update={update}
                            prefs={prefs}
                            menu={menu}
                            dna={dna}
                            id={id}
                        />
                    ) : null}
                </Card>
            );
        });
    }

    renderCrumbs({ title, group, element }) {
        let { onCrumbClick } = this.props;
        let elms = [];

        if (!element) {
            elms.push(<span key={`group-${group}`}>{title}</span>);
        } else {
            elms.push(
                <span key={`group-${group}-element`}>
                    <Link to={`/toolkit/${group}`} onClick={onCrumbClick}>
                        {title}
                    </Link>
                </span>,
            );
        }

        return (
            <div className={'re-toolkit-content-crumbs'}>
                {elms.map(elm => elm)}
            </div>
        );
    }

    render() {
        let {
            card,
            title,
            data,
            element,
            group,
            defaultComponent,
            update,
            onMenuToggleClick,
            prefs,
        } = this.props;

        let pos = op.get(prefs, 'sidebar.position', 'left');

        if (!data) {
            if (!defaultComponent) {
                return null;
            }

            const Overview = defaultComponent;
            return (
                <section className={'re-toolkit-content'}>
                    <Overview />
                    <button
                        type={'button'}
                        className={`re-toolkit-menu-toggle-${pos}`}
                        onClick={onMenuToggleClick}>
                        <svg>
                            <use xlinkHref={'#re-icon-menu'} />
                        </svg>
                    </button>
                </section>
            );
        }

        if (data && typeof data !== 'function') {
            element = data[element];

            const label = op.get(element, 'label', null);

            return (
                <section className={'re-toolkit-content'}>
                    {this.renderCrumbs({ title, group, element: label })}
                    {this.renderCards({ data, card, group })}
                    <button
                        type={'button'}
                        className={`re-toolkit-menu-toggle-${pos}`}
                        onClick={onMenuToggleClick}>
                        <svg>
                            <use xlinkHref={'#re-icon-menu'} />
                        </svg>
                    </button>
                </section>
            );
        } else {
            const Component = data;
            return (
                <section className={'re-toolkit-content'}>
                    {this.renderCrumbs({ title })}
                    {<Component />}
                    <button
                        type={'button'}
                        className={`re-toolkit-menu-toggle-${pos}`}
                        onClick={onMenuToggleClick}>
                        <svg>
                            <use xlinkHref={'#re-icon-menu'} />
                        </svg>
                    </button>
                </section>
            );
        }
    }
}

Content.defaultProps = {
    onButtonClick: null,
    onCrumbClick: null,
    onMenuToggleClick: null,
    onCopyClick: null,
    title: null,
    update: null,
    style: null,
    watchTimer: 200,
    data: {},
    prefs: {},
    menu: {},
    card: {
        buttons: {
            header: [
                {
                    name: 'toggle-fullscreen',
                    title: 'toggle fullscreen',
                    icon: '#re-icon-fullscreen',
                },
            ],
            footer: [
                {
                    name: 'toggle-code',
                    title: 'code view',
                    icon: '#re-icon-markup',
                },
                {
                    name: 'toggle-link',
                    title: 'dependencies',
                    icon: '#re-icon-link',
                },
                { name: 'toggle-docs', title: 'docs', icon: '#re-icon-docs' },
            ],
        },
    },
};
