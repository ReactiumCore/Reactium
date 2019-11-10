import Context from 'reactium-core/components/WindowProvider/Context';
import { useContext, useEffect, useState, useRef } from 'react';
import Utils from '../utils';
import _ from 'underscore';
import op from 'object-path';

export const useWindow = () => {
    const { iWindow } = useContext(Context);
    return iWindow;
};

export const useDocument = () => {
    const { iDocument } = useContext(Context);
    return iDocument;
};

export const useBreakpoints = () => {
    const iWindow = useWindow();
    const iDocument = useDocument();
    return Utils.breakpoints(iWindow, iDocument);
};

export const useBreakpoint = width => {
    const iWindow = useWindow();
    const iDocument = useDocument();

    return Utils.breakpoint(iWindow, iDocument);
};

export const useWindowSize = (params = {}) => {
    const iWin = useWindow();
    const iDoc = useWindow();
    const hasWindow = Utils.isWindow(iWin);

    let { defaultWidth, defaultHeight, delay = 100 } = params;

    const getSize = () => {
        return hasWindow
            ? {
                  width: iWin.innerWidth,
                  height: iWin.innerHeight,
                  breakpoint: Utils.breakpoint(iWin.innerWidth, iWin, iDoc),
              }
            : {
                  width: defaultWidth,
                  height: defaultHeight,
                  breakpoint: Utils.breakpoint(defaultWidth),
              };
    };

    const sizeRef = useRef(getSize());
    const [, update] = useState(sizeRef.current);

    const setWindowSize = _.debounce(() => {
        sizeRef.current = getSize();
        update(sizeRef.current);
    }, delay);

    useEffect(() => {
        if (!hasWindow) {
            return;
        }

        iWin.addEventListener('resize', setWindowSize);

        return () => iWin.removeEventListener('resize', resized);
    }, [delay, defaultWidth, defaultHeight]);

    return sizeRef.current;
};
