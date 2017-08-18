import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Hourly extends Component {

  state = {stats: []}

  componentDidMount() {
    fetch(`/hourly`,)
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
