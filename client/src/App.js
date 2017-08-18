import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {events: []}

  componentDidMount() {
    fetch('/events/hourly')
      .then(res => res.json())
      .then(events => this.setState({ events }));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.state.events.map(event =>
          <div key={event.date + event.hour}>{event.date}:{event.hour}:{event.events}</div>
        )}
      </div>
    );
  }
}

export default App;
