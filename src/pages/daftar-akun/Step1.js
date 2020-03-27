import React, {Component} from 'react';
import {
    NetInfo,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput, ScrollView,
} from 'react-native';
import LoaderModal from '../../components/LoaderModal';
import Logo from '../../components/Logo';
import Form from '../../components/Form';
import InputText from '../../components/InputText';
import ValidationComponent from 'react-native-form-validator';
import Loader from '../../components/Loader';
import {baseApi} from '../../service/api';
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
    Card, CardItem,
} from 'native-base';

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
        width: 300,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 5,
    },
    button: {
        width: 300,
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

class Step1 extends ValidationComponent {

    goBack() {
        Actions.login();
    }

    lupapassword() {
        Actions.lupapassword();
    }

    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            showPassword: true,
            nama: '',
            email: '',
            emailValidasi: '',
            password: '',
            passwordKonfirmasi: '',
            angka: '',
            showAlert: false,
            message: '',
            loading: false,
            nilaiTambahA: Math.floor(Math.random() * 10),
            nilaiTambahB: Math.floor(Math.random() * 10),
            statusLogin:false,
        };
    }

    componentDidMount() {


    }

    showAlert = () => {
        this.setState({
            showAlert: true,
        });
    };

    hideAlert = () => {
        if(this.state.statusLogin === true){
            Actions.login()
            this.setState({
                showAlert: false,
            });
        }else{
            this.setState({
                showAlert: false,
            });
        }
    };

    _onSubmit() {

        this.state.loading = true;
        this.validate({
            nama: {minlength: 4, maxlength: 20, required: true},
            email: {email: true, required: true},
            emailValidasi: {email: true, required: true},
            password: {minlength: 5, required: true},
            passwordKonfirmasi: {minlength: 5, required: true},
            angka: {minlength: 1, required: true, numbers: true},
        });
        if (this.isFormValid()) {
            if (this.state.email === this.state.emailValidasi) {
                if (this.state.password === this.state.passwordKonfirmasi) {
                    if (parseInt(this.state.angka) === this.state.nilaiTambahA + this.state.nilaiTambahB) {
                        this.state.nilaiTambahA =  Math.floor(Math.random() * 10);
                        this.state.nilaiTambahB = Math.floor(Math.random() * 10);

                        fetch(baseApi + '/user/create', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                nomorMr:0,
                                nama: this.state.nama,
                                email: this.state.email,
                                password: this.state.password,
                            }),

                        }).then((response) => response.json()).then((responseJson) => {

                            if(responseJson.success === true){
                                this.state.statusLogin = true
                                this.state.message = responseJson.message;
                                this.state.loading = false;
                                this.showAlert();
                            }else{
                                this.state.statusLogin = false
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
                    } else {
                        this.state.loading = false;
                        this.state.message = 'Jumlah yang anda masukan tidak sama';
                        this.showAlert();
                    }

                } else {
                    this.state.loading = false;
                    this.state.message = 'Password konfirmasi tidak sama';
                    this.showAlert();
                }
            } else {
                this.state.loading = false;
                this.state.message = 'Email atau Password konfirmasi tidak sama';
                this.showAlert();
            }

        } else {
            this.state.loading = false;
            this.state.message = 'Isi semua';
            this.showAlert();

        }

    }

    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    render() {
        const {showAlert} = this.state;
        const {onChange} = this.props;
        const loader = <Loader/>;

        return (
            <View style={styles.container}>
                <LoaderModal
                    loading={this.state.loading}/>
                {/*{this.state.loading === true ? <View><Loader/></View> : ''}*/}
                <ScrollView style={{marginVertical: 15, backgroundColor: 'white'}}>
                    <TextInput
                        ref="nama"
                        onChangeText={(nama) => this.setState({nama})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Nama"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('nama') && this.getErrorsInField('nama').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        ref="email"
                        onChangeText={(email) => this.setState({email})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Email"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        ref="emailValidasi"
                        onChangeText={(emailValidasi) => this.setState({emailValidasi})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Ulangi Email"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('emailValidasi') && this.getErrorsInField('emailValidasi').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        ref="password"
                        onChangeText={(password) => this.setState({password})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Password"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                        secureTextEntry={this.state.showPassword}
                    />
                    {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}

                    <TextInput
                        ref="passwordKonfirmasi"
                        onChangeText={(passwordKonfirmasi) => this.setState({passwordKonfirmasi})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Password Konfirmasi"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                        secureTextEntry={this.state.showPassword}
                    />
                    {this.isFieldInError('passwordKonfirmasi') && this.getErrorsInField('passwordKonfirmasi').map(errorMessage =>
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
                    <TextInput
                        editable={false}
                        defaultValue={"Hasil dari "+this.state.nilaiTambahA +" + " + this.state.nilaiTambahB}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    <TextInput
                        ref="angka"
                        onChangeText={(angka) => this.setState({angka})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Masukan Jumlah diatas"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('angka') && this.getErrorsInField('angka').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                        <Text style={styles.buttonText}>Buat Akun</Text>
                    </TouchableOpacity>
                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>Sudah mempunyai akun, silahkan?</Text>
                        <TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}> Sign
                            in</Text></TouchableOpacity>

                    </View>

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

export default Step1;
