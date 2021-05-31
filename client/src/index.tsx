import React from 'react'
import ReactDOM from 'react-dom'

import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Helmet } from 'react-helmet'

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Forecast trading emulator</title>
      <base href="/ij/" />
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass send function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
