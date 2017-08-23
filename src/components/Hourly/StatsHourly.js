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

class StatsHourly extends Component {

  state = {
    stats: [],
    message: ""
  }

  /*
  fetchOk(api) {
    return fetch(api).then(res => res.ok ? res : res.json().then(err => Promise.reject(err)));
  }
  */
  componentDidMount() {
    const search = this.props.location.search // could be '?page=2&size=10'
    const params = new URLSearchParams(search)
    const page = params.get('page') || 1 // page
    const size = params.get('size') || 168 // size
    /*
    this.fetchOk(`/data/stats/hourly?page=${page}&size=${size}`)
      .then(res => res.json())
      .then(stats => this.setState({ stats : stats}))
      .catch(error => this.setState({ message : error.message}))
    */

    fetch(`/data/stats/hourly?page=${page}&size=${size}`)
      .then(res => {
        if (res.ok) {
          res.json().then(stats => this.setState({ stats : stats}))
        }else {
          res.json().then(mess => this.setState({ message : mess.message}))
        }
      })

    /*
    fetch(`/data/stats/hourly?page=${page}&size=${size}`)
      .then(res => res.json())
      .then(resJson => {
        if(Array.isArray(resJson)){
          this.setState({ stats : resJson})
        }else{
          this.setState({ message : resJson})
        }
      })
    */
  }

  render() {
    const { stats, message } = this.state;
    return (
      <div className="StatsHourly">
        <h4 className="Error">{message}</h4>
        <div className="StatsHourly-header">
          <h2>Stats Hourly Data</h2>
        </div>
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

export default StatsHourly;
