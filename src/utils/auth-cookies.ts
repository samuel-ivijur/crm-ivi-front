import Cookies from 'js-cookie'

const AUTH_COOKIE_NAME = 'auth_token'
const USER_COOKIE_NAME = 'user_data'

export const authCookies = {
  setAuthData: (token: string, userData: any) => {
    Cookies.set(AUTH_COOKIE_NAME, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 7, // 7 dias
    })

    Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 7,
    })
  },

  getAuthData: () => {
    const token = Cookies.get(AUTH_COOKIE_NAME)
    const userData = Cookies.get(USER_COOKIE_NAME)

    return {
      token,
      user: userData ? JSON.parse(userData) : null,
    }
  },

  clearAuthData: () => {
    Cookies.remove(AUTH_COOKIE_NAME)
    Cookies.remove(USER_COOKIE_NAME)
  },
} 