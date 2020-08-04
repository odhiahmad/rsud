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
import {showMessage} from 'react-native-flash-message';
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
import {connect} from 'react-redux';
import Select2 from 'react-native-select-two';
import DatePicker from 'react-native-datepicker';
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
type Props = {}

class Step1 extends ValidationComponent <{}> {

    constructor(props) {

        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);

        this.state = {
            showError: 0,


            tempatLahir: '',
            tanggalLahir: new Date('1980-03-25'),
            nama: '',
            jenisKelamin: '',
            dataAgama: [],
            dataPekerjaan: [],
            pilihAgama: '',
            pilihPekerjaan: '',
            noKartu: '',
            noTelpon: '',
            selected: undefined,
            date: '',
            totalSteps: '',
            currentStep: '',
            pekerjaan: '',
            nik: '',
            noBpjs: '',
            statusKawin: '',
            selectedText: '',
            loading: false,
            chosenDate: new Date(),


        };
        this.setDate = this.setDate.bind(this);
    }


    componentDidMount() {
        this.showData();
        if (this.props.getState().nik != undefined) {
            this.state.pilihAgama = this.props.getState().pilihAgama;
            this.state.jenisKelamin = this.props.getState().jenisKelamin;
            this.state.statusKawin = this.props.getState().statusKawin;
            this.state.chosenDate = this.props.getState().tanggalLahir;
            this.state.tempatLahir = this.props.getState().tempatLahir;
            this.state.nama = this.props.getState().nama;
            this.state.pilihPekerjaan = this.props.getState().pilihPekerjaan;
            this.state.nik = this.props.getState().nik;
        }
        ;
    }

    setDate(newDate) {
        this.setState({chosenDate: newDate});
    }


    onValueChange1(value: string) {
        this.setState({
            statusKawin: value,
        });
    }

    onValueChange2(value: string) {
        this.setState({
            jenisKelamin: value,
        });
    }

    _selectedValue(index, item) {
        this.setState({selectedText: item.name});
    }

    static getDerivedStateFromProps = props => {
        const {getTotalSteps, getCurrentStep, saveState} = props;
        return {
            totalSteps: getTotalSteps(),
            currentStep: getCurrentStep(),

        };
    };

    nextStep = () => {
        const {next, saveState} = this.props;
        // Save state for use in other steps
        saveState({name: 'samad'});

        // Go to next step
        next();
    };

    goBack() {
        const {back} = this.props;
        // Go to previous step
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

    _onSubmit() {
        this.validate({
            noBpjs: {minlength: 13, maxlength: 13, number: true},
            pilihAgama: {required: true},
            jenisKelamin: {required: true},
            statusKawin: {required: true},
            chosenDate: {required: true},
            tempatLahir: {minlength: 4, maxlength: 50, required: true},
            pilihPekerjaan: {required: true},
            nik: {minlength: 16, maxlength: 16, required: true},

        });
        if (this.isFormValid()) {
            this.setState({
                loading: true,
            });
            if (this.state.noBpjs === '') {
                fetch(baseApi + '/user/cekKtp', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nik: this.state.nik,
                    }),

                }).then((response) => response.json()).then((responseJson) => {

                    if (responseJson.success === true) {
                        const {saveState} = this.props;
                        // Save state for use in other steps
                        saveState({
                            jenisKelamin: this.state.jenisKelamin,
                            statusKawin: this.state.statusKawin,
                            tanggalLahir: this.state.chosenDate,
                            tempatLahir: this.state.tempatLahir,
                            nama: this.state.nama,
                            pilihPekerjaan: this.state.pilihPekerjaan,
                            nik: this.state.nik,
                            pilihAgama: this.state.pilihAgama,
                            noBpjs: this.state.noBpjs,
                        });
                        this.setState({
                            loading: false,
                        });
                        this.nextStep();


                    } else {
                        this.setState({
                            loading: false,
                        });
                        showMessage({
                            message: 'Koneksi Bermasalah',
                            type: 'danger',
                            position: 'bottom',
                        });
                    }


                }).catch((error) => {
                    this.setState({
                        loading: false,
                    });
                    showMessage({
                        message: 'Koneksi Bermasalah',
                        type: 'danger',
                        position: 'bottom',
                    });

                });
            } else {
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
                        'data': this.props.getState().noBpjs,
                    }),
                }).then((response) => response.json()).then((responseJson) => {

                    if (responseJson.response != null) {
                        if (parseInt(responseJson.response.peserta.statusPeserta.kode) === 0) {
                            if (responseJson.response.peserta.nik === this.state.nik) {
                                if (responseJson.success === true) {
                                    const {saveState} = this.props;
                                    // Save state for use in other steps
                                    saveState({
                                        jenisKelamin: this.state.jenisKelamin,
                                        statusKawin: this.state.statusKawin,
                                        tanggalLahir: this.state.chosenDate,
                                        tempatLahir: this.state.tempatLahir,
                                        nama: this.state.nama,
                                        pilihPekerjaan: this.state.pilihPekerjaan,
                                        nik: this.state.nik,
                                        pilihAgama: this.state.pilihAgama,
                                        noBpjs: this.state.noBpjs,
                                    });
                                    this.setState({
                                        loading: false,
                                    });
                                    this.nextStep();


                                } else {
                                    this.setState({
                                        loading: false,
                                    });
                                    showMessage({
                                        message: 'Koneksi Bermasalah',
                                        type: 'danger',
                                        position: 'bottom',
                                    });
                                }
                            } else {
                                this.setState({
                                    loading: false,
                                });
                                showMessage({
                                    message: 'Ktp anda di bpjs tidak sesuai dengan yang anda masukan',
                                    type: 'danger',
                                    position: 'bottom',
                                });
                            }


                        } else {
                            this.setState({
                                loading: false,
                            });
                            showMessage({
                                message: 'BPJS Anda Tidak Aktif',
                                type: 'danger',
                                position: 'bottom',
                            });
                        }
                    } else {
                        this.setState({
                            loading: false,
                        });
                        showMessage({
                            message: 'Nomor Yang anda masukan tidak terdaftar',
                            type: 'danger',
                            position: 'bottom',
                        });
                    }
                }).catch((error) => {
                    this.setState({
                        loading: false,
                    });
                    showMessage({
                        message: error,
                        type: 'danger',
                        position: 'bottom',
                    });
                });
            }


        }

    }

    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    showData() {
        this.setState({
            loading: true,
            showError: 0,
        });
        const url = baseApi + '/user/step1';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson.data);
            var a = responseJson.dataAgama;
            var b = responseJson.dataPekerjaan;
            for (let i = 0; i < a.length; i++) {
                this.state.dataAgama.push({
                    id: i,
                    name: a[i].agama,
                });
            }

            for (let i = 0; i < b.length; i++) {
                this.state.dataPekerjaan.push({
                    id: i,
                    name: b[i].pekerjaan_nama,
                });
            }
            this.setState({
                loading: false,
                showError: 1,
            });

        }).catch((error) => {
            this.setState({
                showError: 2,
                loading: false,
            });
        });
    }

    render() {
        const {currentStep, totalSteps} = this.state;
        const {showAlert} = this.state;
        const {onChange} = this.props;
        var listView = [];
        var listViewPekerjaan = [];


        listView.push(
            <View>
                {this.props.getState().pilihAgama != undefined ?
                    <Select2
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        selectedTitleStyle={{color: 'white'}}
                        searchPlaceHolderText="Cari Agama"
                        popupTitle="Pilih Agama"
                        title={this.props.getState().pilihAgama}
                        data={this.state.dataAgama}
                        onSelect={data => {
                            this.setState({
                                pilihAgama: this.state.dataAgama[data].name,
                            });

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihAgama: ''});
                        }}
                    /> :
                    <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Agama"
                        popupTitle="Pilih Agama"
                        title="Pilih Agama"
                        data={this.state.dataAgama}
                        onSelect={data => {
                            this.setState({
                                pilihAgama: this.state.dataAgama[data].name,
                            });


                        }}
                        onRemoveItem={data => {
                            this.setState({pilihAgama: ''});
                        }}
                    />}

                {this.isFieldInError('pilihAgama') && this.getErrorsInField('pilihAgama').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );


        listViewPekerjaan.push(
            <View>
                {this.props.getState().pilihPekerjaan != undefined ?
                    <Select2
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        selectedTitleStyle={{color: 'white'}}
                        searchPlaceHolderText="Cari Pekerjaan"
                        popupTitle="Pilih Pekerjaan"
                        title={this.props.getState().pilihPekerjaan}
                        data={this.state.dataPekerjaan}
                        onSelect={data => {
                            this.setState({
                                pilihPekerjaan: this.state.dataPekerjaan[data].name,
                            });

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihPekerjaan: ''});
                        }}
                    /> :
                    <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Pekerjaan"
                        popupTitle="Pilih Pekerjaan"
                        title="Pilih Pekerjaan"
                        data={this.state.dataPekerjaan}
                        onSelect={data => {
                            this.setState({
                                pilihPekerjaan: this.state.dataPekerjaan[data].name,
                            });


                        }}
                        onRemoveItem={data => {
                            this.setState({pilihPekerjaan: ''});
                        }}
                    />}

                {this.isFieldInError('pilihPekerjaan') && this.getErrorsInField('pilihPekerjaan').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );


        return (

            <Container>
                <View style={styles.container}>
                    <LoaderModal
                        loading={this.state.loading}/>
                    {this.state.showError === 2 ? <View style={styles.container}>
                        <Text style={{color: 'gray'}}>Koneksi Bermasalah :(</Text>
                        <TouchableOpacity style={styles.button}
                                          onPress={() => this.showData()}>
                            <Text style={styles.buttonText}>Refresh</Text>
                        </TouchableOpacity></View> : this.state.showError === 0 ?
                        <View></View> : this.state.showError === 1 ?
                            <ScrollView style={{marginVertical: 0, backgroundColor: 'white'}}>
                                <Grid style={{marginTop: 10}}>
                                    <Col style={{height: 25}}></Col>
                                    <Col style={{width: 110, height: 25}}>
                                        <Text
                                            style={styles.currentStepText}
                                        >{`Langkah ${currentStep} dari ${totalSteps}`}</Text></Col>
                                    <Col style={{height: 25}}></Col>
                                </Grid>
                                {this.props.getState().nik != undefined ? <TextInput
                                    keyboardType={'numeric'}
                                    defaultValue={this.props.getState().nik}
                                    ref="nik"
                                    onChangeText={(nik) => this.setState({nik})}
                                    style={styles.inputBox}
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    placeholder="NIK KTP"
                                    placeholderTextColor="rgba(255,255,255,0.8)"
                                    selectionColor="#999999"
                                /> : <TextInput
                                    keyboardType={'numeric'}
                                    ref="nik"
                                    onChangeText={(nik) => this.setState({nik})}
                                    style={styles.inputBox}
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    placeholder="NIK KTP"
                                    placeholderTextColor="rgba(255,255,255,0.8)"
                                    selectionColor="#999999"
                                />}

                                {this.isFieldInError('nik') && this.getErrorsInField('nik').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}
                                {this.props.getState().tempatLahir != undefined ?
                                    <TextInput
                                        defaultValue={this.props.getState().tempatLahir}
                                        ref="tempatLahir"
                                        onChangeText={(tempatLahir) => this.setState({tempatLahir})}
                                        style={styles.inputBox}
                                        underlineColorAndroid="rgba(0,0,0,0)"
                                        placeholder="Tempat Lahir"
                                        placeholderTextColor="rgba(255,255,255,0.8)"
                                        selectionColor="#999999"
                                    />
                                    :
                                    <TextInput
                                        ref="tempatLahir"
                                        onChangeText={(tempatLahir) => this.setState({tempatLahir})}
                                        style={styles.inputBox}
                                        underlineColorAndroid="rgba(0,0,0,0)"
                                        placeholder="Tempat Lahir"
                                        placeholderTextColor="rgba(255,255,255,0.8)"
                                        selectionColor="#999999"
                                    />}
                                {this.isFieldInError('tempatLahir') && this.getErrorsInField('tempatLahir').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}
                                {this.props.getState().tanggalLahir != undefined ?
                                    <DatePicker
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                fontcolor: 'white',
                                                borderWidth: 0,
                                            },
                                            // ... You can check the source to find the other keys.
                                        }}
                                        style={styles.inputBox}
                                        placeholder="Ubah tanggal Lahir"
                                        date={this.props.getState().tanggalLahir}
                                        locale={'en'}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        animationType={'fade'}
                                        androidMode={'default'}
                                        disabled={false}
                                        onDateChange={(date) => {
                                            this.setState({tanggalLahir: date});
                                        }}
                                    /> :
                                    <DatePicker
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                fontcolor: 'white',
                                                borderWidth: 0,
                                            },
                                            // ... You can check the source to find the other keys.
                                        }}
                                        style={styles.inputBox}
                                        placeholder="Ubah tanggal Lahir"
                                        date={this.state.tanggalLahir}
                                        locale={'en'}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        animationType={'fade'}
                                        androidMode={'default'}
                                        disabled={false}
                                        onDateChange={(date) => {
                                            this.setState({tanggalLahir: date});
                                        }}
                                    />}
                                {this.isFieldInError('tanggalLahir') && this.getErrorsInField('tanggalLahir').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}
                                {this.props.getState().jenisKelamin !== undefined ?
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down"/>}
                                        placeholder="Pilih Jenis Kelamin"
                                        placeholderIconColor="#007aff"

                                        selectedValue={this.props.getState().jenisKelamin}
                                        onValueChange={this.onValueChange2.bind(this)}
                                    >
                                        <Picker.Item label="Pilih Jenis Kelamin" value=""/>
                                        <Picker.Item label="Perempuan" value="0"/>
                                        <Picker.Item label="Laki - Laki" value="1"/>
                                    </Picker> :
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down"/>}
                                        placeholder="Pilih Jenis Kelamin"
                                        placeholderIconColor="#007aff"

                                        selectedValue={this.state.jenisKelamin}
                                        onValueChange={this.onValueChange2.bind(this)}
                                    >
                                        <Picker.Item label="Pilih Jenis Kelamin" value=""/>
                                        <Picker.Item label="Perempuan" value="0"/>
                                        <Picker.Item label="Laki - Laki" value="1"/>
                                    </Picker>}
                                {this.isFieldInError('jenisKelamin') && this.getErrorsInField('jenisKelamin').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}
                                {this.props.getState().statusKawin !== undefined ?
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down"/>}
                                        placeholder="Pilih Status Kawin"
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.props.getState().statusKawin}
                                        onValueChange={this.onValueChange1.bind(this)}
                                    >
                                        <Picker.Item label="Pilih Status Perkawinan" value=""/>
                                        <Picker.Item label="Kawin" value="KAWIN"/>
                                        <Picker.Item label="Belum Kawin" value="BELUM KAWIN"/>
                                    </Picker> :
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down"/>}
                                        placeholder="Pilih Status Kawin"
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.statusKawin}
                                        onValueChange={this.onValueChange1.bind(this)}
                                    >
                                        <Picker.Item label="Pilih Status Perkawinan" value=""/>
                                        <Picker.Item label="Kawin" value="KAWIN"/>
                                        <Picker.Item label="Belum Kawin" value="BELUM KAWIN"/>
                                    </Picker>}
                                {this.isFieldInError('statusKawin') && this.getErrorsInField('statusKawin').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}
                                {listView}
                                {listViewPekerjaan}

                                {this.props.getState().noBpjs != undefined ?
                                    <TextInput
                                        keyboardType={'numeric'}
                                        defaultValue={this.props.getState().noBpjs}
                                        ref="noBpjs"
                                        onChangeText={(noBpjs) => this.setState({noBpjs})}
                                        style={styles.inputBox}
                                        underlineColorAndroid="rgba(0,0,0,0)"
                                        placeholder="Nomor BPJS (Boleh dikosongkan)"
                                        placeholderTextColor="rgba(255,255,255,0.8)"
                                        selectionColor="#999999"
                                    /> : <TextInput
                                        keyboardType={'numeric'}
                                        ref="noBpjs"
                                        onChangeText={(noBpjs) => this.setState({noBpjs})}
                                        style={styles.inputBox}
                                        underlineColorAndroid="rgba(0,0,0,0)"
                                        placeholder="Nomor BPJS (Boleh dikosongkan)"
                                        placeholderTextColor="rgba(255,255,255,0.8)"
                                        selectionColor="#999999"
                                    />}
                                {this.isFieldInError('noBpjs') && this.getErrorsInField('noBpjs').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}
                                <Grid style={{marginTop: 20}}>
                                    <Col style={{height: 80}}></Col>
                                    <Col style={{width: 140, height: 80}}>
                                    </Col>
                                    <Col style={{width: 150, height: 80}}>
                                        <Button style={{marginLeft: 5, paddingLeft: 20}} rounded success
                                                onPress={this._onSubmit.bind(this)}>
                                            <Text style={{color: '#ffffff'}}>Selanjutnya</Text>
                                            <Icon type="FontAwesome" name='arrow-right'/>
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
                            </ScrollView> : <View></View>}

                </View>
            </Container>

        );
    }
}

mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
