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
import {baseApi} from '../../service/api';
import {showMessage} from 'react-native-flash-message';
import LoaderModal from '../../components/LoaderModal';


class LupaPasswordSaya extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading:false,
        };
    }

    login() {
        Actions.pop();
    }

    _onSubmit() {
        this.validate({
            email: {required: true},
        });
        if (this.isFormValid()) {
            this.setState({
                loading: true,
            });

            fetch(baseApi + '/user/lupaPassword', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.success === true) {
                    this.setState({
                        loading: false,
                    });
                    showMessage({
                        message: responseJson.message,
                        type: 'info',
                        position: 'bottom',
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                    showMessage({
                        message: responseJson.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            }).catch((error)=>{
                this.setState({
                    loading: false,
                });
                showMessage({
                    message: 'Jaringan Tidak Ada',
                    type: 'danger',
                    position: 'bottom',
                });
            })
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <LoaderModal
                    loading={this.state.loading}/>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Logo/>
                <TextInput
                    defaultValue={this.state.email}
                    ref="email"
                    onChangeText={(email) => this.setState({email})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Masukan No Hp / Email"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />
                {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
                <TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <View style={styles.lupaPasswordTextCont}>
                    <Text style={styles.signupText}>Sudah mempunyai akun, silahkan?</Text>
                    <TouchableOpacity onPress={this.login}><Text style={styles.signupButton}> Sign
                        in</Text></TouchableOpacity>
                </View>
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
export default (LupaPasswordSaya);
