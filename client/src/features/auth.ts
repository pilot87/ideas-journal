import {
  observable,
  computed,
  configure,
  action,
  autorun,
  makeAutoObservable,
} from 'mobx'
import axios from 'axios'

configure({ enforceActions: 'observed' })

export class Auth {
  es = (() => {
    let e = { username: '', token: '', email: '' }
    try {
      e = JSON.parse(document.cookie)
    } catch (err) {
      document.cookie = JSON.stringify(e)
    }
    return e
  })()

  @observable username = this.es.username
  @observable session = this.es.token
  @observable email = this.es.email
  @computed get request_params() {
    return {
      baseURL: '/api',
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.session,
      },
    }
  }

  @computed get send() {
    return axios.create(this.request_params)
  }

  @action setSession(value: string) {
    this.session = value
  }
  @action setUsername(value: string) {
    this.send.get('/idea/listall').then((res) => {
      this.username = value
    })
    // this.username = value
  }
  @action setEmail(value: string) {
    this.email = value
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}

export const auth = new Auth()

autorun(() => {
  document.cookie = JSON.stringify({
    username: auth.username,
    token: auth.session,
    email: auth.email,
  })
})
