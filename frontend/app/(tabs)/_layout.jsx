import { StyleSheet, View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'

import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.tabview}>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
        style={styles.tabicon}
      />
      <Text style={[styles.tabtext, focused ? styles.semibold : styles.regular, { color }]}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001', // Cor Secundária 300
          tabBarInactiveTintColor: "#CDCDE0", // Cor Gray
          tabBarStyle: {
            backgroundColor: "#161622", // Cor Primária
            borderTopWidth: 1,
            borderTopColor: "#232533", // Cor Preta 200
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
          name="bookmark"
          options={{
            title: 'Bookmark',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({
  tabicon: {
    width: 24,
    height: 24
  },
  tabview: {
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