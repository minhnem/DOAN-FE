import React, { useEffect } from 'react'
import MainRouter from './MainRouter'
import AuthRouter from './AuthRouter'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector, AuthState } from '../redux/reducers/authReducer'

const Routers = () => {
  const auth: AuthState = useSelector(authSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    getData()
  }, []);

  const getData = () => {
    const res = localStorage.getItem('auth')
    res && dispatch(addAuth(JSON.parse(res)))
  }

  return auth.accesstoken ? <MainRouter/> : <AuthRouter/>
}

export default Routers
