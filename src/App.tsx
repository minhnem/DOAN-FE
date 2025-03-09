import React from 'react';
import './App.css';
import { ConfigProvider } from 'antd';
import Routers from './routers/Routers';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#AD343E',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 16
      }
    }}>
      <Provider store={store}>
        <Routers/>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
