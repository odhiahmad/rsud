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
import {baseApi, baseApiBpjs} from '../../service/api';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import email from 'react-native-email';
import PasswordInputText from 'react-native-hide-show-password-input';
import DatePicker from 'react-native-datepicker';
import RNPicker from 'rn-modal-picker';
import {
    Col, Row, Grid,
    Item,
    H2,
    Spinner,
    Root,
    Container,
    Picker,
    Header,
    Title,
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
import {getDataBPJS} from '../../actions/auth.actions';
import {connect} from 'react-redux';

const styles = StyleSheet.create({
    itemSeparatorStyle: {
        height: 1,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#D3D3D3',
    },
    searchBarContainerStyle: {
        marginBottom: 10,
        flexDirection: 'row',
        height: 40,
        shadowOpacity: 1.0,
        shadowRadius: 5,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        backgroundColor: 'rgba(255,255,255,1)',
        shadowColor: '#d3d3d3',
        borderRadius: 10,
        elevation: 3,
        marginLeft: 10,
        marginRight: 10,
    },

    selectLabelTextStyle: {
        color: '#000',
        textAlign: 'left',
        width: '99%',
        padding: 10,
        flexDirection: 'row',
    },
    placeHolderTextStyle: {
        color: '#D3D3D3',
        padding: 10,
        textAlign: 'left',
        width: '99%',
        flexDirection: 'row',
    },
    dropDownImageStyle: {
        marginLeft: 10,
        width: 10,
        height: 10,
        alignSelf: 'center',
    },
    listTextViewStyle: {
        color: '#000',
        marginVertical: 10,
        flex: 0.9,
        marginLeft: 20,
        marginHorizontal: 10,
        textAlign: 'left',
    },
    pickerStyle: {
        width: 300,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 5,
    },
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
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

class LengkapiPendaftaranHalamanDepan extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            date: '',
            pekerjaan: '',
            nik: '',
            placeHolderText: 'Please Select Country',
            selectedText: '',
            jenis: '',
            cekBpjs: '',
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

    _onSubmit() {


        this.validate({
            cekBpjs: {minlength: 13, maxlength: 16, numbers: true, required: true},
        });
        if (this.isFormValid()) {
            this.state.loading = true;
            const url1 = baseApi + '/user/cekNomorKtpBpjs';
            fetch(url1, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nomor: this.state.cekBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson.jenis);
                if (responseJson.status === true) {
                    const url = baseApiBpjs + 'peserta_bpjs';
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'username': '00004',
                            'password': '551UU1BJ',
                            'param': responseJson.jenis,
                            'data': this.state.cekBpjs,
                        }),
                    }).then((response) => response.json()).then((responseJson) => {

                        if(responseJson.response != null){
                            if (parseInt(responseJson.response.peserta.statusPeserta.kode) === 0) {
                                console.log(this.props.getUser.userDetails.token)
                                fetch(baseApi + '/user/tambahDataProfil', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        id:this.props.getUser.userDetails.id,
                                        tanggalLahir: responseJson.response.peserta.tglLahir,
                                        nama: responseJson.response.peserta.nama,
                                        jenisKelamin: responseJson.response.peserta.sex,
                                        noKartu: responseJson.response.peserta.noKartu,
                                        nik: responseJson.response.peserta.nik,
                                        noTelpon: responseJson.response.peserta.mr.noTelpon,
                                    }),
                                }).then((response) => response.json()).then((responseJson) => {
                                    console.log(responseJson.success)
                                    if(responseJson.success === true){
                                        this.state.loading = false;
                                        Actions.LengkapiPendaftaran()
                                    }else{
                                        this.state.loading = false;
                                        this.state.message = responseJson.message;
                                        this.showAlert();
                                    }
                                })

                            } else {
                                this.state.loading = false;
                                this.state.message = 'BPJS Anda Tidak Aktif';
                                this.showAlert();
                            }

                        }else{
                            this.state.loading = false;
                            this.state.message = 'Nomor Yang anda masukan tidak terdaftar';
                            this.showAlert();
                        }


                    }).catch((error) => {
                        console.log(error);
                        this.state.loading = false;
                    });

                } else {
                    this.state.loading = false;
                    this.state.message = responseJson.message;
                    this.showAlert();
                }

            }).catch((error) => {
                this.state.loading = false;
                console.log(error);
            });

        }


    }

    goLengkapi() {
        Actions.LengkapiPendaftaran({
            tanggalLahir: null,
            nama: null,
            jenisKelamin: null,
            noKartu: null,
            nik:null,
            noTelpon: null,
        });
    }

    render() {

        const {showAlert} = this.state;
        const loader = <Loader/>;

        return (

            <View style={styles.container}>
                {/*<LoaderModal*/}
                {/*    loading={this.state.loading}/>*/}
                {/*{this.state.loading === true ? <View><Loader/></View> : ''}*/}
                <LoaderModal
                    loading={this.state.loading}/>
                <TextInput
                    ref="cekBpjs"
                    onChangeText={(cekBpjs) => this.setState({cekBpjs})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Cek Nomor BPJS, Masukan NIK atau No BPJS"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />
                {this.isFieldInError('cekBpjs') && this.getErrorsInField('cekBpjs').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}

                <Grid style={{marginBottom: 20}}>
                    <Col style={{height: 50}}></Col>
                    <Col style={{width: 140, height: 50}}>
                        <Button onPress={this._onSubmit.bind(this)} rounded
                                style={{marginLeft: 5, paddingRight: 20, backgroundColor: '#50574f'}}>
                            <Icon name="ios-search"/>
                            <Text style={{color: '#ffffff'}}>Cek BPJS</Text>
                        </Button></Col>
                    <Col style={{height: 50}}></Col>
                </Grid>

                <Text style={styles.signupText}>Bukan pasien BPJS?</Text>
                <TouchableOpacity onPress={this.goLengkapi}><Text style={styles.signupButton}> Lengkapi Pendaftaran Disini</Text></TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(LengkapiPendaftaranHalamanDepan);
