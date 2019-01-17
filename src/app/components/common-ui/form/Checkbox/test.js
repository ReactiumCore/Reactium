import React from 'react';
import Checkbox from './index';
import { shallow } from 'reactium-core/enzyme';

test('<Checkbox />', () => {
    const props = {
        align: 'right',
        checked: false,
        disabled: false,
        id: 'test-checkbox',
        name: 'test-checkbox',
        required: true,
        text: 'Check Me',
        type: 'checkbox',
        value: 'yep',
    };

    const checkBox = shallow(<Checkbox {...props} />);

    expect(checkBox.html().length).toBeGreaterThan(0);
    expect(checkBox.find('#test-checkbox')).toBeDefined();
});
