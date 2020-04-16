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

class LengkapiProfil extends ValidationComponent {

    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            isLoading: false,
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
            alamat: '',
            tempatLahir: '',
            tanggalLahir: '',
            nama: '',
            jenisKelamin: '',
            dataAgama: [],
            pilihAgama: '',
            noKartu: '',
            noTelpon: '',
            pekerjaan: '',
            nik: '',
            statusKawin: '',
            penanggungJawab: '',
            noBpjs: '',
            noHpPenanggungJawab: '',
            dataProfil: [],
            chosenDate: new Date(),
        };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({chosenDate: newDate});
    }

    componentDidMount() {
        console.log(this.props.id);
        this.showDataProvinsi();
        this.showDataSuku();
        this.showDataBahasa();
        this.showDataAgama();

        fetch(baseApi + '/user/getUserLengkapiPendaftaran', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                nomorMr: this.props.id,
            }),
        }).then((response) => response.json()).then((responseJson) => {

            this.setState({
                isLoading: false,
                loading: false,
                dataProfil: responseJson.dataProfile,
                tempatLahir: responseJson.dataProfile.tempat_lahir,
                tanggalLahir: responseJson.dataProfile.tgl_lahir,
                nama: responseJson.dataProfile.nama,
                jenisKelamin: responseJson.dataProfile.jns_kelamin,
                pilihAgama: responseJson.dataProfile.agama,
                noTelpon: responseJson.dataProfile.no_telpon,
                pekerjaan: responseJson.dataProfile.pekerjaan,
                nik: responseJson.dataProfile.no_ktp,
                statusKawin: responseJson.dataProfile.status_kawin,
                pilihProvinsi: responseJson.dataProfile.nama_provinsi,
                pilihKota: responseJson.dataProfile.nama_kab_kota,
                pilihKecamatan: responseJson.dataProfile.nama_kecamatan,
                pilihDesa: responseJson.dataProfile.nama_kelurahan,
                pilihSuku: responseJson.dataProfile.suku,
                pilihBahasa: responseJson.dataProfile.bahasa,
                pilihWn: responseJson.dataProfile.kewarganegaraan,
                pilihNegara: responseJson.dataProfile.nama_negara,
                alamat: responseJson.dataProfile.alamat,
                penanggungJawab: responseJson.dataProfile.penanggung_jawab,
                noBpjs: responseJson.dataProfile.no_bpjs,
                noHpPenanggungJawab: responseJson.dataProfile.no_penanggung_jawab,
            });


            if (responseJson.dataProfile.nama_provinsi != null) {
                this.showKota(responseJson.dataProfile.nama_provinsi);
                this.showKecamatan(responseJson.dataProfile.nama_kab_kota);
                this.showDesa(responseJson.dataProfile.nama_kecamatan);
            }


            console.log(responseJson.dataProfile);
        })
            .catch((error) => {
                console.log(error);
            });

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

    showDataAgama() {
        const url = baseApi + '/user/agama';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataAgama.push({
                    id: i,
                    name: a[i].agama,
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

    _onSubmit() {
        this.validate({
            // noBpjs:{minlength: 13, maxlength: 13,number:true},
            pilihAgama: {required: true},
            jenisKelamin: {required: true},
            statusKawin: {required: true},
            chosenDate: {required: true},
            noTelpon: {minlength: 10, maxlength: 13, number: true, required: true},
            tempatLahir: {minlength: 4, maxlength: 50, required: true},
            nama: {minlength: 4, maxlength: 50, required: true},
            pekerjaan: {minlength: 4, maxlength: 50, required: true},
            nik: {minlength: 16, maxlength: 16, required: true},
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

            this.setState({
                isLoading: true,
            });
            if (this.state.noBpjs != 0) {
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

                    if (responseJson.response != null) {
                        if (parseInt(responseJson.response.peserta.statusPeserta.kode) === 0) {
                            fetch(baseApi + '/user/updateProfilLengkapiPendaftaran', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                                },
                                body: JSON.stringify({
                                    id: this.props.id,
                                    jenisKelamin: this.state.jenisKelamin,
                                    statusKawin: this.state.statusKawin,
                                    tanggalLahir: this.state.tanggalLahir,
                                    noTelpon: this.state.noTelpon,
                                    tempatLahir: this.state.tempatLahir,
                                    nama: this.state.nama,
                                    pekerjaan: this.state.pekerjaan,
                                    nik: this.state.nik,
                                    pilihProvinsi: this.state.pilihProvinsi,
                                    pilihKota: this.state.pilihKota,
                                    pilihKecamatan: this.state.pilihKecamatan,
                                    pilihDesa: this.state.pilihDesa,
                                    pilihSuku: this.state.pilihSuku,
                                    pilihBahasa: this.state.pilihBahasa,
                                    pilihWn: this.state.pilihWn,
                                    pilihNegara: this.state.pilihNegara,
                                    alamat: this.state.alamat,
                                    noBpjs: this.state.noBpjs,
                                    agama: this.state.pilihAgama,
                                }),
                            }).then((response) => response.json()).then((responseJson) => {
                                console.log({
                                    id: this.props.id,
                                    jenisKelamin: this.state.jenisKelamin,
                                    statusKawin: this.state.statusKawin,
                                    tanggalLahir: this.state.tanggalLahir,
                                    noTelpon: this.state.noTelpon,
                                    tempatLahir: this.state.tempatLahir,
                                    nama: this.state.nama,
                                    pekerjaan: this.state.pekerjaan,
                                    nik: this.state.nik,
                                    pilihProvinsi: this.state.pilihProvinsi,
                                    pilihKota: this.state.pilihKota,
                                    pilihKecamatan: this.state.pilihKecamatan,
                                    pilihDesa: this.state.pilihDesa,
                                    pilihSuku: this.state.pilihSuku,
                                    pilihBahasa: this.state.pilihBahasa,
                                    pilihWn: this.state.pilihWn,
                                    pilihNegara: this.state.pilihNegara,
                                    alamat: this.state.alamat,
                                    noBpjs: this.state.noBpjs,
                                    agama: this.state.pilihAgama,
                                });
                                if (responseJson.success === true) {
                                    this.setState({
                                        isLoading: false,
                                    });
                                    showMessage({
                                        message: responseJson.message,
                                        type: 'success',
                                        position: 'top',
                                    });
                                    Actions.pop({
                                        refresh: {
                                            nomorMr: this.props.id,
                                            tahunLahir: this.props.tahunLahir,
                                        },
                                    });
                                } else {
                                    this.setState({
                                        isLoading: false,
                                    });
                                    showMessage({
                                        message: responseJson.message,
                                        type: 'danger',
                                        position: 'top',
                                    });
                                }
                            }).catch((error) => {
                                this.state.loading = false;
                                console.log(error);
                                showMessage({
                                    message: responseJson.message,
                                    type: 'danger',
                                    position: 'top',
                                });
                            });


                        } else {
                            this.setState({
                                isLoading: false,
                            });

                            showMessage({
                                message: 'BPJS Anda Tidak Aktif',
                                type: 'danger',
                                position: 'top',
                            });
                        }

                    } else {
                        this.setState({
                            isLoading: false,
                        });
                        showMessage({
                            message: 'Nomor Yang anda masukan tidak terdaftar',
                            type: 'danger',
                            position: 'top',
                        });
                    }


                }).catch((error) => {
                    console.log(error);
                    this.setState({
                        isLoading: false,
                    });
                    showMessage({
                        message: error,
                        type: 'danger',
                        position: 'top',
                    });
                });
            } else {


                fetch(baseApi + '/user/updateProfilLengkapiPendaftaran', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        id: this.props.id,
                        jenisKelamin: this.state.jenisKelamin,
                        statusKawin: this.state.statusKawin,
                        tanggalLahir: this.state.tanggalLahir,
                        noTelpon: this.state.noTelpon,
                        tempatLahir: this.state.tempatLahir,
                        nama: this.state.nama,
                        pekerjaan: this.state.pekerjaan,
                        nik: this.state.nik,
                        pilihProvinsi: this.state.pilihProvinsi,
                        pilihKota: this.state.pilihKota,
                        pilihKecamatan: this.state.pilihKecamatan,
                        pilihDesa: this.state.pilihDesa,
                        pilihSuku: this.state.pilihSuku,
                        pilihBahasa: this.state.pilihBahasa,
                        pilihWn: this.state.pilihWn,
                        pilihNegara: this.state.pilihNegara,
                        alamat: this.state.alamat,
                        noBpjs: this.state.noBpjs,
                        agama: this.state.pilihAgama,
                    }),
                }).then((response) => response.json()).then((responseJson) => {
                    console.log({
                        id: this.props.id,
                        jenisKelamin: this.state.jenisKelamin,
                        statusKawin: this.state.statusKawin,
                        tanggalLahir: this.state.tanggalLahir,
                        noTelpon: this.state.noTelpon,
                        tempatLahir: this.state.tempatLahir,
                        nama: this.state.nama,
                        pekerjaan: this.state.pekerjaan,
                        nik: this.state.nik,
                        pilihProvinsi: this.state.pilihProvinsi,
                        pilihKota: this.state.pilihKota,
                        pilihKecamatan: this.state.pilihKecamatan,
                        pilihDesa: this.state.pilihDesa,
                        pilihSuku: this.state.pilihSuku,
                        pilihBahasa: this.state.pilihBahasa,
                        pilihWn: this.state.pilihWn,
                        pilihNegara: this.state.pilihNegara,
                        alamat: this.state.alamat,
                        noBpjs: this.state.noBpjs,
                        agama: this.state.pilihAgama,
                    });
                    if (responseJson.success === true) {
                        this.setState({
                            isLoading: false,
                        });
                        showMessage({
                            message: responseJson.message,
                            type: 'success',
                            position: 'top',
                        });
                        Actions.pop({
                            refresh: {
                                nomorMr: this.props.id,
                                tahunLahir: this.props.tahunLahir,
                            },
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                        });
                        showMessage({
                            message: responseJson.message,
                            type: 'danger',
                            position: 'top',
                        });
                    }
                }).catch((error) => {
                    this.setState({
                        isLoading: false,
                    });
                    showMessage({
                        message: error,
                        type: 'danger',
                        position: 'top',
                    });
                });
            }


        }
    }

    toggleSwitch() {
        this.setState({showPassword: !this.state.showPassword});
    }

    render() {
        const {showAlert} = this.state;
        const {onChange} = this.props;
        const loader = <Loader/>;


        var listViewProfil1 = [];
        var listView = [];
        var listViewKota = [];
        var listViewKecamatan = [];
        var listViewDesa = [];
        var listViewSuku = [];
        var listViewBahasa = [];
        var listViewPilihNegara = [];
        var listViewWargaNegara = [];
        var listViewAgama = [];
        if (this.state.dataProfil.length != 0 && this.state.dataProfil.pilihKota != '') {

            if (this.state.dataAgama.length != 0) {
                listViewAgama.push(
                    <View>
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
                            title={this.state.pilihAgama}
                            data={this.state.dataAgama}
                            onSelect={data => {
                                this.setState({
                                    pilihAgama: this.state.dataAgama[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihAgama: ''});
                            }}
                        />

                        {this.isFieldInError('pilihAgama') && this.getErrorsInField('pilihAgama').map(errorMessage =>
                            <Text>{errorMessage}</Text>)}
                    </View>,
                );
            }

            if (this.state.dataProvinsi.length != 0) {
                var pilihProvinsiJudul = this.state.pilihProvinsi;
                listView.push(
                    <View>
                        <Select2
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
                            title={this.state.pilihProvinsi != null ? this.state.pilihProvinsi : 'Pilih Provinsi'}
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
                        />

                        {this.isFieldInError('pilihProvinsi') && this.getErrorsInField('pilihProvinsi').map(errorMessage =>
                            <Text>{errorMessage}</Text>)}
                    </View>,
                );
            } else {
                listView.push(
                    <View style={styles.loader}>
                        <ActivityIndicator size="small"/>
                    </View>,
                );
            }

            if (this.state.pilihProvinsi != null) {
                listViewKota.push(
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
                            searchPlaceHolderText="Cari Kota Anda"
                            popupTitle="Pilih Kota"
                            title={this.state.pilihKota != null ? this.state.pilihKota : 'Pilih Kota'}
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
                        />

                        {this.isFieldInError('pilihKota') && this.getErrorsInField('pilihKota').map(errorMessage =>
                            <Text>{errorMessage}</Text>)}
                    </View>,
                );
            }
            if (this.state.dataKota.length != 0) {
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
                            title={this.state.pilihKecamatan}
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
            }

            if (this.state.dataKecamatan.length != 0) {
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
                            title={this.state.pilihDesa}
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
            }


            if (this.state.dataSuku.length != 0) {
                listViewSuku.push(
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
                            searchPlaceHolderText="Cari Suku Anda"
                            popupTitle="Pilih Suku"
                            title={this.state.pilihSuku != null ? this.state.pilihKota : 'Pilih Suku'}
                            data={this.state.dataSuku}
                            onSelect={data => {
                                this.setState({
                                    pilihSuku: this.state.dataSuku[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihSuku: ''});
                            }}
                        />

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

            if (this.state.dataBahasa.length != 0) {
                listViewBahasa.push(
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
                            searchPlaceHolderText="Cari Bahasa Anda"
                            popupTitle="Pilih Bahasa"
                            title={this.state.pilihBahasa != null ? this.state.pilihBahasa : 'Pilih Bahasa'}
                            data={this.state.dataBahasa}
                            onSelect={data => {
                                this.setState({
                                    pilihBahasa: this.state.dataBahasa[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihBahasa: ''});
                            }}
                        />
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

            if (this.state.dataNegara.length != 0) {
                listViewPilihNegara.push(
                    <View>
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
                            title={this.state.pilihNegara}
                            data={this.state.dataNegara}
                            onSelect={data => {
                                this.setState({
                                    pilihNegara: this.state.dataNegara[data].name,
                                });

                            }}
                            onRemoveItem={data => {
                                this.setState({pilihNegara: ''});
                            }}
                        />
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

            listViewWargaNegara.push(
                <View>
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
                        title={this.state.pilihWn}
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
                    />
                    {this.isFieldInError('pilihWn') && this.getErrorsInField('pilihWn').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );

            listViewProfil1.push(
                <View>
                    <View>
                        <LoaderModal
                            loading={false}/>
                    </View>
                    <TextInput
                        keyboardType={'numeric'}
                        defaultValue={parseInt(this.state.nik) === 0 ? null : this.state.nik}
                        ref="nik"
                        onChangeText={(nik) => this.setState({nik})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="No KTP"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('nik') && this.getErrorsInField('nik').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        autoCapitalize='words'
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
                        defaultValue={this.state.tempatLahir}
                        ref="tempat_lahir"
                        onChangeText={(tempatLahir) => this.setState({tempatLahir})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Tempat Lahir"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('tempatLahir') && this.getErrorsInField('tempatLahir').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <DatePicker
                        defaultDate={new Date(this.state.tanggalLahir)}
                        locale={'en'}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'default'}
                        disabled={false}
                        onDateChange={this.setDate}
                    />
                    {this.isFieldInError('tanggalLahir') && this.getErrorsInField('tanggalLahir').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    {listViewAgama}
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down"/>}
                        placeholder="Pilih Jenis Kelamin"
                        placeholderIconColor="#007aff"

                        selectedValue={this.state.jenisKelamin}
                        onValueChange={this.onValueChange2.bind(this)}
                    >
                        <Picker.Item label="Perempuan" value="0"/>
                        <Picker.Item label="Laki - Laki" value="1"/>
                    </Picker>
                    {this.isFieldInError('jenisKelamin') && this.getErrorsInField('jenisKelamin').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down"/>}
                        placeholder="Pilih Status Kawin"
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.statusKawin}
                        onValueChange={this.onValueChange1.bind(this)}
                    >
                        <Picker.Item label="Kawin" value="KAWIN"/>
                        <Picker.Item label="Belum Kawin" value="BELUM KAWIN"/>
                    </Picker>
                    {this.isFieldInError('statusKawin') && this.getErrorsInField('statusKawin').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        defaultValue={this.state.pekerjaan}
                        ref="pekerjaan"
                        onChangeText={(pekerjaan) => this.setState({pekerjaan})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Pekerjaan"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('pekerjaan') && this.getErrorsInField('pekerjaan').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        keyboardType={'numeric'}
                        defaultValue={this.state.noTelpon}
                        ref="noTelpon"
                        onChangeText={(noTelpon) => this.setState({noTelpon})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Nomor Telfon / No Hp"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('noTelpon') && this.getErrorsInField('noTelpon').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    {listViewWargaNegara}
                    {this.state.pilihWn === '' ? <View></View> : this.state.pilihWn === 'WNI' ?
                        <View>
                            {listView}
                            {this.state.pilihProvinsi != '' ? listViewKota : <View></View>}
                            {this.state.pilihKota != '' && this.state.pilihProvinsi != '' ? listViewKecamatan :
                                <View></View>}
                            {this.state.pilihKecamatan != '' && this.state.pilihKota != '' && this.state.pilihProvinsi != '' ? listViewDesa :
                                <View></View>}

                            {this.state.alamat != '' ?
                                <Textarea ref="alamat"
                                          autoCapitalize='words'
                                          defaultValue={this.state.alamat}
                                          onChangeText={(alamat) => this.setState({alamat})}
                                          placeholderTextColor="#ffffff"
                                          style={styles.inputBox}
                                          rowSpan={5} bordered
                                          placeholder="Alamat"/> :
                                <Textarea ref="alamat"
                                          autoCapitalize='words'
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

                    <TextInput
                        defaultValue={parseInt(this.state.noBpjs) === 0 ? null : this.state.noBpjs}
                        ref="noBpjs"
                        onChangeText={(noBpjs) => this.setState({noBpjs})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Nomor BPJS"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('noBpjs') && this.getErrorsInField('noBpjs').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}

                </View>,
            );
        } else {
            listViewProfil1.push(
                <View>
                    <LoaderModal
                        loading={true}/>
                </View>,
            );

        }

        var loadingView = [];
        if (this.state.loading === true) {
            loadingView.push(
                <View>
                    <LoaderModal
                        loading={true}/>
                </View>,
            );
        } else {
            loadingView.push(
                <View>
                    <LoaderModal
                        loading={false}/>
                </View>,
            );
        }
        return (
            <View style={styles.container}>
                {/*{this.state.loading === true ? <View><Loader/></View> : ''}*/}
                <ScrollView style={{marginVertical: 15, backgroundColor: 'white'}}>
                    <LoaderModal
                        loading={this.state.isLoading}/>
                    {loadingView}
                    {listViewProfil1}
                    <TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                        <Text style={styles.buttonText}>Update Profil</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(LengkapiProfil);
