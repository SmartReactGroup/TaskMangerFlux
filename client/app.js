import Fluxible from 'fluxible'
import App from './components/App'
import { UserStore, GroupStore } from './stores'
import { reactRouterPlugin } from './plugins'

// create new fluxible instance
const app = new Fluxible({
  component: App
})

app.plug(reactRouterPlugin())
app.registerStore(UserStore)
app.registerStore(GroupStore)

export default app
