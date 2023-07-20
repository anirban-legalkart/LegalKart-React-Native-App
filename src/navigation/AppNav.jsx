import { NavigationContainer } from '@react-navigation/native'
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import AppStack from './AppStack'
import AuthStack from './AuthStack'

const AppNav = () => {

  const { userToken } = useContext(AuthContext);
  // console.log(userToken, 'userToken-->');

  return (
    <>
      <NavigationContainer>
        {
          userToken !== null ? <AppStack /> : <AuthStack />
        }
      </NavigationContainer>
    </>
  )
}

export default AppNav