import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Field, reduxForm} from 'redux-form';

import InputText from '../components/InputText';
import {loginUser} from '../actions/auth.actions';
import Logo from '../components/Logo';
import Form from '../components/Form';
import Loader from '../components/Loader';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Body, Left, ListItem, Right, Switch} from 'native-base';

const required = value => value ? undefined : 'Required';
const maxLength = max => value =>
    value && value.length > max ? <Text style={{color: 'black'}}>Must be ${max} characters or less</Text> : undefined;
const minLength = min => value =>
    value && value.length < min ? <Text style={{color: 'black'}}>Must be ${min} characters or less</Text> : undefined;
const maxLength16 = maxLength(16);
const minLength16 = minLength(16);
const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const minValue = min => value =>
    value && value < min ? `Must be at least ${min}` : undefined;
const minValue18 = minValue(18);
const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
        <Text style={{color: 'black'}}>Invalid email address</Text> : undefined;
const tooOld = value =>
    value && value > 65 ? 'You might be too old for this' : undefined;
const aol = value =>
    value && /.+@aol\.com/.test(value) ?
        'Really? You still use AOL for your email?' : undefined;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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


class Login extends Component<{}> {
    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            showPassword: true,
            showAlert: false,
            message: '',
            loading: false,
        };
    }


    signup() {
        Actions.menupilihan();
    }

    lupapassword() {
        Actions.lupapassword();
    }

    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    loginUser = async (values) => {
        try {
            const response = await this.props.dispatch(loginUser(values));
            // console.log(response);
            if (!response.success) {
                this.state.message = response.error.message;
                this.showAlert();
            }
        } catch (error) {
            let errorText;
            if (error.message) {
                errorText = error.message;
            }
            errorText = error.responseBody;
            console.log(error)
            this.state.message = errorText;
            this.showAlert();
        }
    };

    showAlert = () => {
        this.setState({
            showAlert: true,
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false,
        });
    };

    onSubmit = (values) => {
        this.loginUser(values);
    };

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
    };

    render() {
        const {handleSubmit, loginUser} = this.props;
        console.log(loginUser);
        const {showAlert} = this.state;
        return (
            <View style={styles.container}>
                {(loginUser && loginUser.isLoading) && <Loader/>}
                <Logo/>
                <Field
                    name="email"
                    placeholder="Email"
                    component={this.renderTextInput}/>
                <Field
                    name="password"
                    placeholder="Password"
                    secureTextEntry={this.state.showPassword}
                    component={this.renderTextInput}/>
                <ListItem icon>
                    <Left>
                        <Text>Lihat Password</Text>
                    </Left>
                    <Body>

                    </Body>
                    <Right><Switch
                        onValueChange={this.toggleSwitch}
                        value={!this.state.showPassword}
                    /></Right>
                </ListItem>
                <TouchableOpacity style={styles.button} onPress={handleSubmit(this.onSubmit)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Apakah anda belum mempunyai akun ?</Text>
                    <TouchableOpacity onPress={this.signup}><Text
                        style={styles.signupButton}> Daftar</Text></TouchableOpacity>
                </View>
                <View style={styles.lupaPasswordTextCont}>
                    <Text style={styles.signupText}>Lupa password ?</Text>
                    <TouchableOpacity onPress={this.lupapassword}><Text style={styles.signupButton}> Klik disini</Text></TouchableOpacity>
                </View>
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Login Error"
                    message={this.state.message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="Ya, Keluar"
                    confirmButtonColor="#DD6B55"
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />
            </View>
        );
    }
}

const validate = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Name is required';
    }
    if (!values.email) {
        errors.email = 'Email is required';
    }
    if (!values.password) {
        errors.password = 'Name is required';
    }
    return errors;
};

mapStateToProps = (state) => ({
    loginUser: state.authReducer.loginUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'login',
        validate,
    }),
)(Login);
