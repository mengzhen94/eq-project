import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class EventsHourly extends Component {

  state = {events: []}

  componentDidMount() {
    fetch('/events/hourly')
      .then(res => res.json())
      .then(events => this.setState({ events }));
  }

  render() {
    const { events } = this.state;
    return (
      <div className="EventsHourly">
        <div className="EventsHourly-header">
          <h2>Events Hourly Data</h2>
        </div>
        <ReactTable
          data={events}
          columns={[
            {
              Header: "Time",
              columns: [
                {
                  Header: "Date",
                  accessor: "date"
                },
                {
                  Header: "Hour",
                  accessor: "hour"
                }
              ]
            },
            {
              Header: "Stats",
              columns: [
                {
                  Header: "Events",
                  accessor: "events"
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default EventsHourly;
