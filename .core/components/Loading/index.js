import op from 'object-path';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Loading
 * -----------------------------------------------------------------------------
 */
let Loading = (
    { controlled, visible: initVisible, style: initStyle, ...props },
    ref,
) => {
    const containerRef = useRef();
    const ival = useRef();
    const opacity = useRef(initVisible === true ? 1 : 0);

    const [visible, setVisible] = useState(initVisible);

    const [init, setInit] = useState(false);

    const [style, setStyle] = useState({
        ...initStyle,
        display: opacity.current === 1 ? null : 'none',
        opacity: opacity.current,
    });

    const show = () => {
        let i = ival.current;
        if (i) clearInterval(i);

        const cont = containerRef.current;
        if (cont) {
            cont.style.display = null;
            if (init !== true) {
                cont.style.opacity = 0;
            }
        }

        i = setInterval(() => {
            opacity.current = opacity.current + 0.0125;
            opacity.current = Math.min(opacity.current, 1);

            if (cont) cont.style.opacity = opacity.current;

            if (opacity.current === 1) {
                clearInterval(i);
                setStyle({ ...style, display: null });
            }
        }, 1);

        ival.current = i;
    };

    const hide = () => {
        let i = ival.current;
        if (i) clearInterval(i);
        const cont = containerRef.current;

        i = setInterval(() => {
            opacity.current = opacity.current - 0.0125;
            opacity.current = Math.max(opacity.current, 0);

            if (cont) cont.style.opacity = opacity.current;

            if (opacity.current === 0) {
                cont.style.display = 'none';
                clearInterval(i);
                setStyle({ ...style, opacity: null });
            }
        }, 1);

        ival.current = i;
    };

    useImperativeHandle(
        ref,
        () => ({
            ...props,
            hide,
            show,
            containerRef,
            visible,
            setStyle,
            setVisible,
        }),
        [visible],
    );

    useEffect(() => {
        if (controlled === true) {
            const val = op.get(props, 'visible');
            if (val !== visible) setVisible(val);
        }
    }, [controlled, initVisible]);

    useEffect(() => {
        if (controlled === true) {
            const val = op.get(props, 'style');
            if (val !== style) setStyle(val);
        }
    }, [controlled, initStyle]);

    useEffect(() => {
        if (visible === true) {
            show();
        } else {
            hide();
        }
    }, [visible]);

    useEffect(() => {
        setInit(true);
    }, []);

    return ReactDom.createPortal(
        <div ref={containerRef} style={style} {...props} />,
        document.body,
    );
};

Loading = forwardRef(Loading);

Loading.propTypes = {
    className: PropTypes.string,
    controlled: PropTypes.bool,
    style: PropTypes.object,
    visible: PropTypes.bool,
};

Loading.defaultProps = {
    className: 'reactium-loading',
    controlled: false,
    style: {},
    visible: true,
};

export { Loading };
