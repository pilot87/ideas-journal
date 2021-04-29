export const gen_username = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
export const gen_email = () =>
  `${gen_username(Math.floor(Math.random() * 18) + 2)}@${gen_username(
    Math.floor(Math.random() * 3) + 2,
  )}.com`
export const gen_password = () => Math.random().toString(36).slice(-8)
