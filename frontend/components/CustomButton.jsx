import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

/*
    Na verdade não é um botão em si, e sim um "Touchable Opacity", que é um componente para a criação de botões porém com efeito de transparência ao ser pressionado, melhorando a experiência do usuário.
*/

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={[styles.touchableopacitystyle, isLoading && styles.opacity, containerStyles]}
            disabled={isLoading}
        >
            <Text style={[styles.textstyle1, textStyles]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    touchableopacitystyle: {
        backgroundColor: '#FF9C01',
        borderRadius: 12,
        minHeight: 62,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textstyle1: {
        color: '#161622',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        lineHeight: 28
    },

    opacity: {
        opacity: 0.5
    }
})