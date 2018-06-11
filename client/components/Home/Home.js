import React from 'react'
// import PropTypes from 'prop-types'

class Home extends React.Component {
  render() {
    return (
      <div className="home-container">
        <div className="home-introduce">
          <h2 className="home-title">
            Task Manager
          </h2>
        </div>
        <div className="home-row">
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
    )
  }
}
export default Home
