import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput,
} from 'react-native';


import InputText from "../components/InputText";
import {loginUser} from "../actions/auth.actions";
import Logo from '../components/Logo';
import Form from '../components/Form';
import Loader from "../components/Loader";
import {Actions} from 'react-native-router-flux';
import {Header} from 'react-native-elements';
import ValidationComponent from 'react-native-form-validator';


class LupaPassword extends ValidationComponent {

    login() {
        Actions.pop()
    }

    onSubmit = (values) => {
        this.loginUser(values);
    }
    render() {

        return(
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                {(loginUser && loginUser.isLoading) && <Loader />}
                <Logo/>
                <TextInput
                    autoCapitalize='words'
                    defaultValue={this.state.penanggungJawab}
                    ref="penanggungJawab"
                    onChangeText={(penanggungJawab) => this.setState({penanggungJawab})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Penanggung Jawab"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />
                {this.isFieldInError('penanggungJawab') && this.getErrorsInField('penanggungJawab').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Kirim Email</Text>
                </TouchableOpacity>
                <View style={styles.lupaPasswordTextCont}>
                    <Text style={styles.signupText}>Sudah mempunyai akun, silahkan?</Text>
                    <TouchableOpacity onPress={this.login()}><Text style={styles.signupButton}> Sign
                        in</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container : {
        backgroundColor:'#ffffff',
        flex: 1,
        alignItems:'center',
        justifyContent :'center'
    },
    inputBox: {
        width: 345,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
    signupTextCont : {

        justifyContent :'center',
        paddingTop:2,
        flexDirection:'row'
    },
    lupaPasswordTextCont : {

        flexGrow: 1,
        justifyContent :'center',
        flexDirection:'row'
    },
    signupText: {
        color:'rgba(80, 87, 79,0.6)',
        fontSize:16
    },
    signupButton: {
        color:'#50574f',
        fontSize:16,
        fontWeight:'500'
    },
    button: {
        width:300,
        backgroundColor:'#50574f',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
    },
});
export default (LupaPassword);
