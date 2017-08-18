import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import EventsHourly from './components/EventsHourly';
import StatsHourly from './components/StatsHourly';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/events/hourly" component={EventsHourly} />
      <Route path="/stats/hourly" component={StatsHourly} />
    </div>
  </Router>
);

export default Routes;
