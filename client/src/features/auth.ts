export interface Auth {
  username: string
  email: string
  request_params: {
    baseURL: string
    timeout: number
    headers: { 'Content-Type': string; Authorization: string }
  }
}

let es = { username: '', email: '', token: '' }

try {
  es = JSON.parse(document.cookie)
} catch (e) {
  document.cookie = JSON.stringify(es)
}

export const auth: Auth = {
  username: es.username,
  email: es.email,
  request_params: {
    baseURL: '/api',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json', Authorization: es.token },
  },
}
