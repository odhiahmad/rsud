import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput,
} from 'react-native';

import Logo from '../../components/Logo';
import {Actions} from 'react-native-router-flux';
import {Header} from 'react-native-elements';
import ValidationComponent from 'react-native-form-validator';


class KonfirmasiOtp extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            kodeOtp: '',
        };
    }

    login() {
        Actions.pop();
    }

    _onSubmit() {
        this.validate({
            email: {number: true},
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Logo/>
                <TextInput
                    keyboardType="numeric"
                    defaultValue={this.state.kodeOtp}
                    ref="kodeOtp"
                    onChangeText={(email) => this.setState({kodeOtp})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Kode Otp"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />
                {this.isFieldInError('kodeOtp') && this.getErrorsInField('kodeOtp').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
                <TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
    signupTextCont: {

        justifyContent: 'center',
        paddingTop: 2,
        flexDirection: 'row',
    },
    lupaPasswordTextCont: {

        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    signupText: {
        color: 'rgba(80, 87, 79,0.6)',
        fontSize: 16,
    },
    signupButton: {
        color: '#50574f',
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        width: 300,
        backgroundColor: '#50574f',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
});
export default (KonfirmasiOtp);
