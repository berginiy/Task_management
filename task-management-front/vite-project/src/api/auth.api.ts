import api from './axios'

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  const { token } = response.data
  localStorage.setItem('accessToken', token)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  window.location.href = '/login'
}