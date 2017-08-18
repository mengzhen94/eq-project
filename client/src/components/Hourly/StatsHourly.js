import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class StatsHourly extends Component {

  state = {stats: []}

  componentDidMount() {
    const search = this.props.location.search // could be '?page=2&size=10'
    const params = new URLSearchParams(search)
    const page = params.get('page') || 1 // page
    const size = params.get('size') || 168 // size
    fetch(`/stats/hourly?page=${page}&size=${size}`,)
      .then(res => res.json())
      .then(stats => this.setState({ stats }))
  }

  render() {
    const { stats } = this.state;
    return (
      <div className="StatsHourly">
        <div className="StatsHourly-header">
          <h2>Stats Hourly Data</h2>
        </div>
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
