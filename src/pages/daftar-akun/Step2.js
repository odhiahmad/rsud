import React, {Component} from 'react';
import {
    NetInfo,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput, ScrollView, Modal, ActivityIndicator,
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
import DatePicker from 'react-native-datepicker';
import RNPicker from 'rn-modal-picker';
import {
    Textarea,
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
import HTMLView from 'react-native-htmlview';
import Select2 from 'react-native-select-two';

const styles = StyleSheet.create({
    pickerStyle: {
        paddingLeft: 5,
        paddingTop: 5,
        height: 50,
        width: 300,
        paddingRight: 30,
        marginBottom: 4,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        flexDirection: 'row',
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

class Step2 extends ValidationComponent {

    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            dataProvinsi: [],
            pilihProvinsi: '',
            dataKota: [],
            pilihKota: '',
            dataKecamatan: [],
            pilihKecamatan: '',
            dataDesa: [],
            pilihDesa: '',
            dataSuku: [],
            pilihSuku: '',
            dataBahasa: [],
            pilihBahasa: '',
            dataNegara: [],
            pilihNegara: '',
            dataWn: [
                {
                    id: 0,
                    name: 'WNI',
                },
                {
                    id: 1,
                    name: 'WNA',
                },
            ],
            pilihWn: '',
            selected: undefined,
            date: '',
            alamat: '',
            totalSteps: '',
            currentStep: '',
            pekerjaan: '',
            nik: '',
            dataSource: [],
            placeHolderText: 'Pilih Provinsi',
            selectedText: '',
            setModalVisible: false,
        };
    }

    componentDidMount() {
        this.showDataProvinsi();
        this.showDataSuku();
        this.showDataBahasa();
        if(this.props.getState().pilihWn === 'WNI'){
            if (this.props.getState().pilihKecamatan != undefined) {
                this.state.pilihProvinsi = this.props.getState().pilihProvinsi;
                this.state.pilihKota = this.props.getState().pilihKota;
                this.state.pilihKecamatan = this.props.getState().pilihKecamatan;
                this.state.pilihDesa = this.props.getState().pilihDesa;
                this.state.pilihSuku = this.props.getState().pilihSuku;
                this.state.pilihBahasa = this.props.getState().pilihBahasa;
                this.state.pilihWn = this.props.getState().pilihWn;
                this.state.alamat = this.props.getState().alamat;
            }
        }


        if(this.props.getState().pilihWn === 'WNA'){
            this.state.pilihNegara = this.props.getState().pilihNegara;
        }
    }

    _onSubmit() {
        if (this.state.pilihNegara === '') {
            this.validate({
                pilihProvinsi: {required: true},
                pilihKota: {required: true},
                pilihKecamatan: {required: true},
                pilihDesa: {required: true},
                pilihSuku: {required: true},
                pilihBahasa: {required: true},
                pilihWn: {required: true},
                alamat: {required: true},
            });
            if (this.isFormValid()) {
                this.nextStep();
            }
        } else {
            this.validate({
                pilihWn: {required: true},
                pilihNegara: {required: true},

            });
            if (this.isFormValid()) {
                this.nextStep();
            }
        }
    }

    onValueChange(value: string) {
        this.setState({
            selected: value,
        });
    }

    _selectedValue(index, item) {
        this.setState({selectedText: item.name});
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

        if(this.state.pilihWn === 'WNI'){
            saveState({
                pilihProvinsi: this.state.pilihProvinsi,
                pilihKota: this.state.pilihKota,
                pilihKecamatan: this.state.pilihKecamatan,
                pilihDesa: this.state.pilihDesa,
                pilihSuku: this.state.pilihSuku,
                pilihBahasa: this.state.pilihBahasa,
                pilihWn: this.state.pilihWn,
                alamat: this.state.alamat,
                pilihNegara:'INDONESIA'
            });
        }else{
            saveState({
                pilihWn: this.state.pilihWn,
                pilihNegara:this.state.pilihNegara
            });
        }


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

    showDataProvinsi() {
        const url = baseApi + '/user/provinsi';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataProvinsi.push({
                    id: i,
                    name: a[i].provinsi,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showDataSuku() {
        const url = baseApi + '/user/suku';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataSuku.push({
                    id: i,
                    name: a[i].suku_nama,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showDataBahasa() {
        const url = baseApi + '/user/bahasa';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataBahasa.push({
                    id: i,
                    name: a[i].bahasa_nama,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showNegara() {
        const url = baseApi + '/user/negara';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataNegara.push({
                    id: i,
                    name: a[i].nama_negara,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showKota(kota) {
        this.state.dataKota = [];
        const url = baseApi + '/user/kota';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provinsi: kota,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            console.log(a);
            for (let i = 0; i < a.length; i++) {
                this.state.dataKota.push({
                    id: i,
                    name: a[i].nama_kabkota,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showKecamatan(kota) {
        this.state.dataKecamatan = [];
        const url = baseApi + '/user/kecamatan';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kota: kota,
                provinsi: this.state.pilihProvinsi,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            console.log(a);
            for (let i = 0; i < a.length; i++) {
                this.state.dataKecamatan.push({
                    id: i,
                    name: a[i].kecamatan,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showDesa(kecamatan) {
        this.state.dataDesa = [];
        const url = baseApi + '/user/desa';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kota: this.state.pilihKota,
                provinsi: this.state.pilihProvinsi,
                kecamatan: kecamatan,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            console.log(a);
            for (let i = 0; i < a.length; i++) {
                this.state.dataDesa.push({
                    id: i,
                    name: a[i].desa,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showModal(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    render() {
        const {currentStep, totalSteps} = this.state;
        const {showAlert} = this.state;
        const {onChange} = this.props;
        const loader = <Loader/>;

        var listView = [];
        if (this.state.dataProvinsi.length != 0) {
            listView.push(
                <View>
                    {this.props.getState().pilihProvinsi != undefined ? <Select2
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        selectedTitleStyle={{color: 'white'}}
                        searchPlaceHolderText="Cari Provinsi Anda"
                        popupTitle="Pilih Provinsi"
                        title={this.props.getState().pilihProvinsi}
                        data={this.state.dataProvinsi}
                        onSelect={data => {
                            if (this.state.dataKota.length != 0) {
                                this.setState({
                                    dataKota: [],
                                    pilihKota: '',
                                });
                            }
                            if (this.state.dataKecamatan.length != 0) {
                                this.setState({
                                    pilihKecamatan: '',
                                    dataKecamatan: [],
                                });
                            }
                            if (this.state.dataDesa.length != 0) {
                                this.setState({
                                    pilihDesa: '',
                                    dataDesa: [],
                                });
                            }
                            this.setState({
                                pilihProvinsi: this.state.dataProvinsi[data].name,
                            });
                            this.showKota(this.state.dataProvinsi[data].name);

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihProvinsi: ''});
                        }}
                    /> : <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Provinsi Anda"
                        popupTitle="Pilih Provinsi"
                        title="Pilih Provinsi"
                        data={this.state.dataProvinsi}
                        onSelect={data => {
                            if (this.state.dataKota.length != 0) {
                                this.setState({
                                    dataKota: [],
                                    pilihKota: '',
                                });
                            }
                            if (this.state.dataKecamatan.length != 0) {
                                this.setState({
                                    pilihKecamatan: '',
                                    dataKecamatan: [],
                                });
                            }
                            if (this.state.dataDesa.length != 0) {
                                this.setState({
                                    pilihDesa: '',
                                    dataDesa: [],
                                });
                            }
                            this.setState({
                                pilihProvinsi: this.state.dataProvinsi[data].name,
                            });
                            this.showKota(this.state.dataProvinsi[data].name);

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihProvinsi: ''});
                        }}
                    />}

                    {this.isFieldInError('pilihProvinsi') && this.getErrorsInField('pilihProvinsi').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listView.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

        var listViewKota = [];
        if (this.state.dataProvinsi.length != 0) {
            listViewKota.push(
                <View>
                    {this.props.getState().pilihKota != undefined ?
                        <Select2
                            selectedTitleStyle={{color: 'white'}}
                            placeholderTextColor="#ffffff"
                            listEmptyTitle="Tidak ada data"
                            cancelButtonText="Keluar"
                            selectButtonText="Pilih"
                            isSelectSingle
                            style={styles.inputBox}
                            colorTheme="#1da30b"
                            searchPlaceHolderText="Cari Kota Anda"
                            popupTitle="Pilih Kota"
                            title={this.props.getState().pilihKota}
                            data={this.state.dataKota}
                            onSelect={data => {
                                if (this.state.dataKecamatan.length != 0) {
                                    this.setState({
                                        pilihKecamatan: '',
                                        dataKecamatan: [],
                                    });
                                }
                                if (this.state.dataDesa.length != 0) {
                                    this.setState({
                                        pilihDesa: '',
                                        dataDesa: [],
                                    });
                                }
                                this.setState({
                                    pilihKota: this.state.dataKota[data].name,
                                });
                                this.showKecamatan(this.state.dataKota[data].name);

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihKota: ''});
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
                            searchPlaceHolderText="Cari Kota Anda"
                            popupTitle="Pilih Kota"
                            title="Pilih Kota"
                            data={this.state.dataKota}
                            onSelect={data => {
                                if (this.state.dataKecamatan.length != 0) {
                                    this.setState({
                                        pilihKecamatan: '',
                                        dataKecamatan: [],
                                    });
                                }
                                if (this.state.dataDesa.length != 0) {
                                    this.setState({
                                        pilihDesa: '',
                                        dataDesa: [],
                                    });
                                }
                                this.setState({
                                    pilihKota: this.state.dataKota[data].name,
                                });
                                this.showKecamatan(this.state.dataKota[data].name);

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihKota: ''});
                            }}
                        />}

                    {this.isFieldInError('pilihKota') && this.getErrorsInField('pilihKota').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listViewKota.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

        var listViewKecamatan = [];
        if (this.props.getState().pilihKota != undefined) {
            listViewKecamatan.push(
                <View>
                    <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Kecamatan Anda"
                        popupTitle="Pilih Kecamatan"
                        title={this.props.getState().pilihKecamatan}
                        data={this.state.dataKecamatan}
                        onSelect={data => {
                            if (this.state.dataDesa.length != 0) {
                                this.setState({
                                    pilihDesa: '',
                                    dataDesa: [],
                                });
                            }
                            this.setState({
                                pilihKecamatan: this.state.dataKecamatan[data].name,
                            });
                            this.showDesa(this.state.dataKecamatan[data].name);

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihKecamatan: ''});
                        }}
                    />
                </View>);
        } else if (this.state.dataKota.length != 0) {
            listViewKecamatan.push(
                <View>
                    <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Kecamatan Anda"
                        popupTitle="Pilih Kecamatan"
                        title="Pilih Kecamatan"
                        data={this.state.dataKecamatan}
                        onSelect={data => {
                            if (this.state.dataDesa.length != 0) {
                                this.setState({
                                    pilihDesa: '',
                                    dataDesa: [],
                                });
                            }
                            this.setState({
                                pilihKecamatan: this.state.dataKecamatan[data].name,
                            });
                            this.showDesa(this.state.dataKecamatan[data].name);

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihKecamatan: ''});
                        }}
                    />

                    {this.isFieldInError('pilihKecamatan') && this.getErrorsInField('pilihKecamatan').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listViewKecamatan.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="small"/>
                </View>,
            );
        }

        var listViewDesa = [];
        if (this.props.getState().pilihDesa != undefined) {
            listViewDesa.push(
                <View>
                    <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Desa Anda"
                        popupTitle="Pilih Desa"
                        title={this.props.getState().pilihDesa}
                        data={this.state.dataDesa}
                        onSelect={data => {
                            this.setState({
                                pilihDesa: this.state.dataDesa[data].name,
                            });

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihDesa: ''});
                        }}
                    />
                    {this.isFieldInError('pilihDesa') && this.getErrorsInField('pilihDesa').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>);
        } else if (this.state.dataKecamatan.length != 0) {
            listViewDesa.push(
                <View>

                    <Select2
                        selectedTitleStyle={{color: 'white'}}
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Desa Anda"
                        popupTitle="Pilih Desa"
                        title="Pilih Desa"
                        data={this.state.dataDesa}
                        onSelect={data => {
                            this.setState({
                                pilihDesa: this.state.dataDesa[data].name,
                            });

                        }}
                        onRemoveItem={data => {
                            this.setState({pilihDesa: ''});
                        }}
                    />

                    {this.isFieldInError('pilihDesa') && this.getErrorsInField('pilihDesa').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listViewDesa.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="small"/>
                </View>,
            );
        }


        var listViewSuku = [];
        if (this.state.dataSuku.length != 0) {
            listViewSuku.push(
                <View>
                    {this.props.getState().pilihSuku != undefined ?
                        <Select2
                            selectedTitleStyle={{color: 'white'}}
                            placeholderTextColor="#ffffff"
                            listEmptyTitle="Tidak ada data"
                            cancelButtonText="Keluar"
                            selectButtonText="Pilih"
                            isSelectSingle
                            style={styles.inputBox}
                            colorTheme="#1da30b"
                            searchPlaceHolderText="Cari Suku Anda"
                            popupTitle="Pilih Suku"
                            title={this.props.getState().pilihSuku}
                            data={this.state.dataSuku}
                            onSelect={data => {
                                this.setState({
                                    pilihSuku: this.state.dataSuku[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihSuku: ''});
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
                            searchPlaceHolderText="Cari Suku Anda"
                            popupTitle="Pilih Suku"
                            title="Pilih Suku"
                            data={this.state.dataSuku}
                            onSelect={data => {
                                this.setState({
                                    pilihSuku: this.state.dataSuku[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihSuku: ''});
                            }}
                        />}

                    {this.isFieldInError('pilihSuku') && this.getErrorsInField('pilihSuku').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listViewSuku.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

        var listViewBahasa = [];
        if (this.state.dataBahasa.length != 0) {
            listViewBahasa.push(
                <View>
                    {this.props.getState().pilihBahasa != undefined ?
                        <Select2
                            selectedTitleStyle={{color: 'white'}}
                            placeholderTextColor="#ffffff"
                            listEmptyTitle="Tidak ada data"
                            cancelButtonText="Keluar"
                            selectButtonText="Pilih"
                            isSelectSingle
                            style={styles.inputBox}
                            colorTheme="#1da30b"
                            searchPlaceHolderText="Cari Bahasa Anda"
                            popupTitle="Pilih Bahasa"
                            title={this.props.getState().pilihBahasa}
                            data={this.state.dataBahasa}
                            onSelect={data => {
                                this.setState({
                                    pilihBahasa: this.state.dataBahasa[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihBahasa: ''});
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
                            searchPlaceHolderText="Cari Bahasa Anda"
                            popupTitle="Pilih Bahasa"
                            title="Pilih Bahasa"
                            data={this.state.dataBahasa}
                            onSelect={data => {
                                this.setState({
                                    pilihBahasa: this.state.dataBahasa[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihBahasa: ''});
                            }}
                        />}

                    {this.isFieldInError('pilihBahasa') && this.getErrorsInField('pilihBahasa').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listViewSuku.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

        var listViewPilihNegara = [];
        if (this.state.dataNegara.length != 0) {
            listViewPilihNegara.push(
                <View>
                    {this.props.getState().pilihNegara != undefined ?
                        <Select2
                            selectedTitleStyle={{color: 'white'}}
                            placeholderTextColor="white"
                            listEmptyTitle="Tidak ada data"
                            cancelButtonText="Keluar"
                            selectButtonText="Pilih"
                            isSelectSingle
                            style={styles.inputBox}
                            colorTheme="#1da30b"
                            searchPlaceHolderText="Find Your Country"
                            popupTitle="Pilih Negara"
                            title={this.props.getState().pilihNegara}
                            data={this.state.dataNegara}
                            onSelect={data => {
                                this.setState({
                                    pilihNegara: this.state.dataNegara[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihNegara: ''});
                            }}
                        /> :
                        <Select2
                            selectedTitleStyle={{color: 'white'}}
                            placeholderTextColor="white"
                            listEmptyTitle="Tidak ada data"
                            cancelButtonText="Keluar"
                            selectButtonText="Pilih"
                            isSelectSingle
                            style={styles.inputBox}
                            colorTheme="#1da30b"
                            searchPlaceHolderText="Find Your Country"
                            popupTitle="Pilih Negara"
                            title="Pilih Negara"
                            data={this.state.dataNegara}
                            onSelect={data => {
                                this.setState({
                                    pilihNegara: this.state.dataNegara[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihNegara: ''});
                            }}
                        />}

                    {this.isFieldInError('pilihNegara') && this.getErrorsInField('pilihNegara').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );
        } else {
            listViewPilihNegara.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

        var listViewWargaNegara = [];
        listViewWargaNegara.push(
            <View>
                {this.props.getState().pilihWn != undefined ?
                    <Select2
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        selectedTitleStyle={{color: 'white'}}
                        searchPlaceHolderText="Cari Kewarganegaraan Anda"
                        popupTitle="Pilih Kewarganegaraan"
                        title={this.props.getState().pilihWn}
                        data={this.state.dataWn}
                        onSelect={data => {
                            this.setState({
                                pilihWn: this.state.dataWn[data].name,
                            });
                            console.log(this.state.pilihWn);
                            if (this.state.dataWn[data].name === 'WNA') {
                                this.showNegara();
                            }


                        }}
                        onRemoveItem={data => {
                            this.setState({pilihWn: ''});
                        }}
                    /> :
                    <Select2
                        placeholderTextColor="#ffffff"
                        listEmptyTitle="Tidak ada data"
                        cancelButtonText="Keluar"
                        selectButtonText="Pilih"
                        isSelectSingle
                        selectedTitleStyle={{color: 'white'}}
                        style={styles.inputBox}
                        colorTheme="#1da30b"
                        searchPlaceHolderText="Cari Kewarganegaraan Anda"
                        popupTitle="Pilih Kewarganegaraan"
                        title="Pilih Kewarganegaraan"
                        data={this.state.dataWn}
                        onSelect={data => {
                            this.setState({
                                pilihWn: this.state.dataWn[data].name,
                            });
                            console.log(this.state.pilihWn);
                            if (this.state.dataWn[data].name === 'WNA') {
                                this.showNegara();
                            }


                        }}
                        onRemoveItem={data => {
                            this.setState({pilihWn: ''});
                        }}
                    />}
                {this.isFieldInError('pilihWn') && this.getErrorsInField('pilihWn').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );

        return (
            <Container>
                <View style={styles.container}>
                    {/*<LoaderModal*/}
                    {/*    loading={this.state.loading}/>*/}
                    {/*{this.state.loading === true ? <View><Loader/></View> : ''}*/}
                    <ScrollView style={{marginVertical: 0, backgroundColor: 'white'}}>


                        <Grid style={{marginTop: 10}}>
                            <Col style={{height: 25}}></Col>
                            <Col style={{width: 110, height: 25}}>
                                <Text
                                    style={styles.currentStepText}
                                >{`Langkah ${currentStep} dari ${totalSteps}`}</Text></Col>
                            <Col style={{height: 25}}></Col>
                        </Grid>

                        {listViewWargaNegara}

                        {this.state.pilihWn === '' ? <View></View> : this.state.pilihWn === 'WNI' ?
                            <View>
                                {listView}
                                {this.state.pilihProvinsi != '' ? listViewKota : <View></View>}
                                {this.state.pilihKota != '' && this.state.pilihProvinsi != '' ? listViewKecamatan :
                                    <View></View>}
                                {this.state.pilihKecamatan != '' && this.state.pilihKota != '' && this.state.pilihProvinsi != '' ? listViewDesa :
                                    <View></View>}

                                {this.props.getState().alamat != undefined ?
                                    <Textarea ref="alamat"
                                              defaultValue={this.props.getState().alamat}
                                              onChangeText={(alamat) => this.setState({alamat})}
                                              placeholderTextColor="#ffffff"
                                              style={styles.inputBox}
                                              rowSpan={5} bordered
                                              placeholder="Alamat"/> :
                                    <Textarea ref="alamat"
                                              onChangeText={(alamat) => this.setState({alamat})}
                                              placeholderTextColor="#ffffff" style={styles.inputBox} rowSpan={5}
                                              bordered
                                              placeholder="Alamat"/>}
                                {this.isFieldInError('alamat') && this.getErrorsInField('alamat').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}

                                {listViewSuku}
                                {listViewBahasa}
                            </View> : this.state.pilihWn === 'WNA' ?
                                <View>{listViewPilihNegara}</View> : <View></View>
                        }

                        <Grid style={{marginTop: 20}}>
                            <Col style={{height: 80}}></Col>
                            <Col style={{width: 150, height: 80}}>
                                <Button style={{marginRight: 5}} rounded onPress={this.props.back} success>
                                    <Icon type="FontAwesome" name='arrow-left'/>
                                    <Text style={{color: '#ffffff'}}>Sebelumnya</Text>
                                </Button></Col>
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
                    </ScrollView>
                </View>
            </Container>
        );
    }
}

export default Step2;
