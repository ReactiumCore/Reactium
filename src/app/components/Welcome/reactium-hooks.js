/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin Welcome
 * -----------------------------------------------------------------------------
 */

import { Welcome } from './index';
import Reactium from 'reactium-core/sdk';

(async () => {
    Reactium.Component.register('Welcome', Welcome);
})();
