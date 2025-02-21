import { User } from '@/types/auth'
import Cookies from 'js-cookie'

const AUTH_COOKIE_NAME = 'auth_token'
const USER_COOKIE_NAME = 'user_data'
const SELECTED_ORGANIZATION_COOKIE_NAME = 'selected_org'

const cookieOptions: Cookies.CookieAttributes = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: 7,
}
export const authCookies = {
  setAuthData: ({ token, user }: AuthData): void => {
    Cookies.set(AUTH_COOKIE_NAME, token, cookieOptions)
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), cookieOptions)
    if (user.organizations.length > 0) Cookies.set(SELECTED_ORGANIZATION_COOKIE_NAME, user.organizations[0].id, cookieOptions)
  },

  getAuthData: (): AuthData => {
    const token = Cookies.get(AUTH_COOKIE_NAME)
    const userData = Cookies.get(USER_COOKIE_NAME)
    const selectedOrganization = Cookies.get(SELECTED_ORGANIZATION_COOKIE_NAME)
    let user: User = {
      id: "-1",
      email: "",
      name: "",
      organizations: [],
      permissions: { id: -1, value: "" }
    }

    try{
      user = JSON.parse(String(userData || {}))
    } catch(e){}

    return {
      token: String(token),
      user,
      selectedOrganization
    }
  },

  getToken: (): string => {
    const token = Cookies.get(AUTH_COOKIE_NAME)
    return String(token)
  },

  clearAuthData: () => {
    Cookies.remove(AUTH_COOKIE_NAME)
    Cookies.remove(USER_COOKIE_NAME)
    Cookies.remove(SELECTED_ORGANIZATION_COOKIE_NAME)

  },
} 

type AuthData = {
  token: string
  user: User
  selectedOrganization?: string
}