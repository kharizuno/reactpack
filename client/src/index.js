import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import 'antd/dist/antd.css';
import './style/index.css';

import store, {history} from './store';
import App from './contains/App';
import * as serviceWorker from './serviceWorker';

history.listen(function(loc) {
  // Don't scroll to top if user presses back
  // - if (loc.action === 'POP' || loc.action === 'REPLACE') is an option
  if (loc.action === 'POP') {
    return;
  }

  // Allow the client to control scroll-to-top using location.state
  if (loc.state && loc.state.scroll !== undefined && !loc.state.scroll) {
    return;
  }

  // 200ms delay hack (for Firefox?)
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 200);
});

ReactDOM.render(
  <Provider store={store}>
    <App history={history}/>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
