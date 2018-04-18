/* eslint-disable */
const React = require('react')
const PropTypes = require('prop-types')
const createReactClass = require('create-react-class')

const CustomFluxibleComponent = createReactClass({
  displayName: 'CustomFluxibleComponent',

  propTypes: {
    context: PropTypes.object.isRequired
  },

  childContextTypes: {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    config: PropTypes.object,
    devices: PropTypes.object
  },

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
  },

  render() {
    return React.cloneElement(this.props.children, {
      context: this.props.context
    })
  }
})

export default CustomFluxibleComponent
