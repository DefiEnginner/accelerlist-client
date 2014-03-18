import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from "react-redux";
import { store } from '../../../../redux/store';
import Signin from '../index';

describe('Signin Component', () => {
  it('should render correctly', () => {
    const component = shallow(<Provider store={store}><Signin /></Provider>);
    expect(component).toMatchSnapshot();
  });

});

