import { createContext } from 'react';

export default createContext({
    iWindow: typeof window !== 'undefined' ? window : undefined,
    iDocument: typeof document !== 'undefined' ? document : undefined,
});
