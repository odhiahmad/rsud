import React, {Component} from 'react';
import {
    NetInfo,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput, ScrollView, ActivityIndicator, FlatList,
} from 'react-native';
import LoaderModal from '../../components/LoaderModal';
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
    Content,
    Button,
    ListItem,
    Left,
    Body,
    Right,
    Switch,
    ActionSheet,
    Card, CardItem, Picker, Textarea,
} from 'native-base';
import {connect} from 'react-redux';
import Select2 from 'react-native-select-two';
import {logoutUser} from '../../actions/auth.actions';
import {showMessage} from 'react-native-flash-message';
import {Header,Icon} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

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
            isLoading: false,
            loading: false,
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
            dataPekerjaan: [],
            pilihPekerjaan: '',
            pilihJenisKota: '',
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

            id: '',

            showTryAgain: false,
        };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({chosenDate: newDate});
    }

    componentDidMount() {

        this.showData();

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

    showData() {
        this.setState({
            showTryAgain: false,
            isLoading: true,
            loading: true,
        });
        const url = baseApi + '/user/editProfilApi';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                id: this.props.getUser.userDetails.id,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                id: responseJson.dataProfile.id,
                dataProfil: responseJson.dataProfile,
                tempatLahir: responseJson.dataProfile.tempat_lahir !== null ? responseJson.dataProfile.tempat_lahir : '',
                tanggalLahir: responseJson.dataProfile.tgl_lahir !== null ? responseJson.dataProfile.tgl_lahir : '',
                nama: responseJson.dataProfile.nama !== null ? responseJson.dataProfile.nama : '',
                jenisKelamin: responseJson.dataProfile.jns_kelamin !== null ? responseJson.dataProfile.jns_kelamin : '',
                pilihAgama: responseJson.dataProfile.agama !== null ? responseJson.dataProfile.agama : '',
                noTelpon: responseJson.dataProfile.no_telpon !== null ? responseJson.dataProfile.no_telpon : '',
                pilihPekerjaan: responseJson.dataProfile.pekerjaan !== null ? responseJson.dataProfile.pekerjaan : '',
                nik: responseJson.dataProfile.no_ktp !== null ? responseJson.dataProfile.no_ktp : '',
                statusKawin: responseJson.dataProfile.status_kawin !== null ? responseJson.dataProfile.status_kawin : '',
                pilihProvinsi: responseJson.dataProfile.nama_provinsi !== null ? responseJson.dataProfile.nama_provinsi : '',
                pilihKota: responseJson.dataProfile.nama_kab_kota !== null ? responseJson.dataProfile.nama_kab_kota : '',
                pilihKecamatan: responseJson.dataProfile.nama_kecamatan !== null ? responseJson.dataProfile.nama_kecamatan : '',
                pilihDesa: responseJson.dataProfile.nama_kelurahan !== null ? responseJson.dataProfile.nama_kelurahan : '',
                pilihSuku: responseJson.dataProfile.suku !== null ? responseJson.dataProfile.suku : '',
                pilihBahasa: responseJson.dataProfile.bahasa !== null ? responseJson.dataProfile.bahasa : '',
                pilihWn: responseJson.dataProfile.kewarganegaraan !== null ? responseJson.dataProfile.kewarganegaraan : '',
                pilihNegara: responseJson.dataProfile.nama_negara !== null ? responseJson.dataProfile.nama_negara : '',
                alamat: responseJson.dataProfile.alamat !== null ? responseJson.dataProfile.alamat : '',
                penanggungJawab: responseJson.dataProfile.penanggung_jawab !== null ? responseJson.dataProfile.penanggung_jawab : '',
                noBpjs: responseJson.dataProfile.no_bpjs !== null ? responseJson.dataProfile.no_bpjs : '',
                noHpPenanggungJawab: responseJson.dataProfile.no_penanggung_jawab !== null ? responseJson.dataProfile.no_penanggung_jawab : '',
            });


            if (responseJson.dataProfile.nama_kab_kota !== null) {
                var cek = responseJson.dataProfile.nama_kab_kota.substr(0, 2);
                if (cek === 'Ka') {
                    var namaKabupaten = responseJson.dataProfile.nama_kab_kota
                    this.setState({
                        pilihJenisKota:'Kabupaten',
                        pilihKota:namaKabupaten.replace('Kabupaten ','')
                    });
                } else if (cek === 'Ko') {
                    var namaKota = responseJson.dataProfile.nama_kab_kota
                    this.setState({
                        pilihJenisKota:'Kota',
                        pilihKota:namaKota.replace('Kota ','')
                    });
                }
            }
            var kota = this.state.pilihKota;


            if (responseJson.dataProfile.nama_provinsi !== null) {
                this.showKota(responseJson.dataProfile.nama_provinsi);
                this.showKecamatan(kota, responseJson.dataProfile.nama_provinsi);
                this.showDesa(responseJson.dataProfile.nama_kecamatan, kota, responseJson.dataProfile.nama_provinsi);
            }

            var a = responseJson.dataProvinsi;
            var b = responseJson.dataSuku;
            var c = responseJson.dataBahasa;
            var d = responseJson.dataNegara;
            var e = responseJson.dataAgama;
            var f = responseJson.dataPekerjaan;

            var loopStopA = false;
            var loopStopB = false;
            var loopStopC = false;
            var loopStopD = false;
            var loopStopE = false;
            var loopStopF = false;

            for (let i = 0; i < a.length; i++) {
                this.state.dataProvinsi.push({
                    id: i,
                    name: a[i].provinsi,
                });
                if (a.length - 1 === i) {
                    loopStopA = true;
                }
            }
            for (let i = 0; i < b.length; i++) {
                this.state.dataSuku.push({
                    id: i,
                    name: b[i].suku_nama,
                });
                if (b.length - 1 === i) {
                    loopStopB = true;
                }
            }
            for (let i = 0; i < c.length; i++) {
                this.state.dataBahasa.push({
                    id: i,
                    name: c[i].bahasa_nama,
                });
                if (c.length - 1 === i) {
                    loopStopC = true;
                }
            }
            for (let i = 0; i < d.length; i++) {
                this.state.dataNegara.push({
                    id: i,
                    name: d[i].nama_negara,
                });
                if (d.length - 1 === i) {
                    loopStopD = true;
                }
            }
            for (let i = 0; i < e.length; i++) {
                this.state.dataAgama.push({
                    id: i,
                    name: e[i].agama,
                });
                if (e.length - 1 === i) {
                    loopStopE = true;
                }
            }
            for (let i = 0; i < f.length; i++) {
                this.state.dataPekerjaan.push({
                    id: i,
                    name: f[i].pekerjaan_nama,
                });
                if (f.length - 1 === i) {
                    loopStopF = true;
                }
            }

            if (loopStopA === true && loopStopB === true && loopStopC === true && loopStopD === true && loopStopE === true && loopStopF === true) {
                this.setState({
                    showTryAgain: false,
                    isLoading: false,
                    loading: false,
                });
            }
        }).catch((error) => {
            // console.log(error)
            this.setState({
                showTryAgain: true,
                isLoading: false,
                loading: false,
            });
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

            for (let i = 0; i < a.length; i++) {
                this.state.dataKota.push({
                    id: i,
                    name: a[i].nama_kabkota,
                    jenis: a[i].kabkota,
                });
            }
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {

        });
    }

    showKecamatan(kota, provinsi) {
        this.setState({
            dataKecamatan: [],
        });

        const url = baseApi + '/user/kecamatan';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kota: kota,
                provinsi: provinsi,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;

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

        });
    }

    showDesa(kecamatan, kota, provinsi) {
        this.state.dataDesa = [];
        const url = baseApi + '/user/desa';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kota: kota,
                provinsi: provinsi,
                kecamatan: kecamatan,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            var a = responseJson.data;

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

        });
    }

    _onSubmit() {
        this.validate({
            noBpjs:{minlength: 13, maxlength: 13,number:true},
            noHpPenanggungJawab:{required:true},
            pilihAgama: {required: true},
            jenisKelamin: {required: true},
            statusKawin: {required: true},
            chosenDate: {required: true},
            // noTelpon: {minlength: 10, maxlength: 13, number: true, required: true},
            tempatLahir: {minlength: 3, required: true},
            nama: {minlength: 4, maxlength: 50, required: true},
            pilihPekerjaan: {required: true},
            nik: {minlength: 16, maxlength: 16, required: true},
            pilihProvinsi: {required: true},
            pilihKota: {required: true},
            pilihKecamatan: {required: true},
            pilihDesa: {required: true},
            pilihSuku: {required: true},
            pilihBahasa: {required: true},
            pilihWn: {required: true},
            alamat: {minlength: 4, required: true},
        });
        if (this.isFormValid()) {

            this.setState({
                isLoading: true,
            });
            if (this.state.noBpjs != 0) {
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

                    const a = parseInt(responseJson.metaData.code);
                    const b = 200;

                    const aa = parseInt(responseJson.response.peserta.statusPeserta.kode);
                    const bb = 0;

                    const aaa = parseInt(responseJson.response.peserta.nik);
                    const bbb = parseInt(this.state.nik);

                    if (a === b) {
                        if (aa === bb) {
                            if (aaa === bbb) {
                                fetch(baseApi + '/user/updateProfil', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                                    },
                                    body: JSON.stringify({
                                        id: this.props.getUser.userDetails.id,
                                        jenisKelamin: this.state.jenisKelamin,
                                        statusKawin: this.state.statusKawin,
                                        tanggalLahir: this.state.tanggalLahir,
                                        // noTelpon: this.state.noTelpon,
                                        tempatLahir: this.state.tempatLahir,
                                        nama: this.state.nama,
                                        pekerjaan: this.state.pilihPekerjaan,
                                        nik: this.state.nik,
                                        pilihProvinsi: this.state.pilihProvinsi,
                                        pilihKota: this.state.pilihJenisKota + ' ' + this.state.pilihKota,
                                        pilihKecamatan: this.state.pilihKecamatan,
                                        pilihDesa: this.state.pilihDesa,
                                        pilihSuku: this.state.pilihSuku,
                                        pilihBahasa: this.state.pilihBahasa,
                                        pilihWn: this.state.pilihWn,
                                        pilihNegara: this.state.pilihNegara,
                                        alamat: this.state.alamat,
                                        noBpjs: this.state.noBpjs,
                                        agama: this.state.pilihAgama,
                                        penanggungJawab:this.state.penanggungJawab,
                                        noHpPenanggungJawab:this.state.noHpPenanggungJawab
                                    }),
                                }).then((response) => response.json()).then((responseJson) => {

                                    if (responseJson.success === true) {
                                        this.setState({
                                            isLoading: false,
                                        });
                                        showMessage({
                                            message: responseJson.message,
                                            type: 'success',
                                            position: 'bottom',
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
                                            position: 'bottom',
                                        });
                                    }
                                }).catch((error) => {
                                    this.setState({
                                        isLoading: false,
                                    });

                                    showMessage({
                                        message: responseJson.message,
                                        type: 'danger',
                                        position: 'bottom',
                                    });
                                });
                            } else {
                                this.setState({
                                    isLoading: false,
                                });
                                showMessage({
                                    message: 'Ktp anda di bpjs tidak sesuai dengan yang anda masukan',
                                    type: 'danger',
                                    position: 'bottom',
                                });

                            }


                        } else {
                            this.setState({
                                isLoading: false,
                            });

                            showMessage({
                                message: 'BPJS Anda Tidak Aktif',
                                type: 'danger',
                                position: 'bottom',
                            });
                        }

                    } else {
                        this.setState({
                            isLoading: false,
                        });
                        showMessage({
                            message: 'Nomor Yang anda masukan tidak terdaftar',
                            type: 'danger',
                            position: 'bottom',
                        });
                    }


                }).catch((error) => {

                    this.setState({
                        isLoading: false,
                    });
                    showMessage({
                        message: 'Koneksi Bermasalah',
                        type: 'danger',
                        position: 'bottom',
                    });
                });
            }
            else {


                fetch(baseApi + '/user/updateProfil', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        id: this.props.getUser.userDetails.id,
                        jenisKelamin: this.state.jenisKelamin,
                        statusKawin: this.state.statusKawin,
                        tanggalLahir: this.state.tanggalLahir,
                        // noTelpon: this.state.noTelpon,
                        tempatLahir: this.state.tempatLahir,
                        nama: this.state.nama,
                        pekerjaan: this.state.pilihPekerjaan,
                        nik: this.state.nik,
                        pilihProvinsi: this.state.pilihProvinsi,
                        pilihKota: this.state.pilihJenisKota + ' ' + this.state.pilihKota,
                        pilihKecamatan: this.state.pilihKecamatan,
                        pilihDesa: this.state.pilihDesa,
                        pilihSuku: this.state.pilihSuku,
                        pilihBahasa: this.state.pilihBahasa,
                        pilihWn: this.state.pilihWn,
                        pilihNegara: this.state.pilihNegara,
                        alamat: this.state.alamat,
                        noBpjs: this.state.noBpjs,
                        agama: this.state.pilihAgama,
                        penanggungJawab:this.state.penanggungJawab,
                        noHpPenanggungJawab:this.state.noHpPenanggungJawab
                    }),
                }).then((response) => response.json()).then((responseJson) => {

                    if (responseJson.success === true) {
                        this.setState({
                            isLoading: false,
                        });
                        showMessage({
                            message: responseJson.message,
                            type: 'success',
                            position: 'bottom',
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
                            position: 'bottom',
                        });
                    }
                }).catch((error) => {
                    this.setState({
                        isLoading: false,
                    });
                    showMessage({
                        message: error,
                        type: 'danger',
                        position: 'bottom',
                    });
                });
            }


        } else {
            showMessage({
                message: 'Isi Semua',
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
                    title={this.state.pilihKota != '' ? this.state.pilihKota : 'Pilih Kota'}
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
                            pilihJenisKota: this.state.dataKota[data].jenis,
                        });
                        this.showKecamatan(this.state.dataKota[data].name, this.state.pilihProvinsi);

                    }}
                    onRemoveItem={data => {
                        this.setState({pilihKota: ''});
                    }}
                />

                {this.isFieldInError('pilihKota') && this.getErrorsInField('pilihKota').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );


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
                    title={this.state.pilihKecamatan !== '' ? this.state.pilihKecamatan : 'Pilih Kecamatan'}
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
                        this.showDesa(this.state.dataKecamatan[data].name, this.state.pilihKota, this.state.pilihProvinsi);

                    }}
                    onRemoveItem={data => {
                        this.setState({pilihKecamatan: ''});
                    }}
                />
            </View>);


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
                    title={this.state.pilihDesa !== '' ? this.state.pilihDesa : 'Pilih Desa'}
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
                    title={this.state.pilihSuku != '' ? this.state.pilihSuku : 'Pilih Suku'}
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
                    title={this.state.pilihBahasa != '' ? this.state.pilihBahasa : 'Pilih Bahasa'}
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


                    }}
                    onRemoveItem={data => {
                        this.setState({pilihWn: ''});
                    }}
                />
                {this.isFieldInError('pilihWn') && this.getErrorsInField('pilihWn').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );

        var listViewPekerjaan = [];
        listViewPekerjaan.push(
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
                    searchPlaceHolderText="Cari Pekerjaan"
                    popupTitle="Pilih Pekerjaan"
                    title={this.state.pilihPekerjaan}
                    data={this.state.dataPekerjaan}
                    onSelect={data => {
                        this.setState({
                            pilihPekerjaan: this.state.dataPekerjaan[data].name,
                        });

                    }}
                    onRemoveItem={data => {
                        this.setState({pilihPekerjaan: ''});
                    }}
                />

                {this.isFieldInError('pilihPekerjaan') && this.getErrorsInField('pilihPekerjaan').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );


        listViewProfil1.push(
            <View>
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

                {this.state.tempatLahir !== null ? <TextInput
                    defaultValue={this.state.tempatLahir}
                    ref="tempatLahir"
                    onChangeText={(tempatLahir) => this.setState({tempatLahir})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Tempat Lahir"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                /> : <TextInput
                    ref="tempatLahir"
                    onChangeText={(tempatLahir) => this.setState({tempatLahir})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Tempat Lahirrr"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />}

                {this.isFieldInError('tempatLahir') && this.getErrorsInField('tempatLahir').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
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
                    onDateChange={(date) => {this.setState({tanggalLahir: date})}}
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
                {listViewPekerjaan}
                {listViewWargaNegara}
                {this.state.pilihWn === '' ? <View></View> : this.state.pilihWn === 'WNI' ?
                    <View>
                        {listView}
                        {this.state.pilihProvinsi !== '' ? listViewKota : <View></View>}
                        {this.state.pilihKota !== '' && this.state.pilihProvinsi !== '' ? listViewKecamatan :
                            <View></View>}
                        {this.state.pilihKecamatan !== '' && this.state.pilihKota !== '' && this.state.pilihProvinsi !== '' ? listViewDesa :
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
                    keyboardType={'numeric'}
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

                <TextInput
                    autoCapitalize='words'
                    defaultValue={this.state.penanggungJawab}
                    ref="penanggungJawab"
                    onChangeText={(penanggungJawab) => this.setState({penanggungJawab})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Penanggung Jawab"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />
                {this.isFieldInError('penanggungJawab') && this.getErrorsInField('penanggungJawab').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
                <TextInput
                    keyboardType={'numeric'}
                    defaultValue={this.state.noHpPenanggungJawab}
                    ref="penanggungJawab"
                    onChangeText={(noHpPenanggungJawab) => this.setState({noHpPenanggungJawab})}
                    style={styles.inputBox}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Nomor Hp Penanggung Jawab"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="#999999"
                />
                {this.isFieldInError('noHpPenanggungJawab') && this.getErrorsInField('noHpPenanggungJawab').map(errorMessage =>
                    <Text>{errorMessage}</Text>)}
            </View>,
        );


        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    leftComponent={
                        <Icon type='ionicon' name='arrow-back-outline' color="#fff"
                              onPress={() => Actions.pop()}/>}
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Edit Profil', style: {color: '#fff'}}}
                />
                <LoaderModal
                    loading={this.state.isLoading}/>
                {this.state.showTryAgain === true ?
                    <View style={styles.container}>
                        <Text style={{color: 'gray'}}>Koneksi Bermasalah :(</Text>
                        <TouchableOpacity style={{
                            width: 200,
                            backgroundColor: 'red',
                            borderRadius: 25,
                            marginVertical: 2,
                            paddingVertical: 13,
                        }} onPress={() => this.showData()}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}>Refresh </Text>
                        </TouchableOpacity></View> : <ScrollView style={{backgroundColor: 'white'}}>
                        {listViewProfil1}
                        <TouchableOpacity style={styles.button} onPress={this._onSubmit.bind(this)}>
                            <Text style={styles.buttonText}>Update Profil</Text>
                        </TouchableOpacity>
                    </ScrollView>}

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
