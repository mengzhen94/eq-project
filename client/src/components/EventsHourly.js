import React, { Component } from 'react';

class EventsHourly extends Component {

  state = {events: []}

  componentDidMount() {
    fetch('/events/hourly')
      .then(res => res.json())
      .then(events => this.setState({ events }));
  }

  render() {
    return (
      <div className="EventsHourly">
        <div className="EventsHourly-header">
          <h2>Events Hourly Data</h2>
        </div>
        {this.state.events.map(event =>
          <div key={event.date + event.hour}>{event.date}:{event.hour}:{event.events}</div>
        )}
      </div>
    );
  }
}

export default EventsHourly;
