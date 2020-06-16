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
import {logoutUser} from '../../actions/auth.actions';
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
import {connect} from 'react-redux';

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

class Step3 extends ValidationComponent<{}> {
    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            totalSteps: '',
            currentStep: '',
            penanggungJawab: '',
            noBpjs: '',
            noHpPenanggungJawab:'',
            showAlert: false,
            message: '',
            loading: false,
            nilaiTambahA: Math.floor(Math.random() * 10),
            nilaiTambahB: Math.floor(Math.random() * 10),
            statusLogin: false,
        };
    }

    componentDidMount() {
        if (this.props.getState().penanggungJawab != undefined) {
            this.state.penanggungJawab = this.props.getState().penanggungJawab;
            this.state.noHpPenanggungJawab = this.props.getState().noHpPenanggungJawab;
            this.state.noBpjs = this.props.getState().noBpjs;
        }


    }

    static getDerivedStateFromProps = props => {
        const {getTotalSteps, getCurrentStep} = props;
        return {
            totalSteps: getTotalSteps(),
            currentStep: getCurrentStep(),
        };
    };

    nextStep = () => {
        const {next, saveState} = this.props;
        // Save state for use in other steps


        // Go to next step
        next();
    };

    goBack() {
        const {back} = this.props;
        saveState({
            noHpPenanggungJawab: this.state.noHpPenanggungJawab,
            penanggungJawab: this.state.penanggungJawab,
            noBpjs: this.state.noBpjs,
        });

        back();
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

    showFinish(){
        this.state.message = "Silahkan Login Ulang";
        this.showAlert()


        this.state.loading = false;
    }
    _onSubmit() {


        this.validate({
            noBpjs:{minlength: 13, maxlength: 13,number:true},
            penanggungJawab: {minlength: 3, maxlength: 50, required: true},
            noTelpon: {minlength: 10, maxlength: 13, number: true, required: true},
        });

        if (this.isFormValid()) {

            if(this.state.noBpjs === ''){
                fetch(baseApi + '/user/updateProfil', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        id: this.props.getUser.userDetails.id,
                        jenisKelamin: this.props.getState().jenisKelamin,
                        statusKawin: this.props.getState().statusKawin,
                        tanggalLahir: this.props.getState().tanggalLahir,
                        noTelpon: this.props.getState().noTelpon,
                        tempatLahir: this.props.getState().tempatLahir,
                        nama: this.props.getState().nama,
                        pekerjaan: this.props.getState().pekerjaan,
                        nik: this.props.getState().nik,
                        pilihProvinsi: this.props.getState().pilihProvinsi,
                        pilihKota: this.props.getState().pilihKota,
                        pilihKecamatan: this.props.getState().pilihKecamatan,
                        pilihDesa: this.props.getState().pilihDesa,
                        pilihSuku: this.props.getState().pilihSuku,
                        pilihBahasa: this.props.getState().pilihBahasa,
                        pilihWn: this.props.getState().pilihWn,
                        pilihNegara: this.props.getState().pilihNegara,
                        alamat: this.props.getState().alamat,
                        penanggungJawab: this.state.penanggungJawab,
                        noHpPenanggungJawab:this.state.noHpPenanggungJawab,
                        noBpjs: this.state.noBpjs,
                        agama:this.props.getState().pilihAgama,
                    }),
                }).then((response) => response.json()).then((responseJson) => {
                    console.log(this.props.getState())
                    if (responseJson.success === true) {
                        this.props.dispatch(logoutUser(this.props.getUser.userDetails.id));
                        this.showFinish()

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

            }else{
                this.state.loading = true;
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
                        'param': 'nokartu',
                        'data': this.state.noBpjs,
                    }),
                }).then((response) => response.json()).then((responseJson) => {

                    if(responseJson.response != null){
                        if (parseInt(responseJson.response.peserta.statusPeserta.kode) === 0) {
                            fetch(baseApi + '/user/updateProfil', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                                },
                                body: JSON.stringify({
                                    id: this.props.getUser.userDetails.id,
                                    jenisKelamin: this.props.getState().jenisKelamin,
                                    statusKawin: this.props.getState().statusKawin,
                                    tanggalLahir: this.props.getState().tanggalLahir,
                                    noTelpon: this.props.getState().noTelpon,
                                    tempatLahir: this.props.getState().tempatLahir,
                                    nama: this.props.getState().nama,
                                    pekerjaan: this.props.getState().pekerjaan,
                                    nik: this.props.getState().nik,
                                    pilihProvinsi: this.props.getState().pilihProvinsi,
                                    pilihKota: this.props.getState().pilihKota,
                                    pilihKecamatan: this.props.getState().pilihKecamatan,
                                    pilihDesa: this.props.getState().pilihDesa,
                                    pilihSuku: this.props.getState().pilihSuku,
                                    pilihBahasa: this.props.getState().pilihBahasa,
                                    pilihWn: this.props.getState().pilihWn,
                                    pilihNegara: this.props.getState().pilihNegara,
                                    alamat: this.props.getState().alamat,
                                    penanggungJawab: this.state.penanggungJawab,
                                    noHpPenanggungJawab:this.state.noHpPenanggungJawab,
                                    noBpjs: this.state.noBpjs,
                                    agama:this.props.getState().pilihAgama,
                                }),
                            }).then((response) => response.json()).then((responseJson) => {
                                console.log(this.props.getState())
                                if (responseJson.success === true) {
                                    this.props.dispatch(logoutUser(this.props.getUser.userDetails.id));
                                    this.showFinish()

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
            }


        }

    }

    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    render() {
        const {currentStep, totalSteps} = this.state;
        const {showAlert} = this.state;
        const {onChange} = this.props;
        console.log(this.props.getUser.userDetails.token);

        return (
            <View style={styles.container}>

                {/*{this.state.loading === true ? <View><Loader/></View> : ''}*/}

                <LoaderModal
                    loading={this.state.loading}/>
                <Grid>
                    <Col style={{height: 25}}></Col>
                    <Col style={{width: 110, height: 25}}>
                        <Text
                            style={styles.currentStepText}
                        >{`Langkah ${currentStep} dari ${totalSteps}`}</Text></Col>
                    <Col style={{height: 25}}></Col>
                </Grid>
                {this.props.getState().penanggungJawab != undefined ?
                <TextInput
                    defaultValue={this.props.getState().penanggungJawab}
                    ref="penanggungJawab"
                    onChangeText={(penanggungJawab) => this.setState({penanggungJawab})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Penanggung Jawab"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />: <TextInput
                        ref="penanggungJawab"
                        onChangeText={(penanggungJawab) => this.setState({penanggungJawab})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Penanggung Jawab"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />}
                {this.isFieldInError('penanggungJawab') && this.getErrorsInField('penanggungJawab').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
                {this.props.getState().noHpPenanggungJawab != undefined ?
                    <TextInput
                        keyboardType={'numeric'}
                        defaultValue={this.props.getState().noHpPenanggungJawab}
                        ref="noHpPenanggungJawab"
                        onChangeText={(noHpPenanggungJawab) => this.setState({noHpPenanggungJawab})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Nomor Telfon / No Hp PJ"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    /> :
                    <TextInput
                        keyboardType={'numeric'}
                        ref="noHpPenanggungJawab"
                        onChangeText={(noHpPenanggungJawab) => this.setState({noHpPenanggungJawab})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Nomor Telfon / No Hp PJ"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />}
                {this.isFieldInError('noHpPenanggungJawab') && this.getErrorsInField('noHpPenanggungJawab').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
                {this.props.getState().noBpjs != undefined ?
                    <TextInput
                        keyboardType={'numeric'}
                        defaultValue={this.props.getState().noBpjs}
                    ref="noBpjs"
                    onChangeText={(noBpjs) => this.setState({noBpjs})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Nomor BPJS"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />: <TextInput
                        keyboardType={'numeric'}
                        ref="noBpjs"
                        onChangeText={(noBpjs) => this.setState({noBpjs})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Nomor BPJS"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />}
                {this.isFieldInError('noBpjs') && this.getErrorsInField('noBpjs').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}

                <Grid style={{marginTop: 20}}>
                    <Col style={{height: 80}}></Col>
                    <Col style={{width: 150, height: 80}}>
                        <Button style={{marginRight: 5}} rounded onPress={this.props.back} success>
                            <Icon type="FontAwesome" name='arrow-left'/>
                            <Text style={{color: '#ffffff'}}>Sebelumnya</Text>
                        </Button></Col>
                    <Col style={{width: 150, height: 80}}>
                        <Button style={{marginLeft: 5, paddingLeft: 35}} rounded success
                                onPress={this._onSubmit.bind(this)}>
                            <Text style={{color: '#ffffff'}}>Submit</Text>
                            <Icon type="FontAwesome" name='check'/>
                        </Button></Col>
                    <Col style={{height: 80}}></Col>
                </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Step3);
