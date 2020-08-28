import React, {Component} from 'react';
import {
    Switch,
    Animated,
    Image,
    BackHandler,
    NetInfo,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput, ScrollView, ActivityIndicator, Modal, FlatList, Dimensions,
} from 'react-native';
import LoaderModal from '../../components/LoaderModal';
import ValidationComponent from 'react-native-form-validator';
import Loader from '../../components/Loader';
import {baseApi, baseApiBpjs, baseUrlFoto} from '../../service/api';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import email from 'react-native-email';
import {Icon, Header} from 'react-native-elements';
import PasswordInputText from 'react-native-hide-show-password-input';
import {
    Badge,
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
    ActionSheet,
    Card, CardItem, DatePicker, Picker, Textarea, Input, Title, Tabs, Tab, List, Thumbnail,
} from 'native-base';
import {connect} from 'react-redux';
import Select2 from 'react-native-select-two';
import Tab1 from './InputBaru';
import Tab2 from './DaftarTersimpan';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import PhotoUpload from 'react-native-photo-upload';
import moment from 'moment';
import StepIndicator from 'react-native-step-indicator';
import QRCode from 'react-native-qrcode-svg';
import Ripple from 'react-native-material-ripple';

const {height} = Dimensions.get('window');


class PendaftaranOnline extends ValidationComponent {

    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            nomorKtpBpjs: '',
            jenisRujukan: 0,
            statusIsi: 0,
            inClickNomorMR: false,
            showPassword: true,
            loading: false,
            inClickLengkapiProfil: false,
            cekNoRujukan: 0,

            dataPasien: [],
            modalVisible: false,
            modalVisibleDokter: false,
            modalVisibleBpjs: false,
            simpanFavorite: false,
            id_pasien: '',
            nomorMr: '',
            status: 'before',
            nama: '',
            jenisKelaminTampil: '',

            data: [],
            dataCaraBayar: [],
            dataRujukan: [],

            dataRujukanKontrolUlang1: [],
            dataRujukanKontrolUlang2: [],

            dataPoly: [],
            dataDokter: [],
            dataTanggal: [],
            dataJam: [
                {id: 0, name: '08:00:00 - 09:00:00', jam: '08:00:00', tersedia: 30},
                {id: 1, name: '09:00:00 - 10:00:00', jam: '09:00:00', tersedia: 30},
                {id: 2, name: '10:00:00 - 11:00:00', jam: '10:00:00', tersedia: 30},
                {id: 3, name: '11:00:00 - 12:00:00', jam: '11:00:00', tersedia: 30},
                {id: 4, name: '13:00:00 - 14:00:00', jam: '13:00:00', tersedia: 30},
                {id: 5, name: '14:00:00 - 15:00:00', jam: '14:00:00', tersedia: 30},
                {id: 6, name: '15:00:00 - 16:00:00', jam: '15:00:00', tersedia: 30},
                {id: 7, name: '16:00:00 - 17:00:00', jam: '16:00:00', tersedia: 30},
            ],

            dataRute: [],
            cekRujukan: 3,

            page: 1,
            total: 0,
            next_page_url: null,
            searchText: null,
            searchAktif: 0,

            statusLengkap: 0,

            pilihFoto: '',
            statusMendaftar: 0,
            idCaraBayar: '',
            tahunLahir: '',
            nomor_mr: '',
            nomorKtp: '',
            namaPasien: '',
            tempatLahir: '',
            tanggalLahir: '',
            jenisKelamin: '',
            jenisLayanan: '',
            tanggalMasuk: '',
            tanggalDaftar: '',
            pilihCaraBayar: '',
            pilihTanggalKunjungan: '',
            pilihPoly: '',
            caraBayar: '',
            pilihRujukan: '',
            pilihDokter: '',
            pilihNrp: '',
            pilihHari: '',
            pilihJam: '',
            pilihIdPoly: '',
            kelas: '',
            idKelas: '',
            no_jaminan: '',
            pilihJamLabel: '',
            dataRujukanBpjs: [],

            showPilihRujukan: false,
            errorKontrolUlang1: false,
            errorKontrolUlang2: false,

            switchButton: false,

            dataShuttleBus: [],
            dataShuttleBusDetail: [],

            pilihShuttleBusNama: '',
            pilihShuttleBusId: '',
            pilihShuttleBusRuteNama: '',
            pilihShuttleBusRuteId: '',
            pilihShuttleBusDetailNama: '',
            pilihShuttleBusDetailId: '',
            pilihShuttleBusDetailJam: '',
        };
    }

    componentWillReceiveProps(value) {
        if (value.nomorMr !== undefined && value.tahunLahir !== undefined) {
            this.showData();
        }
    }

    componentDidMount() {
        this.showData();

    }

    showPilihShuttleBusDetail(id_shuttle, id_trip) {
        this.setState({
            loading: true,
            dataShuttleBusDetail: [],
        });
        const url = baseApi + '/user/shuttleDetail';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_shuttle: id_shuttle,
                id_trip: id_trip,
            }),
        }).then((response) => response.json()).then((responseJson) => {

            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataShuttleBusDetail.push({
                    id: i,
                    name: a[i].rute,
                    jam:a[i].jam,
                    id_shuttle_detail: a[i].id,
                });
            }
            this.setState({
                loading: false,
            });

        }).catch((error) => {
            this.setState({
                loading: false,
            });
        });
    }

    showPilihShuttleBusRute(id_shuttle) {

        this.setState({
            loading: true,
            dataShuttleBusDetail: [],
            dataRute: [],
        });
        const url = baseApi + '/user/shuttleRute';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_shuttle: id_shuttle,
            }),
        }).then((response) => response.json()).then((responseJson) => {

            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataRute.push({
                    id: i,
                    name: a[i].nama,
                    idRute: a[i].id,
                });
            }

            console.log(a);
            this.setState({
                loading: false,
            });

        }).catch((error) => {
            this.setState({
                loading: false,
            });
        });
    }

    showData() {

        this.cekDaftar();

        var dayName = [];
        var hitung = [];
        var dataTanggalName = [];
        for (let i = 0; i < 3; i++) {
            var angka = i + 1;
            var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            var bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            var d = new Date();
            var tomorrow = new Date();

            var someDate = new Date();
            var numberOfDaysToAdd = 6;
            someDate.setDate(someDate.getDate() + angka);

            if (someDate.getDay() != 0) {
                hitung.push({
                    id: someDate.getDay(),
                });
                tomorrow.setDate(new Date().getDate() + angka);
                dataTanggalName.push({
                    name: days[someDate.getDay()] + ', ' + (tomorrow.toString().substring(8, 10)) + ' ' + bulan[someDate.getMonth()] + ' ' + someDate.getFullYear(),
                    tanggal: tomorrow,
                    hari: days[someDate.getDay()],
                });

                if (hitung.length === 3) {

                } else if (hitung.length < 3 && hitung.length > 2) {
                    tomorrow.setDate(new Date().getDate() + angka + 1);
                    dataTanggalName.push({
                        name: days[someDate.getDay() + 1] + ', ' + (tomorrow.toString().substring(8, 10)) + ' ' + bulan[someDate.getMonth()] + ' ' + someDate.getFullYear(),
                        tanggal: tomorrow,
                        hari: days[someDate.getDay() + 1],
                    });
                }
            }

        }

        for (let i = 0; i < dataTanggalName.length; i++) {
            this.state.dataTanggal.push({
                id: i,
                name: dataTanggalName[i].name,
                tanggal: dataTanggalName[i].tanggal,
                hari: dataTanggalName[i].hari,
            });
        }

        fetch(baseApi + '/user/getProfilDaftar', {
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
            if (responseJson.success === true) {
                if (parseInt(responseJson.data.no_ktp) !== 0 && responseJson.data.tempat_lahir !== '' &&
                    responseJson.data.pekerjaan !== null && responseJson.data.nama_provinsi !== null &&
                    responseJson.data.nama_kab_kota !== null && responseJson.data.nama_kecamatan !== null &&
                    responseJson.data.nama_keluranahan !== null && responseJson.data.suku !== null &&
                    responseJson.data.bahasa !== null && responseJson.data.alamat !== '' && responseJson.data.no_ktp !== null
                ) {
                    this.setState({
                        statusLengkap: 0,
                    });
                } else {
                    this.setState({
                        statusLengkap: 1,
                    });
                }
                var jenisKelaminTampil = '';
                if (parseInt(responseJson.data.jns_kelamin) === 0) {
                    jenisKelaminTampil = 'Perempuan';
                } else if (parseInt(responseJson.data.jns_kelamin) === 1) {
                    jenisKelaminTampil = 'Laki - laki';
                }
                this.setState({
                    noBpjs: responseJson.data.no_bpjs,
                    jenisKelaminTampil: jenisKelaminTampil,
                    status: 'after',
                    nomorKtp: responseJson.data.no_ktp,
                    namaPasien: responseJson.data.nama,
                    tempatLahir: responseJson.data.tempat_lahir,
                    tanggalLahir: responseJson.data.tgl_lahir,
                    jenisKelamin: responseJson.data.jns_kelamin,
                    dataPasien: [],
                    foto: responseJson.image,
                    nomorMr: responseJson.data.nomr,
                    nama: responseJson.data.nama,
                });

                if (responseJson.data.no_bpjs != 0 || responseJson.data.no_bpjs !== null) {
                    this.cekBPJS(responseJson.data.no_bpjs);
                }

                var loopStopA = false;
                var loopStopB = false;
                var loopStopC = false;

                var a = responseJson.dataPoly;
                var b = responseJson.dataBayar;
                var c = responseJson.shuttleBus;


                for (let i = 0; i < a.length; i++) {
                    this.state.dataPoly.push({
                        id: i,
                        name: a[i].poly_nama,
                        idPoly: a[i].poly_id,
                    });

                    if (a.length - 1 === i) {
                        loopStopA = true;
                    }
                }


                for (let i = 0; i < b.length; i++) {
                    this.state.dataCaraBayar.push({
                        id: i,
                        name: b[i].cara_bayar,
                        ket: b[i].KET,
                        idCaraBayar: b[i].id_cara_bayar,
                    });

                    if (b.length - 1 === i) {
                        loopStopB = true;
                    }
                }


                for (let i = 0; i < c.length; i++) {
                    this.state.dataShuttleBus.push({
                        id: i,
                        name: c[i].nama,
                        idShuttle: c[i].id,
                    });

                    if (c.length - 1 === i) {
                        loopStopC = true;
                    }
                }

                console.log(this.state.dataShuttleBus);

                if (loopStopA === true && loopStopB === true && loopStopC === true) {
                    this.setState({
                        showTryAgain: false,
                        loading: false,
                    });
                }

            } else {
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'bottom',
                });
                this.setState({
                    loading: false,
                });


            }
        }).catch((error) => {
            this.setState({
                loading: false,
            });

            this.state.message = error;
        });


    }

    cekDaftar() {
        this.setState({
            loading: true,
        });
        fetch(baseApi + '/user/cekDaftar', {
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
            if (responseJson.success === true) {
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'bottom',
                });
                this.setState({
                    loading: false,
                    statusMendaftar: 1,
                });
                Actions.pop();

            } else {
                showMessage({
                    message: responseJson.message,
                    type: 'warning',
                    position: 'bottom',
                });
                this.setState({
                    loading: false,
                    statusMendaftar: 0,
                });


            }
        }).catch((error) => {
            this.setState({
                loading: false,
            });

            this.state.message = error;
        });
    }

    onClickButtonLengkapiProfil = () => {
        this.setState({inClickLengkapiProfil: true});
        Actions.lengkapiProfil({
            id: this.state.nomorMr,
            tahunLahir: this.state.tahunLahir,
        });
        setTimeout(function () {
            this.setState({inClickLengkapiProfil: false});
        }.bind(this), 2000);
    };


    showDataDokter(id) {

        this.setState({
            loading: true,
            dataDokter: [],
        });
        const url = baseApi + '/user/polyDetailHari';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                hari: this.state.pilihHari,
                tanggalKunjungan: this.state.pilihTanggalKunjungan,
            }),
        }).then((response) => response.json()).then((responseJson) => {

            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataDokter.push({
                    id: i,
                    name: a[i].get_dokter_jadwal[0].dokter_nama,
                    nrp: a[i].get_dokter_jadwal[0].nrp,
                    foto: a[i].get_dokter_jadwal[0].dokter_fhoto,
                });
            }
            this.setState({
                loading: false,
            });

            var jam = [];
            for (let i = 0; i < responseJson.dataJam.length; i++) {
                jam.push(responseJson.dataJam[i].jam_kunjungan);
            }

            var angka = [];
            for (let i = 0; i < jam.length; i++) {

                for (let j = 0; j < this.state.dataJam.length; j++) {

                    if (this.state.dataJam[j].jam === jam[i]) {

                        this.state.dataJam[j].tersedia = this.state.dataJam[j].tersedia - (j + 1);
                        this.setState({
                            dataJam: this.state.dataJam,
                        });

                    }
                }
            }


        }).catch((error) => {
            this.setState({
                loading: false,
            });
        });
    }

    showDataRujukan() {
        this.setState({
            loading: true,
        });
        const url = baseApi + '/user/rujukan';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {

            var a = responseJson.data;
            var temp = [];
            for (let i = 0; i < a.length; i++) {
                if (a[i].jenis !== 0) {
                    temp.push({
                        name: a[i].rujukan,
                        jenis: a[i].jenis,
                    });
                }
            }

            for (let i = 0; i < temp.length; i++) {
                this.state.dataRujukan.push({
                    id: i,
                    name: temp[i].name,
                    jenis: temp[i].jenis,
                });
            }
            this.setState({
                loading: false,
            });


        }).catch((error) => {

        });
    }

    showPilihRujukan(jenis) {
        if (jenis === 1) {
            this.setState({
                loading: true,
            });
            const url = baseApiBpjs + 'list_rujukan';
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': '00004',
                    'password': '551UU1BJ',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                const a = parseInt(responseJson.metaData.code);
                const b = 200;
                if (a === b) {
                    this.setState({
                        loading: false,
                        cekRujukan: 1,
                        dataRujukanBpjs: responseJson.response.rujukan,
                    });
                } else {

                    this.setState({
                        cekRujukan: 3,
                        loading: false,
                    });
                    showMessage({
                        message: responseJson.metaData.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            });
        } else if (jenis === 2) {
            this.setState({
                loading: true,
            });
            const url = baseApiBpjs + 'list_rujukan/rs';
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': '00004',
                    'password': '551UU1BJ',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                const a = parseInt(responseJson.metaData.code);
                const b = 200;
                if (a === b) {
                    this.setState({
                        loading: false,
                        cekRujukan: 1,
                        dataRujukanBpjs: responseJson.response.rujukan,
                    });
                } else {

                    this.setState({
                        loading: false,
                        cekRujukan: 3,
                    });
                    showMessage({
                        message: responseJson.metaData.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            });
        } else if (jenis === 3) {
            this.setState({
                loading: true,
            });
            const url = baseApiBpjs + 'list_rujukan';
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': '00004',
                    'password': '551UU1BJ',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                const a = parseInt(responseJson.metaData.code);
                const b = 200;
                if (a === b) {
                    if (responseJson.response.rujukan !== null) {
                        this.setState({
                            loading: false,
                            dataRujukanKontrolUlang1: responseJson.response.rujukan,
                            cekRujukan: 1,
                            errorKontrolUlang1: false,
                        });
                    } else {
                        this.setState({
                            loading: false,
                            errorKontrolUlang1: true,
                            dataRujukanKontrolUlang1: [],
                        });
                    }
                } else {

                    this.setState({
                        loading: false,
                        errorKontrolUlang1: true,
                    });
                    showMessage({
                        message: responseJson.metaData.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            }).catch(error => {
                this.setState({
                    loading: false,
                    errorKontrolUlang1: true,
                });
            });


            this.setState({
                loading: true,
            });
            const url1 = baseApiBpjs + 'list_rujukan/rs';
            fetch(url1, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': '00004',
                    'password': '551UU1BJ',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson.response.rujukan);
                const a = parseInt(responseJson.metaData.code);
                const b = 200;
                if (a === b) {
                    if (responseJson.response.rujukan !== null) {
                        this.setState({
                            loading: false,
                            cekRujukan: 1,
                            errorKontrolUlang2: false,
                            dataRujukanKontrolUlang2: responseJson.response.rujukan,
                        });
                    } else {
                        this.setState({
                            loading: false,
                            errorKontrolUlang2: true,
                            dataRujukanKontrolUlang2: [],
                        });
                    }
                } else {
                    this.setState({
                        loading: false,
                        errorKontrolUlang2: false,
                    });
                }
            }).catch(error => {
                this.setState({
                    loading: false,
                    errorKontrolUlang2: true,
                });
            });

        }


    }

    handleLoadMore = () => {

        if (this.state.searchAktif === 0 && this.state.next_page_url != null) {
            this.setState(
                {page: this.state.page + 1, isLoading: true},
                this.getData,
            );
        }

    };
    renderFooter = () => {
        return (
            this.state.isLoading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View> : null
        );
    };

    _onSubmitFinish() {
        if (this.state.caraBayar === 'Umum') {
            this.validate({
                pilihCaraBayar: {required: true},
                pilihPoly: {required: true},
                pilihNrp: {required: true},
                pilihHari: {required: true},
                pilihJam: {required: true},
            });
            if (this.isFormValid()) {
                this.setState({
                    loading: true,
                });
                fetch(baseApi + '/user/daftar', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        idUser: this.props.getUser.userDetails.id,
                        nomorMr: this.state.nomor_mr,
                        nomorKtp: this.state.nomorKtp,
                        namaPasien: this.state.namaPasien,
                        tempatLahir: this.state.tempatLahir,
                        tanggalLahir: this.state.tanggalLahir,
                        jenisKelamin: this.state.jenisKelamin,
                        jamKunjungan: this.state.pilihJam,
                        pilihCaraBayar: this.state.pilihCaraBayar,
                        pilihJamLabel: this.state.pilihJamLabel,
                        tanggalKunjungan: this.state.pilihTanggalKunjungan,
                        namaRuang: this.state.pilihPoly,
                        idRuang: this.state.pilihIdPoly,
                        caraBayar: this.state.caraBayar,
                        idCaraBayar: this.state.idCaraBayar,
                        pilihRujukan: this.state.pilihRujukan,
                        pilihDokter: this.state.pilihDokter,
                        pilihNrp: this.state.pilihNrp,
                        npBpjs: null,
                        tanggalDaftar: new Date(),

                        pilihShuttleBusDetailJam:this.state.pilihShuttleBusDetailJam,
                        pilihShuttleBusNama: this.state.pilihShuttleBusNama,
                        pilihShuttleBusId: this.state.pilihShuttleBusId,
                        pilihShuttleBusRuteNama: this.state.pilihShuttleBusRuteNama,
                        pilihShuttleBusRuteId: this.state.pilihShuttleBusRuteId,
                        pilihShuttleBusDetailNama: this.state.pilihShuttleBusDetailNama,
                        pilihShuttleBusDetailId: this.state.pilihShuttleBusDetailId,
                    }),
                }).then((response) => response.json()).then((responseJson) => {
                    if (responseJson.success === true) {
                        showMessage({
                            message: responseJson.message,
                            type: 'info',
                            position: 'bottom',
                        });
                        this.setState({
                            loading: false,
                        });

                        Actions.pop({
                            refresh: {
                                nomorAntrian: responseJson.data.nomor_daftar,
                                tanggalKunjungan: responseJson.data.tanggal_kunjungan,
                                jamKunjungan: responseJson.data.jam_kunjungan,
                                jamKunjunganLabel: responseJson.data.jam_kunjunganLabel,
                                jamKunjunganAntrian: responseJson.data.jam_kunjunganAntrian,
                                namaPasien: responseJson.data.nama_pasien,
                                namaRuang: responseJson.data.nama_ruang,
                                caraBayar: responseJson.data.cara_bayar,
                                tanggalMendaftar: responseJson.data.tanggal_daftar,
                                namaDokter: responseJson.data.namaDokterJaga,
                                tanggalLahir: responseJson.data.tgl_lahir,
                                nomorMr: responseJson.data.nomr,
                                jenisKelamin: responseJson.data.jns_kelamin,
                                statusBerobat: responseJson.data.status_berobat,
                            },
                        });

                    } else {
                        showMessage({
                            message: responseJson.message,
                            type: 'danger',
                            position: 'bottom',
                        });
                        this.setState({
                            loading: false,
                        });

                    }
                }).catch((error) => {
                    this.setState({
                        loading: false,
                    });

                    this.state.message = error;
                });
            }
        } else {

            this.validate({
                pilihCaraBayar: {required: true},
                pilihPoly: {required: true},
                pilihNrp: {required: true},
                pilihHari: {required: true},
                pilihJam: {required: true},
                noBpjs: {required: true},
                no_jaminan: {required: true},
                pilihRujukan: {required: true},
            });

            if (this.isFormValid()) {
                if (this.state.nomorKtpBpjs === this.state.nomorKtp) {
                    this.setState({
                        loading: true,
                    });
                    fetch(baseApi + '/user/daftar', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                        },
                        body: JSON.stringify({
                            idUser: this.props.getUser.userDetails.id,
                            nomorMr: this.state.nomor_mr,
                            nomorKtp: this.state.nomorKtp,
                            namaPasien: this.state.namaPasien,
                            tempatLahir: this.state.tempatLahir,
                            tanggalLahir: this.state.tanggalLahir,
                            jenisKelamin: this.state.jenisKelamin,
                            jamKunjungan: this.state.pilihJam,
                            pilihCaraBayar: this.state.pilihCaraBayar,
                            tanggalKunjungan: this.state.pilihTanggalKunjungan,
                            namaRuang: this.state.pilihPoly,
                            idRuang: this.state.pilihIdPoly,
                            caraBayar: this.state.caraBayar,
                            pilihJamLabel: this.state.pilihJamLabel,
                            idCaraBayar: this.state.idCaraBayar,
                            pilihRujukan: this.state.pilihRujukan,
                            pilihDokter: this.state.pilihDokter,
                            pilihNrp: this.state.pilihNrp,
                            noBpjs: this.state.noBpjs,
                            nomorRujukan: this.state.no_jaminan,
                            kelas: this.state.kelas,
                            idKelas: this.state.idKelas,
                            tanggalDaftar: new Date(),
                        }),
                    }).then((response) => response.json()).then((responseJson) => {
                        if (responseJson.success === true) {
                            showMessage({
                                message: responseJson.message,
                                type: 'info',
                                position: 'bottom',
                            });
                            this.setState({
                                loading: false,
                            });

                            Actions.pop({
                                refresh: {
                                    nomorAntrian: responseJson.data.nomor_daftar,
                                    tanggalKunjungan: responseJson.data.tanggal_kunjungan,
                                    jamKunjungan: responseJson.data.jam_kunjungan,
                                    jamKunjunganLabel: responseJson.data.jam_kunjunganLabel,
                                    jamKunjunganAntrian: responseJson.data.jam_kunjunganAntrian,
                                    namaPasien: responseJson.data.nama_pasien,
                                    namaRuang: responseJson.data.nama_ruang,
                                    caraBayar: responseJson.data.cara_bayar,
                                    tanggalMendaftar: responseJson.data.tanggal_daftar,
                                    namaDokter: responseJson.data.namaDokterJaga,
                                    tanggalLahir: responseJson.data.tgl_lahir,
                                    nomorMr: responseJson.data.nomr,
                                    jenisKelamin: responseJson.data.jns_kelamin,
                                    statusBerobat: responseJson.data.status_berobat,
                                },
                            });

                        } else {
                            showMessage({
                                message: responseJson.message,
                                type: 'danger',
                                position: 'bottom',
                            });
                            this.setState({
                                loading: false,
                            });

                        }
                    }).catch((error) => {
                        this.setState({
                            loading: false,
                        });

                        this.state.message = error;
                    });
                } else {
                    showMessage({
                        message: 'Nomor KTP anda dengan yang di BPJS tidak sama',
                        type: 'info',
                        position: 'bottom',
                    });
                }
            }
        }


    }

    toggleSwitch() {
        this.setState({simpanFavorite: !this.state.simpanFavorite});
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

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,

        });

    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    setModalUnvisible1(visible) {
        this.setState({
            modalVisible: visible,
            nomor_mr: '',
            statusIsi: 0,
            status: 'before',
            nomorMr: '',
            nama: '',
        });
    }

    showModalBpjs(visible) {
        this.setState({
            modalVisibleBpjs: visible,

        });

    }

    setModalUnvisibleBpjs(visible) {
        this.setState({
            modalVisibleBpjs: visible,
        });
    }

    showModalDokter(visible) {
        this.setState({
            modalVisibleDokter: visible,

        });
    }

    setModalUnvisibleDokter(visible) {
        this.setState({
            modalVisibleDokter: visible,
        });
    }


    pilihJam(jam, name) {
        this.setState({
            pilihJam: jam,
            pilihJamLabel: name,
            pilihDokter: this.state.dataDokter[0].name,
            pilihNrp: this.state.dataDokter[0].nrp,
            pilihFoto: this.state.dataDokter[0].foto,
        });
        this.setModalUnvisibleDokter(!this.state.modalVisibleDokter);
    }

    pilihJamWarning() {
        showMessage({
            message: 'Jam yang anda pilih sudah penuh',
            type: 'danger',
            position: 'bottom',
        });
    }

    pilihNoRujukan(data) {
        const url = baseApiBpjs + 'rujukan';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': '00004',
                'password': '551UU1BJ',
                'param': 'norujukan',
                'data': data.noKunjungan,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.metaData.code === '200') {

                const tglKunjungan = data.tglKunjungan;
                const tahun = tglKunjungan.substring(0, 4);
                const bulan = tglKunjungan.substring(5, 7);
                const hari = tglKunjungan.substring(8, 10);
                const oneDay = 24 * 60 * 60 * 1000;
                const firstDate = new Date();
                const secondDate = new Date(tahun, bulan, hari);

                const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

                if (diffDays <= 90) {
                    this.setState({
                        kelas: data.peserta.hakKelas.keterangan,
                        idKelas: data.peserta.hakKelas.kode,
                        no_jaminan: data.noKunjungan,
                        cekRujukan: 2,
                    });
                    this.setModalUnvisibleBpjs(!this.state.modalVisibleBpjs);
                    showMessage({
                        message: 'Rujukan Anda Berlaku',
                        type: 'warning',
                        position: 'bottom',
                    });
                } else {
                    this.setModalUnvisibleBpjs(!this.state.modalVisibleBpjs);
                    showMessage({
                        message: 'Rujukan Anda Tidak Berlaku',
                        type: 'danger',
                        position: 'bottom',
                    });
                }

            } else {
                showMessage({
                    message: responseJson.metaData.message,
                    type: 'danger',
                    position: 'bottom',
                });
            }
        });
    }


    renderRowDokterJam = ({item}) => {
        return (
            <View>
                <List>
                    <ListItem onPress={() => this.pilihJam(item.jam, item.name)} thumbnail>
                        <Left>
                            <Text>Jam</Text>
                        </Left>
                        <Body>
                            <Text>{item.name}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity
                                onPress={() => this.pilihJam(item.jam, item.name)}><Text>Pilih</Text></TouchableOpacity>
                        </Right>
                    </ListItem>
                </List>
            </View>);
    };

    renderRowDokter = ({item}) => {

        return (
            <View>
                <List>
                    <ListItem thumbnail>
                        <Left>
                            <Thumbnail source={
                                item.foto != null ?
                                    {uri: baseUrlFoto + 'dokter/' + item.foto} :
                                    require('../../images/dokter.png')
                            }/>
                        </Left>
                        <Body>
                            <Text>Nama</Text>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>{item.name}</Text>
                            </View>
                        </Body>
                        <Right>
                            <Text>NRP</Text>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>{item.nrp}</Text>
                            </View>
                        </Right>
                    </ListItem>
                    <FlatList
                        renderItem={this.renderRowDokterJam}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={this.renderFooter}
                        data={this.state.dataJam}/>
                </List>
            </View>);
    };

    cekBPJS(bpjs) {
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
                'data': bpjs,
            }),
        }).then((response) => response.json()).then((responseJson) => {

            const a = parseInt(responseJson.metaData.code);
            const b = 200;

            const aa = parseInt(responseJson.response.peserta.statusPeserta.kode);
            const bb = 0;

            const aaa = parseInt(responseJson.response.peserta.nik);
            const bbb = parseInt(this.state.nomorKtp);

            if (a === b) {
                if (aa === bb) {
                    if (aaa === bbb) {
                        this.setState({
                            nomorKtpBpjs: responseJson.response.peserta.nik,
                        });
                        this.setState({
                            showPilihRujukan: true,
                        });
                        showMessage({
                            message: 'BPJS anda aktif',
                            type: 'warning',
                            position: 'bottom',
                        });
                    } else {
                        showMessage({
                            message: 'No KTP Anda tidak sesuai dengan yang dibpjs',
                            type: 'danger',
                            position: 'bottom',
                        });
                    }
                } else {
                    showMessage({
                        message: 'BPJS Anda tidak aktif',
                        type: 'danger',
                        position: 'bottom',
                    });

                }

            }
        }).catch(error => {
            showMessage({
                message: 'Jaringan BPJS Sedang Bermasalah',
                type: 'danger',
                position: 'bottom',
            });
        });
    }

    GetValueFunction = (ValueHolder) => {
        var Value = ValueHolder.length;
        if (Value === 13) {

            this.setState({
                noBpjs: ValueHolder,
            });
            this.cekBPJS(ValueHolder);
        } else if (Value !== 13) {
            showMessage({
                message: 'Masukan no bpjs yang valid',
                type: 'danger',
                position: 'bottom',
            });
        }

    };

    toggleSwitch = value => {
        //onValueChange of the switch this function will be called
        this.setState({switchButton: value});
        //state changes according to switch
        //which will result in re-render the text
    };

    renderRujukanBpjs = ({item, index}) => {
        return (
            <View>
                <Body>
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                        <Text note>{item.noKunjungan}</Text>
                    </View>
                </Body>
                <List>
                    <ListItem onPress={() => {
                        this.pilihNoRujukan(item);
                    }}>
                        <Body>
                            <Text>Nama</Text>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text style={{color: 'gray'}}>Tgl Kunjungan</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text style={{color: 'gray'}}>No Kartu</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text style={{color: 'gray'}}>PPK Perujuk</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text style={{color: 'gray'}}>Sub Spesialis</Text>
                            </View>
                        </Body>
                        <Body>
                            <Text>{item.peserta.nama}</Text>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>{item.tglKunjungan}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>{item.peserta.noKartu}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>{item.provPerujuk.nama}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>{item.poliRujukan.nama}</Text>
                            </View>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.pilihNoRujukan(item);
                            }}>
                                <Text>Pilih</Text>
                            </Button>
                        </Right>
                    </ListItem>
                </List></View>);
    };

    render() {

        const {showAlert} = this.state;
        const {onChange} = this.props;

        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    leftComponent={
                        <Ripple onPress={() => Actions.pop()}>
                            <Icon type='ionicon' name='arrow-back-outline' color='#fff'
                            /></Ripple>}
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Pendaftaran', style: {color: '#fff'}}}
                />
                <LoaderModal
                    loading={this.state.loading}/>
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
                        </TouchableOpacity></View> :
                    <ScrollView>
                        {this.state.statusLengkap === 1 ?
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity style={styles.button}
                                                  onPress={!this.state.inClickLengkapiProfil ? this.onClickButtonLengkapiProfil : null}>
                                    <Text style={styles.buttonText}>Lengkapi Profil Anda Terlebih
                                        Dahulu</Text></TouchableOpacity>
                            </View> :
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{height: 200, paddingVertical: 20}}>
                                    <Grid>
                                        <Col style={{width: 120, height: 100}}>
                                            <Image
                                                key={new Date()}
                                                style={{
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: 75,
                                                }}
                                                resizeMode='cover'
                                                source={{uri: this.state.foto}}
                                            />
                                        </Col>
                                        <Col style={{width: 225, height: 250}}>
                                            <List>
                                                <ListItem>
                                                    <Left>
                                                        <Text>Nama</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text>{this.state.namaPasien}</Text>
                                                    </Body>
                                                </ListItem>
                                                <ListItem>
                                                    <Left>
                                                        <Text>Nomor MR</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text>{this.state.nomorMr}</Text>
                                                    </Body>
                                                </ListItem>
                                                <ListItem>
                                                    <Left>
                                                        <Text>Tanggal Lahir</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text>{this.state.tanggalLahir}</Text>
                                                    </Body>
                                                </ListItem>
                                                <ListItem>
                                                    <Left>
                                                        <Text>Jenis Kelamin</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text note>{this.state.jenisKelaminTampil}</Text>
                                                    </Body>
                                                </ListItem>
                                            </List>
                                        </Col>
                                    </Grid>

                                </View>
                                <View style={{marginBottom: 10, marginTop: 65, justifyContent: 'center'}}>
                                    {this.state.statusLengkap === 1 ?
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity style={styles.button}
                                                              onPress={!this.state.inClickLengkapiProfil ? this.onClickButtonLengkapiProfil : null}>
                                                <Text style={styles.buttonText}>Lengkapi Profil Anda Terlebih
                                                    Dahulu</Text></TouchableOpacity>
                                        </View> :
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Select2 placeholderTextColor="#ffffff"
                                                     listEmptyTitle="Tidak ada data"
                                                     cancelButtonText="Keluar"
                                                     selectButtonText="Pilih"
                                                     isSelectSingle
                                                     selectedTitleStyle={{color: 'white'}}
                                                     style={styles.inputBox}
                                                     colorTheme="#1da30b"
                                                     searchPlaceHolderText="Cari Tanggal Kunjungan"
                                                     popupTitle="Pilih Tanggal Kunjungan"
                                                     title="Pilih Tanggal Kunjungan"
                                                     data={this.state.dataTanggal}
                                                     onSelect={data => {
                                                         this.setState({
                                                             tanggalMasuk: this.state.dataTanggal[data].name,
                                                             pilihTanggalKunjungan: this.state.dataTanggal[data].tanggal,
                                                             pilihHari: this.state.dataTanggal[data].hari,
                                                         });
                                                     }}
                                                     onRemoveItem={data => {
                                                         this.setState({
                                                             pilihCaraBayar: '',
                                                             tanggalMasuk: '',
                                                             pilihHari: '',
                                                         });
                                                     }}
                                            />

                                            {this.isFieldInError('pilihHari') && this.getErrorsInField('pilihHari').map(errorMessage =>
                                                <Text>{errorMessage}</Text>)}
                                            <Select2 placeholderTextColor="#ffffff"
                                                     listEmptyTitle="Tidak ada data"
                                                     cancelButtonText="Keluar"
                                                     selectButtonText="Pilih"
                                                     isSelectSingle
                                                     selectedTitleStyle={{color: 'white'}}
                                                     style={styles.inputBox}
                                                     colorTheme="#1da30b"
                                                     searchPlaceHolderText="Cari Pilih Bayar Anda"
                                                     popupTitle="Pilih Cara Bayar"
                                                     title="Pilih Cara Bayar"
                                                     data={this.state.dataCaraBayar}
                                                     onSelect={data => {
                                                         this.setState({
                                                             pilihCaraBayar: this.state.dataCaraBayar[data].name,
                                                             caraBayar: this.state.dataCaraBayar[data].ket,
                                                             idCaraBayar: this.state.dataCaraBayar[data].idCaraBayar,
                                                         });

                                                         if (this.state.dataCaraBayar[data].ket === 'BPJS') {
                                                             this.showDataRujukan();
                                                         }
                                                     }}
                                                     onRemoveItem={data => {
                                                         this.setState({pilihCaraBayar: ''});
                                                     }}
                                            />
                                            {this.isFieldInError('pilihCaraBayar') && this.getErrorsInField('pilihCaraBayar').map(errorMessage =>
                                                <Text>{errorMessage}</Text>)}
                                            {this.state.caraBayar === 'UMUM' ?
                                                <View></View> :
                                                this.state.caraBayar === 'BPJS' ?
                                                    <View>
                                                        <TextInput
                                                            keyboardType={'numeric'}
                                                            placeholder="Masukan No BPJS"
                                                            onChangeText={ValueHolder => this.GetValueFunction(ValueHolder)}
                                                            defaultValue={this.state.noBpjs}
                                                            ref="noBpjs"
                                                            pointerEvents="none"
                                                            style={styles.inputBox}
                                                            underlineColorAndroid="rgba(0,0,0,0)"
                                                            placeholderTextColor="rgba(255,255,255,0.8)"
                                                            selectionColor="#999999"
                                                        />
                                                        {this.state.showPilihRujukan === true ?
                                                            <Select2 placeholderTextColor="#ffffff"
                                                                     listEmptyTitle="Tidak ada data"
                                                                     cancelButtonText="Keluar"
                                                                     selectButtonText="Pilih"
                                                                     isSelectSingle
                                                                     selectedTitleStyle={{color: 'white'}}
                                                                     style={styles.inputBox}
                                                                     colorTheme="#1da30b"
                                                                     searchPlaceHolderText="Cari Pilih Rujukan"
                                                                     popupTitle="Pilih Rujukan"
                                                                     title="Pilih Rujukan"
                                                                     data={this.state.dataRujukan}
                                                                     onSelect={data => {
                                                                         this.setState({
                                                                             pilihRujukan: this.state.dataRujukan[data].name,
                                                                             jenisRujukan: this.state.dataRujukan[data].jenis,
                                                                         });
                                                                         this.showPilihRujukan(this.state.dataRujukan[data].jenis);
                                                                     }}
                                                                     onRemoveItem={data => {
                                                                         this.setState({pilihRujukan: ''});
                                                                     }}
                                                            /> : <View></View>}

                                                        {this.state.cekRujukan === 0 ?
                                                            <View>
                                                                <List>
                                                                    <ListItem>
                                                                        <Left>
                                                                            <Text>No Rujukan</Text>
                                                                        </Left>
                                                                        <Body>
                                                                            <Text note>{this.state.no_jaminan}</Text>
                                                                        </Body>
                                                                    </ListItem>
                                                                </List>
                                                            </View> : this.state.cekRujukan === 1 ?
                                                                <View>
                                                                    <TouchableOpacity
                                                                        style={styles.buttonModalInputText}
                                                                        onPress={() => this.showModalBpjs(true)}>
                                                                        <Text style={styles.buttonText}>Pilih
                                                                            Rujukan</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                : this.state.cekRujukan === 2 ?
                                                                    <View>
                                                                        <TouchableOpacity
                                                                            style={styles.buttonModalInputText}
                                                                            onPress={() => this.showModalBpjs(true)}>
                                                                            <Text style={styles.buttonText}>Pilih
                                                                                Rujukan</Text>
                                                                        </TouchableOpacity>
                                                                        <List>
                                                                            <ListItem>
                                                                                <Left>
                                                                                    <Text>No Rujukan</Text>
                                                                                </Left>
                                                                                <Body>
                                                                                    <Text
                                                                                        note>{this.state.no_jaminan}</Text>
                                                                                </Body>
                                                                            </ListItem>
                                                                        </List>
                                                                    </View>
                                                                    : this.state.cekRujukan === 3 ? <View></View> :
                                                                        <View></View>}


                                                    </View>
                                                    :
                                                    <View></View>}
                                            {this.isFieldInError('pilihRujukan') && this.getErrorsInField('pilihRujukan').map(errorMessage =>
                                                <Text>{errorMessage}</Text>)}
                                            <Select2 placeholderTextColor="#ffffff"
                                                     listEmptyTitle="Tidak ada data"
                                                     cancelButtonText="Keluar"
                                                     selectButtonText="Pilih"
                                                     isSelectSingle
                                                     selectedTitleStyle={{color: 'white'}}
                                                     style={styles.inputBox}
                                                     colorTheme="#1da30b"
                                                     searchPlaceHolderText="Cari Poly"
                                                     popupTitle="Pilih Poly"
                                                     title="Pilih Poly"
                                                     data={this.state.dataPoly}
                                                     onSelect={data => {
                                                         this.setState({
                                                             pilihPoly: this.state.dataPoly[data].name,
                                                             pilihIdPoly: this.state.dataPoly[data].idPoly,
                                                             dataDokter: [],
                                                             pilihDokter: '',
                                                             pilihJam: '',
                                                         });
                                                         this.showDataDokter(this.state.dataPoly[data].idPoly);
                                                     }}
                                                     onRemoveItem={data => {
                                                         this.setState({pilihPoly: ''});
                                                     }}
                                            />
                                            {this.isFieldInError('pilihPoly') && this.getErrorsInField('pilihPoly').map(errorMessage =>
                                                <Text>{errorMessage}</Text>)}
                                            {this.state.pilihPoly !== '' && this.state.pilihTanggalKunjungan !== '' ?
                                                <View>
                                                    {this.state.pilihJam === '' ?
                                                        <View>
                                                            <TouchableOpacity style={styles.buttonModalInputText}
                                                                              onPress={() => this.showModalDokter(true)}>
                                                                <Text style={styles.buttonText}>Pilih Dokter</Text>
                                                            </TouchableOpacity>
                                                        </View> :
                                                        <View>
                                                            <TouchableOpacity style={styles.buttonModalInputText}
                                                                              onPress={() => this.showModalDokter(true)}>
                                                                <Text style={styles.buttonText}>Pilih Dokter</Text>
                                                            </TouchableOpacity>
                                                            <View>
                                                                <List>
                                                                    <ListItem thumbnail>
                                                                        <Left>
                                                                            <Thumbnail source={
                                                                                this.state.pilihFoto != null ?
                                                                                    {uri: baseUrlFoto + 'dokter/' + this.state.pilihFoto} :
                                                                                    require('../../images/dokter.png')
                                                                            }/>
                                                                        </Left>
                                                                        <Body>
                                                                            <Text note>{this.state.pilihNrp}</Text>
                                                                            <View style={{
                                                                                flex: 1,
                                                                                flexDirection: 'row',
                                                                                marginTop: 10,
                                                                            }}>
                                                                                <Text
                                                                                    note>{this.state.pilihDokter}</Text>
                                                                            </View>
                                                                        </Body>
                                                                        <Right>
                                                                            <Text>{this.state.pilihJam}</Text>
                                                                        </Right>
                                                                    </ListItem>
                                                                </List>
                                                            </View>
                                                        </View>}

                                                </View> : <View></View>}
                                            <View style={{marginTop:20}}>
                                                <View>
                                                <Text>Ingin Menggunakan Shuttle Bus ?</Text>
                                                </View>
                                                <View>
                                                <ListItem>
                                                    <Left>
                                                        {this.state.switchButton ? <Text>Ya</Text> : <Text>Tidak</Text>}
                                                    </Left>
                                                    <Right>
                                                        <Switch
                                                            trackColor={{false: '#767577', true: '#81b0ff'}}
                                                            thumbColor={this.state.switchButton ? '#f5dd4b' : '#f4f3f4'}
                                                            ios_backgroundColor="#3e3e3e"
                                                            onValueChange={this.toggleSwitch}
                                                            value={this.state.switchButton}
                                                        />
                                                    </Right>
                                                </ListItem>
                                                </View>
                                            </View>
                                            {
                                                this.state.switchButton ?
                                                    <View>
                                                        <Select2 placeholderTextColor="#ffffff"
                                                                 listEmptyTitle="Tidak ada data"
                                                                 cancelButtonText="Keluar"
                                                                 selectButtonText="Pilih"
                                                                 isSelectSingle
                                                                 selectedTitleStyle={{color: 'white'}}
                                                                 style={styles.inputBox}
                                                                 colorTheme="#1da30b"
                                                                 searchPlaceHolderText="Cari Rute Shuttle Bus"
                                                                 popupTitle="Pilih Rute Shuttle Bus"
                                                                 title="Pilih Rute Shuttle Bus"
                                                                 data={this.state.dataShuttleBus}
                                                                 onSelect={data => {
                                                                     this.setState({
                                                                         pilihShuttleBusNama: this.state.dataShuttleBus[data].name,
                                                                         pilihShuttleBusId: this.state.dataShuttleBus[data].idShuttle,
                                                                     });
                                                                     this.showPilihShuttleBusRute(this.state.dataShuttleBus[data].idShuttle);

                                                                 }}
                                                                 onRemoveItem={data => {
                                                                     this.setState({
                                                                         pilihShuttleBusNama: '',
                                                                         pilihShuttleBusId: '',
                                                                         pilihShuttleBusRuteNama: '',
                                                                         pilihShuttleBusRuteId: '',
                                                                         pilihShuttleBusDetailNama: '',
                                                                         pilihShuttleBusDetailId: '',
                                                                     });
                                                                 }}
                                                        />
                                                        {
                                                            this.state.dataRute.length !== 0 ?
                                                                <View>
                                                                    <Select2 placeholderTextColor="#ffffff"
                                                                             listEmptyTitle="Tidak ada data"
                                                                             cancelButtonText="Keluar"
                                                                             selectButtonText="Pilih"
                                                                             isSelectSingle
                                                                             selectedTitleStyle={{color: 'white'}}
                                                                             style={styles.inputBox}
                                                                             colorTheme="#1da30b"
                                                                             searchPlaceHolderText="Cari Tanggal Kunjungan"
                                                                             popupTitle="Pilih Jam Keberangkatan"
                                                                             title="Pilih Jam Keberangkatan"
                                                                             data={this.state.dataRute}
                                                                             onSelect={data => {
                                                                                 this.setState({
                                                                                     pilihShuttleBusRuteNama: this.state.dataRute[data].name,
                                                                                     pilihShuttleBusRuteId: this.state.dataRute[data].idRute,
                                                                                 });
                                                                                 this.showPilihShuttleBusDetail(this.state.pilihShuttleBusId, this.state.dataRute[data].idRute);

                                                                             }}
                                                                             onRemoveItem={data => {
                                                                                 this.setState({
                                                                                     pilihShuttleBusRuteNama: '',
                                                                                     pilihShuttleBusRuteId: '',
                                                                                     pilihShuttleBusDetailNama: '',
                                                                                     pilihShuttleBusDetailId: '',
                                                                                     pilihShuttleBusDetailJam:'',
                                                                                 });
                                                                             }}
                                                                    />
                                                                    {
                                                                        this.state.dataShuttleBusDetail.length !== 0 ?
                                                                            <View>
                                                                                <Select2 placeholderTextColor="#ffffff"
                                                                                         listEmptyTitle="Tidak ada data"
                                                                                         cancelButtonText="Keluar"
                                                                                         selectButtonText="Pilih"
                                                                                         isSelectSingle
                                                                                         selectedTitleStyle={{color: 'white'}}
                                                                                         style={styles.inputBox}
                                                                                         colorTheme="#1da30b"
                                                                                         searchPlaceHolderText="Cari Pos Keberangkatan"
                                                                                         popupTitle="Pilih Pos Keberanglantan"
                                                                                         title="Pilih Pos Keberanglantan"
                                                                                         data={this.state.dataShuttleBusDetail}
                                                                                         onSelect={data => {
                                                                                             this.setState({
                                                                                                 pilihShuttleBusDetailNama: this.state.dataShuttleBusDetail[data].name,
                                                                                                 pilihShuttleBusDetailId: this.state.dataShuttleBusDetail[data].id_shuttle_detail,
                                                                                                 pilihShuttleBusDetailJam:this.state.dataShuttleBusDetail[data].jam,
                                                                                             });

                                                                                         }}
                                                                                         onRemoveItem={data => {
                                                                                             this.setState({
                                                                                                 pilihShuttleBusDetailNama: '',
                                                                                                 pilihShuttleBusDetailId: '',
                                                                                                 pilihShuttleBusDetailJam:'',
                                                                                             });
                                                                                         }}
                                                                                />
                                                                            </View>
                                                                            :
                                                                            <View></View>
                                                                    }
                                                                </View>
                                                                :
                                                                <View></View>
                                                        }
                                                    </View> :
                                                    <View>

                                                    </View>
                                            }

                                            <TouchableOpacity style={styles.button}
                                                              onPress={this._onSubmitFinish.bind(this)}>
                                                <Text style={styles.buttonText}>Go Daftar</Text>
                                            </TouchableOpacity>
                                            <Modal
                                                onSwipeComplete={() => {
                                                    this.setModalUnvisibleBpjs(!this.state.modalVisibleBpjs);
                                                }}
                                                scrollHorizontal
                                                propagateSwipe
                                                swipeDirection={['down']}
                                                swipearea={50}
                                                onRequestClose={() => {
                                                    this.setModalUnvisibleBpjs(!this.state.modalVisibleBpjs);
                                                }}
                                                animationType="slide"
                                                visible={this.state.modalVisibleBpjs}
                                            >
                                                <Container
                                                    style={{margin: 0, marginBottom: 0, backgroundColor: '#fff'}}>
                                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                                        <Content style={{margin: 5}}>
                                                            {this.state.jenisRujukan === 1 || this.state.jenisRujukan === 2 ?
                                                                <View>
                                                                    <FlatList
                                                                        renderItem={this.renderRujukanBpjs}
                                                                        keyExtractor={(item, index) => index.toString()}
                                                                        ListFooterComponent={this.renderFooter}
                                                                        data={this.state.dataRujukanBpjs}/>
                                                                </View> :
                                                                <View>
                                                                    <View style={{borderBottomWidth: 2}}>
                                                                        <Text>Faskes 1</Text>
                                                                        {this.state.errorKontrolUlang1 === false ?
                                                                            <FlatList
                                                                                renderItem={this.renderRujukanBpjs}
                                                                                keyExtractor={(item, index) => index.toString()}
                                                                                ListFooterComponent={this.renderFooter}
                                                                                data={this.state.dataRujukanKontrolUlang1}/> :
                                                                            <View><Text>Tidak Ada Data</Text></View>}
                                                                    </View>
                                                                    <View style={{borderBottomWidth: 2}}>
                                                                        <Text>Faskes 2</Text>
                                                                        {this.state.errorKontrolUlang2 === false ?
                                                                            <FlatList
                                                                                renderItem={this.renderRujukanBpjs}
                                                                                keyExtractor={(item, index) => index.toString()}
                                                                                ListFooterComponent={this.renderFooter}
                                                                                data={this.state.dataRujukanKontrolUlang2}/> :
                                                                            <View><Text>Tidak Ada Data</Text></View>}
                                                                    </View>

                                                                </View>
                                                            }
                                                        </Content>
                                                    </View>
                                                </Container>
                                            </Modal>
                                            <Modal
                                                transparent={false}
                                                animationType="slide"
                                                visible={this.state.modalVisibleDokter}
                                                onRequestClose={() => {
                                                    this.setModalUnvisibleDokter(!this.state.modalVisibleDokter);
                                                }}>
                                                <Container style={{marginBottom: 0, backgroundColor: '#fffff'}}>
                                                    <View style={{flex: 1}}>
                                                        <Content>
                                                            <FlatList
                                                                renderItem={this.renderRowDokter}
                                                                keyExtractor={(item, index) => index.toString()}
                                                                ListFooterComponent={this.renderFooter}
                                                                data={this.state.dataDokter}/>
                                                        </Content>
                                                    </View>
                                                </Container>
                                            </Modal>
                                        </View>
                                    }
                                </View>
                            </View>}
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

export default connect(mapStateToProps, mapDispatchToProps)(PendaftaranOnline);
const styles = StyleSheet.create({
    container: {

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
        width: 345,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
    buttonModalInputText: {
        color: '#ffffff',
        width: 345,
        backgroundColor: '#1da30b',
        borderRadius: 25,
        marginVertical: 2,
        paddingVertical: 13,
    },
    button: {
        width: 345,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
    },
    inputBoxModal: {
        width: 320,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
    buttonModal: {
        width: 320,
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
    header: {
        width: '100%',
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',


    },
    headerPhoto: {
        height: 170,
    },
    avatarPhoto: {
        width: 90,
        height: 90,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 30,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 40,
    },
});
