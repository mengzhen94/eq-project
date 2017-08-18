import React, { Component } from 'react';

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
    return (
      <div className="StatsHourly">
        <div className="StatsHourly-header">
          <h2>Stats Hourly Data</h2>
        </div>
        {this.state.stats.map(stat =>
          <div key={stat.date + stat.hour}>{stat.date}:{stat.hour}:{stat.clicks}</div>
        )}
      </div>
    );
  }
}

export default StatsHourly;
