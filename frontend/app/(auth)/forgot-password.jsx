import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { images } from '../../constants'

const ForgotPassword = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const submit = () => {

    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View style={styles.viewstyle1}>
                    <Image
                        source={images.inova}
                        resizeMode='contain'
                        style={styles.inova}
                    />

                    <Text style={styles.textstyle1}>
                        Esqueceu sua senha?
                    </Text>

                    <Text style={styles.textstyle2}>
                        Para recupera-la, digite seu email abaixo e vamos te enviar um email de recuperação!
                    </Text>

                    <FormField
                        placeholder={"Seu email aqui"}
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles={styles.formfield}
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <CustomButton
                        title="Enviar"
                        handlePress={submit}
                        containerStyles={styles.buttonstyle}
                        isLoading={isSubmitting}
                    />

                    <Image
                        source={images.forgotpassword}
                        resizeMode='contain'
                        style={styles.forgotpassword}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#161622",
        height: "100%"
    },
    textstyle: {
        color: 'white'
    },
    viewstyle1: {
        width: "100%",
        justifyContent: "center",
        minHeight: "85%",
        paddingHorizontal: 16,
        marginVertical: 24
    },
    formfield: {
        marginTop: 8
    },
    textstyle1: {
        color: "white",
        fontFamily: "Poppins-SemiBold",
        fontSize: 24,
        lineHeight: 32,
        marginTop: 40,
        fontWeight: 600
    },
    textstyle2: {
        color: "white",
        width: '80%',
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        lineHeight: 28,
        marginTop: 10,
    },
    inova: {
        marginTop: 28,
        width: 145,
        height: 44
    },
    forgotpassword: {
        width: 350,
        height: 330,
        marginTop: 28
    },
    buttonstyle: {
        marginTop: 32
    }
})