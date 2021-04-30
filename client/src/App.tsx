import React, { useState } from 'react'
import { Observer } from 'mobx-react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { State } from './app/mobx'
import { AddUserPage } from './pages/addUserPage'
import { Menu } from './componenst/Menu'
import { LoginPage } from './pages/loginPage'
import { AboutPage } from './pages/aboutPage'
import { AddIdeaPage } from './pages/addIdeaPage'
import { IdeasPage } from './pages/ideasPage'

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
                render={() => (
                  <LoginPage setSession={state.useAuth.setSession} />
                )}
              />
              <Route
                exact
                path="/addidea"
                render={() => (
                  <AddIdeaPage request_params={state.auth.request_params} />
                )}
              />
              <Route
                exact
                path="/ideas"
                render={() => (
                  <IdeasPage
                    ideas={state.ideas}
                    update={state.useIdeas.update}
                  />
                )}
              />
              <Route
                exact
                path="/login"
                render={() => (
                  <LoginPage setSession={state.useAuth.setSession} />
                )}
              />
              <Route
                exact
                path="/about"
                render={() => (
                  <AboutPage
                    email={state.auth.email}
                    request_params={state.auth.request_params}
                    setSession={state.useAuth.setSession}
                    chemail={state.useAuth.chemail}
                  />
                )}
              />
              <Route exact path="/register" component={AddUserPage} />
            </Switch>
          </>
        )}
      </Observer>
    </Router>
  )
}

export default App
