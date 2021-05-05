import React, { useCallback, useEffect, useState } from 'react'
import { Observer } from 'mobx-react-lite'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// import { State } from './app/mobx'
import { AddUserPage } from './pages/addUserPage'
import { Menu } from './componenst/Menu'
import { LoginPage } from './pages/loginPage'
import { AboutPage } from './pages/aboutPage'
import { AddIdeaPage } from './pages/addIdeaPage'
import { IdeasPage } from './pages/ideasPage'
import { auth } from './features/auth'
import { ideas } from './features/ideas'

const App = () => {
  // const [state] = useState(() => new State())
  // useEffect(() => {
  //   state.updCycle()
  // }, [])

  return (
    <Router>
      <Observer>
        {() => (
          <>
            <Menu username={auth.username} />
            <Switch>
              {/*change to something else*/}
              <Route
                exact
                path="/"
                render={() => (
                  <LoginPage
                    setSession={auth.setSession}
                    setUsername={auth.setUsername}
                    setEmail={auth.setEmail}
                  />
                )}
              />
              <Route
                exact
                path="/addidea"
                render={() => <AddIdeaPage send={auth.send} />}
              />
              <Route
                exact
                path="/ideas"
                render={() => (
                  <IdeasPage
                    ideas={ideas.ideas}
                    update={ideas.update}
                    // watch={state.useIdeas.setAuto}
                  />
                )}
              />
              <Route
                exact
                path="/login"
                render={() => (
                  <LoginPage
                    setSession={auth.setSession}
                    setUsername={auth.setUsername}
                    setEmail={auth.setEmail}
                  />
                )}
              />
              <Route
                exact
                path="/about"
                render={() => (
                  <AboutPage
                    email={auth.email}
                    setSession={auth.setSession}
                    setEmail={auth.setEmail}
                    setUsername={auth.setUsername}
                    send={auth.send}
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
