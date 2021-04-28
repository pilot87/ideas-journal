import React, { useState } from 'react'
import { observer, Observer } from 'mobx-react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { State } from './app/mobx'
import { AddUser } from './pages/addUser'
import { Menu } from './componenst/Menu'
import { Login } from './pages/login'
import { About } from './pages/about'

const App = () => {
  const [state] = useState(() => new State())

  return (
    <Router>
      <Observer>
        {() => (
          <>
            <Menu username={state.auth.username} />
            <Switch>
              {/*change to something else*/}
              <Route
                exact
                path="/"
                render={() => <Login setSession={state.useAuth.setSession} />}
              />
              <Route
                exact
                path="/login"
                render={() => <Login setSession={state.useAuth.setSession} />}
              />
              <Route
                exact
                path="/about"
                render={() => (
                  <About
                    auth={state.auth}
                    setSession={state.useAuth.setSession}
                    chemail={state.useAuth.chemail}
                  />
                )}
              />
              <Route exact path="/register" component={AddUser} />
            </Switch>
          </>
        )}
      </Observer>
    </Router>
  )
}

export default App
