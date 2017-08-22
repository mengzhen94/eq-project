import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import App from './App';
import EventsHourly from './components/Hourly/EventsHourly';
import StatsHourly from './components/Hourly/StatsHourly';
import Hourly from './components/Hourly/Hourly';
import EventsDaily from './components/Daily/EventsDaily';
import StatsDaily from './components/Daily/StatsDaily';
import Daily from './components/Daily/Daily';
import NotMatch from './components/NotMatch';
import RateLimited from './components/RateLimited';

const Routes = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events/hourly">Events Hourly Data</Link></li>
        <li><Link to="/stats/hourly">Stats Hourly Data</Link></li>
        <li><Link to="/hourly">Stats&Events Hourly Data</Link></li>
        <li><Link to="/events/daily">Events Daily Data</Link></li>
        <li><Link to="/stats/daily">Stats Daily Data</Link></li>
        <li><Link to="/daily">Stats&Events Daily Data</Link></li>
      </ul>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/events/hourly" component={EventsHourly} />
        <Route path="/stats/hourly" component={StatsHourly} />
        <Route path="/hourly" component={Hourly} />
        <Route path="/events/daily" component={EventsDaily} />
        <Route path="/stats/daily" component={StatsDaily} />
        <Route path="/daily" component={Daily} />
        <Route component={NotMatch}/>
      </Switch>
    </div>
  </Router>
);

export default Routes;
