import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

class EventsDaily extends Component {

  state = {events: []}

  componentDidMount() {
    fetch('/events/daily')
      .then(res => res.json())
      .then(events => this.setState({ events }));
  }

  render() {
    const { events } = this.state;
    return (
      <div className="EventsHourly">
        <div className="EventsHourly-header">
          <h2>Events Daily Data</h2>
        </div>
        <h4>Daily Events</h4>
        <AreaChart width={800} height={400} data={events} margin={{top: 10, right: 30, left: 30, bottom: 10}}>
          <XAxis dataKey="time"/>
          <YAxis/>
          <CartesianGrid />
          <Tooltip/>
          <Area type='monotone' dataKey='events' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
        <div>
          <ReactTable
            data={events}
            columns={[
              {
                Header: "Time",
                columns: [
                  {
                    Header: "Date",
                    accessor: "date"
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
      </div>
    );
  }
}

export default EventsDaily;
