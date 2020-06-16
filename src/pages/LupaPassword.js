import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar ,
    TouchableOpacity,
    Alert
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";
import { Field, reduxForm } from 'redux-form';

import InputText from "../components/InputText";
import {loginUser} from "../actions/auth.actions";
import Logo from '../components/Logo';
import Form from '../components/Form';
import Loader from "../components/Loader";
import {Actions} from 'react-native-router-flux';
import {Header} from 'react-native-elements';


const styles = StyleSheet.create({
    container : {
        backgroundColor:'#ffffff',
        flex: 1,
        alignItems:'center',
        justifyContent :'center'
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


class LupaPassword extends Component<{}> {

    signup() {
        Actions.signup()
    }


    login() {
        Actions.login()
    }
    loginUser = async (values) => {
        try {
            const response =  await this.props.dispatch(loginUser(values));
            console.log(response);
            if (!response.success) {
                Alert.alert(
                    'Login Error!',
                    errorText,
                    [
                        {
                            text: 'Password salah',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ]
                );
            }
        } catch (error) {
            let errorText;
            if (error.message) {
                errorText = error.message
            }
            errorText = error.responseBody;
            Alert.alert(
                'Login Error!',
                errorText,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ]
            );
        }
    }

    onSubmit = (values) => {
        this.loginUser(values);
    }

    renderTextInput = (field) => {
        const {meta: {touched, error}, label, secureTextEntry, maxLength, keyboardType, placeholder, input: {onChange, ...restInput}} = field;
        return (
            <View>
                <InputText
                    onChangeText={onChange}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    label={label}
                    {...restInput} />
                {(touched && error) && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }

    render() {
        const { handleSubmit, loginUser} = this.props;
        console.log(loginUser);
        return(
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Edit Profil', style: {color: '#fff'}}}
                />
                {(loginUser && loginUser.isLoading) && <Loader />}
                <Logo/>
                <Field
                    name="email"
                    placeholder="Email"
                    component={this.renderTextInput} />
                <TouchableOpacity style={styles.button} onPress={handleSubmit(this.onSubmit)}>
                    <Text style={styles.buttonText}>Kirim Email</Text>
                </TouchableOpacity>
                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Apakah anda belum mempunyai akun ?</Text>
                    <TouchableOpacity onPress={this.signup}><Text style={styles.signupButton}> Signup</Text></TouchableOpacity>
                </View>
                <View style={styles.lupaPasswordTextCont}>
                    <Text style={styles.signupText}>Sudah mempunyai akun, silahkan?</Text>
                    <TouchableOpacity onPress={this.login()}><Text style={styles.signupButton}> Sign
                        in</Text></TouchableOpacity>

                </View>
            </View>
        )
    }
}

const validate = (values) => {
    const errors = {};

    if(!values.email) {
        errors.email = "Email is required"
    }
    return errors;
};

mapStateToProps = (state) => ({
    loginUser: state.authReducer.loginUser
})

mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: "lupapassword",
        validate
    })
)(LupaPassword);
