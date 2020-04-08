import React, {Component} from 'react';
import {
    NetInfo,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput, ScrollView, ActivityIndicator,
} from 'react-native';
import LoaderModal from '../../components/LoaderModal';
import Logo from '../../components/Logo';
import Form from '../../components/Form';
import InputText from '../../components/InputText';
import ValidationComponent from 'react-native-form-validator';
import Loader from '../../components/Loader';
import {baseApi, baseApiBpjs} from '../../service/api';
import {Actions} from 'react-native-router-flux';

import AwesomeAlert from 'react-native-awesome-alerts';
import email from 'react-native-email';
import PasswordInputText from 'react-native-hide-show-password-input';
import {
    Col, Row, Grid,
    Item,
    H2,
    Spinner,
    Root,
    Container,
    Header,
    Content,
    Button,
    ListItem,
    Icon,
    Left,
    Body,
    Right,
    Switch,
    ActionSheet,
    Card, CardItem, DatePicker, Picker, Textarea,
} from 'native-base';
import {connect} from 'react-redux';
import Select2 from 'react-native-select-two';
import {logoutUser} from '../../actions/auth.actions';

const styles = StyleSheet.create({
    container: {

        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupTextCont: {
        justifyContent: 'center',
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
    inputBox: {
        width: 345,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
    button: {
        width: 345,
        backgroundColor: '#1c313a',
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
    errorText: {
        color: '#ffffff',
        fontSize: 14,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
});

class EditProfil extends ValidationComponent {

    constructor(props) {

        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            showPassword: true,
            loading: false,
            dataProvinsi: [],
            pilihProvinsi: '',
            passwordLama: '',
            passwordBaru: '',
            konfirmasiPasswordBaru: '',
        };
    }
    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    showAlert = () => {
        this.setState({
            showAlert: true,
        });
    };

    hideAlert = () => {
        if (this.state.statusLogin === true) {
            Actions.login();
            this.setState({
                showAlert: false,
            });
        } else {
            this.setState({
                showAlert: false,
            });
        }
    };

    _onSubmit() {
        this.state.loading = true;
        this.validate({
            passwordLama: {required: true,minLength:6},
            passwordBaru: {required: true,minLength:6},
            konfirmasiPasswordBaru: {required: true,minLength:6},
        });
        if (this.isFormValid()) {
            if(this.state.passwordBaru === this.state.konfirmasiPasswordBaru){

                fetch(baseApi + '/user/updatePassword', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        id: this.props.getUser.userDetails.id,
                        passwordLama: this.state.passwordLama,
                        passwordBaru: this.state.passwordBaru,
                    }),
                }).then((response) => response.json()).then((responseJson) => {
                    if (responseJson.success === true) {
                        this.state.loading = false;
                        this.state.message = responseJson.message;
                        this.showAlert();
                    } else {
                        this.state.loading = false;
                        this.state.message = responseJson.message;
                        this.showAlert();
                    }
                }).catch((error) => {
                    this.state.loading = false;
                    console.log(error);
                    this.state.message = error;
                    this.showAlert();
                });

            }else {
                this.state.loading = false;
                this.state.message = 'Password baru yang anda masukan tidak sama';
                this.showAlert();
            }


        }


    }


    render() {
        const {showAlert} = this.state;
        const {onChange} = this.props;

        return (
            <View style={styles.container}>
                {/*{this.state.loading === true ? <View><Loader/></View> : ''}*/}
                <ScrollView style={{marginVertical: 15, backgroundColor: 'white'}}>
                    <LoaderModal
                        loading={this.state.loading}/>

                    <TextInput
                        defaultValue={this.state.passwordLama}
                        ref="passwordLama"
                        onChangeText={(passwordLama) => this.setState({passwordLama})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Password Lama"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                        secureTextEntry={this.state.showPassword}
                    />
                    {this.isFieldInError('passwordLama') && this.getErrorsInField('passwordLama').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        defaultValue={this.state.passwordBaru}
                        ref="passwordBaru"
                        onChangeText={(passwordBaru) => this.setState({passwordBaru})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Password Baru"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                        secureTextEntry={this.state.showPassword}
                    />
                    {this.isFieldInError('passwordBaru') && this.getErrorsInField('passwordBaru').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}

                    <TextInput
                        defaultValue={this.state.konfirmasiPasswordBaru}
                        ref="konfirmasiPasswordBaru"
                        onChangeText={(konfirmasiPasswordBaru) => this.setState({konfirmasiPasswordBaru})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Konfirmasi Password Baru"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                        secureTextEntry={this.state.showPassword}
                    />
                    {this.isFieldInError('konfirmasiPasswordBaru') && this.getErrorsInField('konfirmasiPasswordBaru').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}

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
                    <TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                        <Text style={styles.buttonText}>Update Password</Text>
                    </TouchableOpacity>
                    <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        title="Notifikasi"
                        message={this.state.message}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        confirmText=" Keluar "
                        confirmButtonColor="#DD6B55"
                        onConfirmPressed={() => {
                            this.hideAlert();
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}

mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfil);
