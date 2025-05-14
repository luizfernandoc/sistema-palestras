import { StyleSheet, View, Text, Image } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'

import { icons } from '../../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.tabview}>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        style={styles.tabicon}
      />
      <Text style={[styles.tabtext, focused ? styles.semibold : styles.regular, { color }]}>
        {name}
      </Text>
    </View>
  )
}

const StudentTabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001', // Cor Secundária
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="questions"
        options={{
          title: 'Perguntas',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.bookmark}
              color={color}
              name="Perguntas"
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="assess"
        options={{
          title: 'Avaliação',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              name="Avaliação"
              focused={focused}
            />
          )
        }}
      />
    </Tabs>
  )
}

export default StudentTabsLayout

const styles = StyleSheet.create({
  tabicon: {
    width: 24,
    height: 24
  },
  tabview: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  tabtext: {
    fontSize: 12
  },
  semibold: {
    fontFamily: "Poppins-SemiBold"
  },
  regular: {
    fontFamily: "Poppins-Regular"
  }
})
