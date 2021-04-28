import { makeObservable, observable } from 'mobx'
import axios from 'axios'
import { auth } from '../features/auth'

export class State {
  @observable auth = auth
  a = axios.create(this.auth.request_params)
  useAuth = {
    setSession: (email: string, username: string, token: string) => {
      this.auth = {
        username: username,
        email: email,
        request_params: this.auth.request_params,
      }
      const es = { username: username, email: email, token: 'Bearer ' + token }
      document.cookie = JSON.stringify(es)
    },
    chemail: (email: string) => {
      this.auth = {
        username: this.auth.username,
        email: email,
        request_params: this.auth.request_params,
      }
    },
  }
  constructor() {
    makeObservable(this)
  }
}
