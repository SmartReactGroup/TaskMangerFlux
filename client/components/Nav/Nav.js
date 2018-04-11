import React from 'react'
import PropsTypes from 'prop-types'
import { connectToStores, provideContext } from 'fluxible-addons-react'
import { NavLink } from 'fluxible-router'
import UserStore from '../../stores/UserStore'

class Nav extends React.Component {
  // static propTypes = {
  //   // selected: PropsTypes.object,
  //   currentRoute: PropsTypes.object,
  //   links: PropsTypes.object
  // }
  // static contextTypes = {
  //   getStore: PropsTypes.func.isRequired
  // }
  // constructor(props) {
  //   super(props)
  //   this.state = this.getStoreState()
  // }
  // getStoreState() {
  //   return {
  //     loggedUser: this.context.getStore(UserStore).getUser()
  //   }
  // }

  render() {
    const selected = this.props.currentRoute
    const { links, username } = this.props
    const linkHTML = Object.keys(links).map((name) => {
      let className = ''
      const link = links[name]

      if (selected && selected.name === name) {
        className = 'pure-menu-selected'
      }

      return (
        <li className={className} key={link.path}>
          <NavLink routeName={link.page} activeStyle={{ backgroundColor: '#eee' }}>
            {link.title}
          </NavLink>
        </li>
      )
    })

    return (
      <ul className="pure-menu pure-menu-open pure-menu-horizontal">
        {linkHTML}
        <li>{(username === '') ? '' : `welcome, ${username}`}</li>
      </ul>
    )
  }
}

Nav.propTypes = {
  links: PropsTypes.object,
  currentRoute: PropsTypes.object,
  username: PropsTypes.string
}

Nav.defaultProps = {
  // selected: null,
  links: {}
}

export default Nav

// Nav.contextTypes = {
//   executeAction: PropsTypes.func,
//   getStore: PropsTypes.func
// }

// Nav.propTypes = {
//   context: PropsTypes.object,
//   loggedUser: PropsTypes.string,
//   links: PropsTypes.object
// }

// export default provideContext(
//   handleHistory(
//     connectToStores(Nav, [UserStore], (context, props) => ({
//       loggedUser: this.context.getStore(UserStore).getUser()
//     }))
//   )
// )
