import React, { useState } from 'react'
import { Observer } from 'mobx-react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { State } from './app/mobx'
import { AddUser } from './pages/addUser'
import { Menu } from './componenst/Menu'
import { Login } from './pages/login'
import { About } from './pages/about'
import { AddIdea } from './pages/addIdea'

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
                path="/addidea"
                render={() => (
                  <AddIdea request_params={state.auth.request_params} />
                )}
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
                    email={state.auth.email}
                    request_params={state.auth.request_params}
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
