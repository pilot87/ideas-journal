import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { AddUserPage } from './pages/addUserPage'
import { Menu } from './componenst/Menu'
import { LoginPage } from './pages/loginPage'
import { AboutPage } from './pages/aboutPage'
import { AddIdeaPage } from './pages/addIdeaPage'
import { IdeasPage } from './pages/ideasPage'
import { ideas } from './features/ideas'
import { ModalLogin } from './componenst/ModalLogin'

import { ForbiddenException } from './features/errors'

const updCycle = async () => {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  while (true) {
    if (ideas.auto) {
      ideas.update()
    }
    await sleep(10000)
  }
}

const App = () => {
  useEffect(() => {
    updCycle()
  }, [])

  return (
    <Router>
      <ModalLogin />
      <Menu />
      <Switch>
        {/*change to something else*/}
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/addidea" component={AddIdeaPage} />
        <Route exact path="/ideas" component={IdeasPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/register" component={AddUserPage} />
      </Switch>
    </Router>
  )
}

export default App
