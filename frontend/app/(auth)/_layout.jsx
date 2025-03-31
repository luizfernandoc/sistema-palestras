import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

// Para todas as páginas que NÃO vão possuir rodapé de navegação

const AuthLayout = () => {
  return (
    <>
      <Stack>
      <Stack.Screen
          name="main"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style='light' />
    </>
  )
}

export default AuthLayout