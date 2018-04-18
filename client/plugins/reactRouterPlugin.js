/**
 * @class ReactRouterPlugin
 *
 * Provides the ReactRouter `history` on the action and component contexts.
 *
 * @returns {Object} The ReactRouterPlugin instance.
 */
export default () => {
  let _history

  /**
   * Provide the ReactRouter `history` if it was set, on the server it would typically not be.
   */
  function provideHistory(context) {
    if (_history) {
      context.history = _history
    }
  }

  return {
    name: 'ReactRouterPlugin',
    plugContext() {
      return {
        /**
         * Provides full access to the router history on the component context.
         */
        plugComponentContext: provideHistory,
        /**
         * Provides full access to the router history in the action.
         */
        plugActionContext: provideHistory
      }
    },

    /**
     * @param {Object} history A react-router history instance.
     */
    setHistory(history) {
      _history = history
    }
  }
}
