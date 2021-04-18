import { hot } from 'react-hot-loader/root';
import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import HowTo from './HowTo';
import 'Styles/styles.less';

function App() {
  return (
    <HashRouter basename="/">
      <Header />
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route exact path="/howto">
          <HowTo />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default hot(App);
