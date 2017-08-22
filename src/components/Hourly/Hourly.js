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

class Hourly extends Component {

  state = {stats: []}

  componentDidMount() {
    fetch(`/data/hourly`,)
      .then(res => res.json())
      .then(stats => this.setState({ stats }))
  }

  render() {
    const { stats } = this.state;
    return (
      <div className="StatsHourly">
        <div className="StatsHourly-header">
          <h2>Stats&Events Hourly Data</h2>
        </div>
        <h4>Hourly Events</h4>
        <AreaChart width={800} height={400} data={stats} margin={{top: 10, right: 30, left: 30, bottom: 10}}>
          <XAxis dataKey="time" />
          <YAxis/>
          <CartesianGrid />
          <Tooltip/>
          <Area type='monotone' dataKey='eventNum' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
        <h4>Hourly Clicks</h4>
        <AreaChart width={800} height={400} data={stats} margin={{top: 10, right: 30, left: 30, bottom: 10}}>
          <XAxis dataKey="time"/>
          <YAxis/>
          <CartesianGrid />
          <Tooltip/>
          <Area type='monotone' dataKey='clicks' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
        <h4>Hourly Impressions</h4>
        <AreaChart width={800} height={400} data={stats} margin={{top: 10, right: 30, left: 30, bottom: 10}}>
          <XAxis dataKey="time"/>
          <YAxis/>
          <CartesianGrid />
          <Tooltip/>
          <Area type='monotone' dataKey='impressions' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
        <h4>Hourly Revenue</h4>
        <AreaChart width={800} height={400} data={stats} margin={{top: 10, right: 30, left: 30, bottom: 10}}>
          <XAxis dataKey="time"/>
          <YAxis/>
          <CartesianGrid />
          <Tooltip/>
          <Area type='monotone' dataKey='revenue' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
        <ReactTable
          data={stats}
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
                  Header: "Clicks",
                  accessor: "clicks"
                },
                {
                  Header: "Impressions",
                  accessor: "impressions"
                },
                {
                  Header: "Revenue",
                  accessor: "revenue"
                },
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

export default Hourly;
