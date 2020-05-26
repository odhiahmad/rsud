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
import {showMessage} from 'react-native-flash-message';


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
        marginVertical: 10,
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




class SignupMrDua extends ValidationComponent {

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
            nama: this.props.nama,
            email: '',
            emailValidasi: '',
            password: '',
            passwordKonfirmasi: '',
            angka: '',
            nomorMr: this.props.nomorMr,
            tahunLahir:this.props.tahunLahir,
            success:this.props.success,
            showAlert: false,
            message: '',
            loading: false,
            nilaiTambahA: Math.floor(Math.random() * 10),
            nilaiTambahB: Math.floor(Math.random() * 10),
            statusLogin:false,
        };
    }

    componentDidMount() {

        if(this.state.success === false){
            Actions.signupmr()
        }
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

        this.validate({
            nama: {minlength: 4, maxlength: 20, required: true},
            email: {email: true, required: true},
            emailValidasi: {email: true, required: true},
            password: {minlength: 5, required: true},
            passwordKonfirmasi: {minlength: 5, required: true},
            angka: {minlength: 1, required: true, numbers: true},
        });
        if (this.isFormValid()) {
            this.setState({
                loading: true,
            });
            if (this.state.email === this.state.emailValidasi) {
                if (this.state.password === this.state.passwordKonfirmasi) {
                    if (parseInt(this.state.angka) === this.state.nilaiTambahA + this.state.nilaiTambahB) {
                        this.state.nilaiTambahA =  Math.floor(Math.random() * 10);
                        this.state.nilaiTambahB = Math.floor(Math.random() * 10);
                        console.log(this.state.nomorMr)
                        fetch(baseApi + '/user/create', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                nama: this.state.nama,
                                email: this.state.email,
                                password: this.state.password,
                                nomorMr: this.state.nomorMr,
                                tahunLahir: this.state.tahunLahir,
                            }),

                        }).then((response) => response.json()).then((responseJson) => {


                            if(responseJson.success === true){
                                this.setState({
                                    loading: false,
                                    message :responseJson.message,
                                    statusLogin:true,
                                });
                                showMessage({
                                    message: responseJson.message,
                                    type: 'warning',
                                    position: 'bottom',
                                });
                            }else{
                                this.setState({
                                    loading: false,
                                    message :responseJson.message,
                                    statusLogin:false,
                                });
                                showMessage({
                                    message: responseJson.message,
                                    type: 'danger',
                                    position: 'bottom',
                                });
                            }


                        }).catch((error) => {
                            this.setState({
                                loading: false,
                                statusLogin:false,
                            });
                            showMessage({
                                message: error,
                                type: 'danger',
                                position: 'bottom',
                            });

                        });
                    } else {
                        this.setState({
                            loading: false,
                            statusLogin:false,
                        });
                        showMessage({
                            message: 'Jumlah yang anda masukan tidak sama',
                            type: 'danger',
                            position: 'bottom',
                        });

                    }

                } else {
                    this.setState({
                        loading: false,
                        statusLogin:false,
                    });
                    showMessage({
                        message:'Password konfirmasi tidak sama',
                        type: 'danger',
                        position: 'bottom',
                    });

                }
            } else {
                this.setState({
                    loading: false,
                    statusLogin:false,
                });
                showMessage({
                    message:'Email atau Password konfirmasi tidak sama',
                    type: 'danger',
                    position: 'bottom',
                });
            }

        } else {

            this.setState({
                loading: false,
                statusLogin:false,
            });
            showMessage({
                message:'Isi semua',
                type: 'danger',
                position: 'bottom',
            });
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
                    <Logo/>
                    <TextInput
                        editable={false}
                        defaultValue={this.state.nama}
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
                        keyboardType={'email'}
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
                        keyboardType={'email'}
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
                        keyboardType={'numeric'}
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
                    <Text>

                    </Text>
                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>Sudah mempunyai akun, silahkan?</Text>
                        <TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}> Sign
                            in</Text></TouchableOpacity>

                    </View>

                </ScrollView>
            </View>
        );
    }
}

export default SignupMrDua;
