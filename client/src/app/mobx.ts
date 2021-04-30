import { makeObservable, observable } from 'mobx'
import { auth } from '../features/auth'
import { ideas } from '../features/idea'
import axios from 'axios'

const a = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Authorization: '' },
})

export class State {
  @observable auth = auth
  useAuth = {
    setSession: (email: string, username: string, token: string) => {
      this.auth.request_params.headers.Authorization = 'Bearer' + token
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

  @observable ideas = ideas
  useIdeas = {
    update: () => {
      a.get('/idea/listall')
        .then((res) => {
          this.ideas = res.data.list
        })
        .catch()
    },
  }

  constructor() {
    makeObservable(this)
  }
}
