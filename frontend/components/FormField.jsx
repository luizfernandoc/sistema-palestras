import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <View style={[styles.viewstyle1, otherStyles]}>
            <Text style={styles.textstyle1}>
                {title}
            </Text>

            <View style={[styles.viewinput, isFocused && styles.focusedBorder]}>
                <TextInput
                    style={styles.textinput}
                    value={value}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={handleChangeText}
                    {...props}
                    secureTextEntry={(title === 'Senha' && !showPassword) || (title === 'Confirmar Senha' && !showConfirmPassword)}
                />

                {(title === 'Senha' || title === 'Confirmar Senha') && (
                    <TouchableOpacity
                        onPress={() => {
                            if (title === 'Senha') {
                                setShowPassword(!showPassword)
                            } else {
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        }}
                    >
                        <Image
                            source={
                                (title === 'Senha' && !showPassword) || (title === 'Confirmar Senha' && !showConfirmPassword) ? icons.eye : icons.eyeHide
                            }
                            style={styles.iconpassword}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField

const styles = StyleSheet.create({
    viewstyle1: {
        gap: 8
    },

    textstyle1: {
        fontSize: 16 ,
        lineHeight: 24,
        color: '#CDCDE0',
        fontFamily: "Poppins-Medium"
    },

    viewinput: {
        width: "100%",
        height: 64,
        backgroundColor: "#1E1E2D",
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#232533',
        flexDirection: "row"
    },

    focusedBorder: {
        borderColor: "#FF9C01"
    },

    textinput: {
        flex: 1,
        color: "white",
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        outlineStyle: "none" 
        // Corrige um erro na versão PC, mesmo que ela não seja utilizada
    },

    iconpassword: {
        width: 24,
        height: 24
    }
})