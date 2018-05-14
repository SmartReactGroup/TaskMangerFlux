/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'

export default class CustomFluxibleComponent extends React.Component {

  static displayName = 'CustomFluxibleComponent'

  static propTypes = {
    context: PropTypes.object.isRequired
  }

  static childContextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    config: PropTypes.object,
    devices: PropTypes.object
  }

  /**
   * Provides the current context as a child context
   * @method getChildContext
   */
  getChildContext() {
    return {
      getStore: this.props.context.getStore,
      executeAction: this.props.context.executeAction,
      config: this.props.context.config,
      devices: this.props.context.devices
    }
  }

  render() {
    return React.cloneElement(this.props.children, {
      context: this.props.context
    })
  }
}
