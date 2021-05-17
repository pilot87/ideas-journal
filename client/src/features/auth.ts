import {
  observable,
  computed,
  configure,
  action,
  autorun,
  makeAutoObservable,
} from 'mobx'
import axios from 'axios'

import { ForbiddenException } from './errors'

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
    return new Proxy(axios.create(this.request_params), {
      get(target: any, prop: string | symbol): Promise<any> {
        if (
          typeof prop === 'string' &&
          ['get', 'post'].includes(<string>prop)
        ) {
          return new Proxy(target[prop], {
            apply(target: any, thisArg: any, argArray: any[]) {
              return new Promise(async (resolve, reject) => {
                try {
                  const res = await target(...argArray)
                  resolve(res)
                } catch (err) {
                  if (
                    err.response.status === 403 &&
                    err.response.data.message === 'Forbidden resource'
                  ) {
                    throw new ForbiddenException()
                  }
                  reject(err)
                }
              })
            },
          })
        }
        return target[prop]
      },
    })
  }

  @action setSession(value: string) {
    this.session = value
  }
  @action setUsername(value: string) {
    this.username = value
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
