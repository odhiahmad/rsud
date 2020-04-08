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
import {showMessage, hideMessage} from 'react-native-flash-message';

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
        marginVertical: 2,
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

class InputBaru extends ValidationComponent {

    constructor(props) {

        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            simpanFavorite: false,
            loading: false,
            id_pasien:'',
            nomorMr: '',
            status: 'before',
            nama: '',

        };
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

    showKotaNama = () => {

    };

    _onSubmitNama() {
        if(this.state.simpanFavorite === false){
            Actions.daftaronlinesendiri({
                nomorMr:this.state.nomorMr,
            })
        }else if(this.state.simpanFavorite === true){
            fetch(baseApi + '/user/simpanNomr', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                },
                body: JSON.stringify({
                    id:this.props.getUser.userDetails.id,
                    nomorMr: this.state.nomorMr,
                    nama:this.state.nama,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.success === true) {
                    console.log(responseJson.data)
                    Actions.daftaronlinesendiri({
                        nomorMr:this.state.nomorMr,
                    })
                    this.state.loading = false;
                    showMessage({
                        message: responseJson.message,
                        type: 'info',
                        position: 'bottom',
                    });
                } else {

                    this.state.loading = false;
                    showMessage({
                        message: responseJson.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            }).catch((error) => {
                this.state.loading = false;
                console.log(error);
                this.state.message = error;
            });
        }


    }

    _onSubmit() {
        fetch(baseApi + '/user/cariNomorMr', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                nomorMr: this.state.nomorMr,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {

                this.setState({
                    status: 'after',
                    nomorMr: responseJson.data.nomr,
                    nama: responseJson.data.nama,
                });
                this.state.loading = false;
                console.log(this.state.status);
                this.state.message = responseJson.data;
                showMessage({
                    message: responseJson.message,
                    type: 'info',
                    position: 'bottom',
                });
            } else {
                console.log(responseJson.message);
                this.state.loading = false;
                this.state.message = responseJson.message;
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'bottom',
                });
            }
        }).catch((error) => {
            this.state.loading = false;
            console.log(error);
            this.state.message = error;
        });

    }

    toggleSwitch() {
        this.setState({simpanFavorite: !this.state.simpanFavorite});
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

                    {this.state.status === 'after' ?
                        <View style={{padding:5}}>
                            <View style={{marginBottom: 10,padding:5}}>
                                <Text style={styles.signupButton}>Nomor Mr </Text>
                                <Text style={styles.signupText}>{this.state.nomorMr}</Text>
                            </View>
                            <View style={{marginBottom: 10,padding:5}}>
                                <Text style={styles.signupButton}>Nama</Text>
                                <Text style={styles.signupText}>{this.state.nama}</Text>
                            </View>
                            <ListItem style={{padding:5}} icon>
                                <Left>
                                    <Text>Ingin menyimpan sebagai favorit?</Text>
                                </Left>
                                <Body>
                                    <Switch
                                        onValueChange={this.toggleSwitch}
                                        value={this.state.simpanFavorite}
                                    />
                                </Body>
                            </ListItem>
                            <TouchableOpacity style={styles.button} onPress={this._onSubmitNama.bind(this)}>
                                <Text style={styles.buttonText}>Lanjutkan</Text>
                            </TouchableOpacity>
                        </View> : this.state.status === 'before' ?
                            <View><TextInput
                                defaultValue={this.state.nomorMr}
                                ref="nomorMr"
                                onChangeText={(nomorMr) => this.setState({nomorMr})}
                                style={styles.inputBox}
                                underlineColorAndroid="rgba(0,0,0,0)"
                                placeholder="Cari Nomor MR"
                                placeholderTextColor="rgba(255,255,255,0.8)"
                                selectionColor="#999999"
                            /><TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity></View> : <View></View>
                    }

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

export default connect(mapStateToProps, mapDispatchToProps)(InputBaru);
