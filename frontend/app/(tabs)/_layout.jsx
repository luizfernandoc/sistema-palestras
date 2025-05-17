import { StyleSheet, View, Text, Image } from 'react-native'
import { Tabs, Redirect, usePathname } from 'expo-router'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { icons } from '../../constants'

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

const TabsLayout = () => {
  const [presentationId, setPresentationId] = useState(null);
  
  useEffect(() => {
    // Carregar o ID da palestra do AsyncStorage
    const loadPresentationId = async () => {
      try {
        const id = await AsyncStorage.getItem('selectedPresentationId');
        if (id) {
          setPresentationId(id);
        }
      } catch (error) {
        console.error('Erro ao carregar ID da palestra:', error);
      }
    };
    
    loadPresentationId();
  }, []);

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
      name="questions"
      options={{
        title: 'Questions',
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
      name="edit"
      options={{
        title: 'Edit',
        headerShown: false,
        tabBarIcon: ({ color, focused }) => (
          <TabIcon
            icon={icons.plus}
            color={color}
            name="Editar"
            focused={focused}
          />
        )
      }}
    />
    <Tabs.Screen
      name="feedback"
      options={{
        title: 'Feedback',
        headerShown: false,
        tabBarIcon: ({ color, focused }) => (
          <TabIcon
            icon={icons.profile}
            color={color}
            name="Feedback"
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