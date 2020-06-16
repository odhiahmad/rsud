import React, {Component} from 'react';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import {Header} from 'react-native-elements';
import {
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
import ParallaxScrollView from 'react-native-parallax-scrollview';
import LoaderModal from '../../components/LoaderModal';
import Logo from '../../components/Logo';
import Form from '../../components/Form';
import InputText from '../../components/InputText';
import ValidationComponent from 'react-native-form-validator';
import Loader from '../../components/Loader';
import {baseApi, baseApiBpjs, baseUrlFoto} from '../../service/api';
import {Actions} from 'react-native-router-flux';
import StickyParalaxHeader from 'react-native-sticky-parallax-header';
import AwesomeAlert from 'react-native-awesome-alerts';
import email from 'react-native-email';
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
    Icon,
    Left,
    Body,
    Right,
    Switch,
    ActionSheet,
    Card, CardItem, DatePicker, Picker, Textarea, Input, Title, Tabs, Tab, List, Thumbnail,
} from 'native-base';
import {connect} from 'react-redux';
import Select2 from 'react-native-select-two';
import {logoutUser} from '../../actions/auth.actions';
import HTMLView from 'react-native-htmlview';
import Tab1 from './InputBaru';
import Tab2 from './DaftarTersimpan';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import PhotoUpload from 'react-native-photo-upload';
import moment from 'moment';


const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
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
        marginVertical: 30,
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


class PendaftaranOnlineDiriSendiri extends ValidationComponent {

    constructor(props) {
        super(props);

        this.state = {
            statusIsi: 0,
            inClickNomorMR: false,
            showPassword: true,
            loading: false,
            inClickLengkapiProfil: false,
            jenisRujukan: '',
            dataPasien: [],
            modalVisible: false,
            modalVisibleDokter: false,
            modalVisibleBpjs: false,
            nomorKtpBpjs: '',

            simpanFavorite: false,
            id_pasien: '',
            nomorMr: '',
            status: 'before',
            jenisKelaminTampil: '',
            dataRujukanBpjs: [],
            data: [],
            dataCaraBayar: [],
            dataRujukan: [],
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

            page: 1,
            total: 0,
            next_page_url: null,
            searchText: null,
            searchAktif: 0,
            cekRujukan: 3,
            statusLengkap: 0,
            statusMendaftar: 0,
            idCaraBayar: '',
            tahunLahir: '',
            nomor_mr: '',
            nomorKtp: '',
            namaPasien: '',
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
            pilihFoto: '',

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
            pilihJenisKota:'',
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
            chosenDate1: new Date(),
            chosenDate2: new Date(),
        };
        this.setDate = this.setDate.bind(this);
        this.setDate1 = this.setDate1.bind(this);
        this.setDate2 = this.setDate2.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    onValueChange2(value: string) {
        this.setState({
            jenisKelamin: value,
        });
    }
    onValueChange1(value: string) {
        this.setState({
            statusKawin: value,
        });
    }



    componentDidMount() {
        // this.cekDaftar();
        // if (this.state.nomor_mr != '') {
        //
        // }
        // this.setState({
        //     isLoading: true,
        // }, this.getData);
        this.showDataProvinsi();
        this.showDataSuku();
        this.showDataBahasa();
        this.showDataAgama();
        this.showDataCaraBayar();
        this.showDataPoly();

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
                } else if (hitung.length < 2 && hitung.length > 1) {
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
                    jenis:a[i].kabkota
                });
            }

            console.log(this.state.dataKota)
            this.setState({
                isLoading: false,
            });


        }).catch((error) => {
            console.log(error);
        });
    }

    showKecamatan(kota, provinsi) {
        this.setState({
            dataKecamatan:[]
        })
        console.log(kota)
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

    showModalBpjs(visible) {
        this.setState({
            modalVisibleBpjs: visible,

        });

        console.log(this.state.dataRujukanBpjs);
    }

    setModalUnvisibleBpjs(visible) {
        this.setState({
            modalVisibleBpjs: visible,
        });
    }

    pilihNoRujukan(data) {
        console.log(data.noKunjungan);
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
                console.log(data.tglKunjungan);
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
            if (responseJson.response != null) {
                this.setState({
                    nomorKtpBpjs: responseJson.response.peserta.nik,
                });
                if (responseJson.response.peserta.nik === this.state.nomorKtp) {
                    if (parseInt(responseJson.response.peserta.statusPeserta.kode) === 0) {
                        showMessage({
                            message: 'BPJS anda aktif',
                            type: 'warning',
                            position: 'bottom',
                        });
                    } else {
                        showMessage({
                            message: 'BPJS Anda tidak aktif',
                            type: 'danger',
                            position: 'bottom',
                        });
                    }
                } else {
                    showMessage({
                        message: 'No KTP Anda tidak sesuai dengan yang dibpjs',
                        type: 'danger',
                        position: 'bottom',
                    });
                }

            }
        });
    }

    GetValueFunction = (ValueHolder) => {

        var Value = ValueHolder.length;
        console.log(Value);
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
                                <Text note>Tgl Kunjungan</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>No Kartu</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>PPK Perujuk</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                                <Text note>Sub Spesialis</Text>
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
                console.log(responseJson.message);

            }
        }).catch((error) => {
            this.setState({
                loading: false,
            });
            console.log(error);
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

    setDate(newDate) {
        this.setState({chosenDate: newDate});
    }

    setDate1(newDate) {
        this.setState({chosenDate1: newDate});
    }

    setDate2(newDate) {
        this.setState({chosenDate2: newDate});
    }

    showDataCaraBayar() {
        this.setState({
            loading: true,
        });
        const url = baseApi + '/user/caraBayar';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataCaraBayar.push({
                    id: i,
                    name: a[i].cara_bayar,
                    ket: a[i].KET,
                    idCaraBayar: a[i].id_cara_bayar,

                });
            }
            this.setState({
                loading: false,
            });

            console.log(this.state.dataCaraBayar);


        }).catch((error) => {
            console.log(error);
        });
    }

    showDataPoly() {
        this.setState({
            loading: true,
        });
        const url = baseApi + '/user/poly';
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataPoly.push({
                    id: i,
                    name: a[i].poly_nama,
                    idPoly: a[i].poly_id,
                });
            }
            this.setState({
                loading: false,
            });

            console.log(this.state.dataPoly);


        }).catch((error) => {
            console.log(error);
        });
    }

    showDataDokter(id) {
        console.log(this.state.tanggalMasuk);
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
            console.log(jam);
            var angka = [];
            for (let i = 0; i < jam.length; i++) {
                console.log(jam[i]);
                for (let j = 0; j < this.state.dataJam.length; j++) {

                    if (this.state.dataJam[j].jam === jam[i]) {

                        this.state.dataJam[j].tersedia = this.state.dataJam[j].tersedia - (j + 1);
                        this.setState({
                            dataJam: this.state.dataJam,
                        });

                    }
                }
            }
            console.log(this.state.dataJam);
            console.log(this.state.dataDokter);


        }).catch((error) => {
            console.log(error);
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
            console.log(responseJson);
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {

                this.state.dataRujukan.push({
                    id: i,
                    name: a[i].rujukan,
                    jenis: a[i].jenis,
                });

            }
            this.setState({
                loading: false,
            });

            console.log(this.state.dataRujukan);


        }).catch((error) => {
            console.log(error);
        });
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
    getData = async () => {
        const url = baseApi + '/user/getNomorMrSimpan?page=' + this.state.page;
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                search: this.state.searchText,
                id: this.props.getUser.userDetails.id,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.data.total === 0) {
                showMessage({
                    duration: 4000,
                    message: 'Tidak ada list favorit anda, silahkan masukan baru nomor MR',
                    type: 'danger',
                    position: 'bottom',
                });
                this.setState({
                    isLoading: false,
                    data: [],
                });
            } else {
                this.setState({
                    next_page_url: responseJson.data.next_page_url,
                    isLoading: false,
                    total: responseJson.data.total,
                    data: this.state.data.concat(responseJson.data.data),
                });

            }

        }).catch((error) => {
            console.log(error);
        });
    };
    searchData = async () => {
        const url = baseApi + '/user/getNomorMrSimpan?page=';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                search: this.state.searchText,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                data: responseJson.data.data,
                isLoading: false,
            });

            console.log(this.state.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    showPilihRujukan(jenis) {
        this.setState({
            loading: true,
        });
        console.log(this.state.noBpjs);
        console.log({
            'username': '00004',
            'password': '551UU1BJ',
            'data': this.state.noBpjs,
        });
        if (jenis === 1) {
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
                console.log(responseJson);
                if (responseJson.metaData.code === '200') {
                    this.setState({
                        loading: false,
                        cekRujukan: 1,
                        dataRujukanBpjs: responseJson.response.rujukan,
                    });
                } else {

                    this.setState({
                        cekRujukan: 0,
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
                    'param': 'nokartu',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.metaData.code === '200') {
                    this.setState({
                        loading: false,
                        cekRujukan: 1,
                        dataRujukanBpjs: responseJson.response.rujukan,
                    });
                } else {

                    this.setState({
                        loading: false,
                        cekRujukan: 0,
                    });
                    showMessage({
                        message: responseJson.metaData.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            });
        } else if (jenis === 3) {
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
                    'param': 'nokartu',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                console.log(responseJson);
                if (responseJson.metaData.code === '200') {
                    this.setState({
                        loading: false,
                        cekRujukan: 1,
                        dataRujukanBpjs: responseJson.response.rujukan,
                    });
                } else {

                    this.setState({
                        loading: false,
                        cekRujukan: 0,
                    });
                    showMessage({
                        message: responseJson.metaData.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
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
                    'param': 'nokartu',
                    'data': this.state.noBpjs,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.metaData.code === '200') {
                    this.setState({
                        loading: false,
                        cekRujukan: 1,
                        dataRujukanBpjs: responseJson.response.rujukan,
                    });
                } else {

                    this.setState({
                        loading: false,
                        cekRujukan: 0,
                    });
                    showMessage({
                        message: responseJson.metaData.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            });
        }

        console.log(this.state.cekRujukan);


    }

    _onChangeSearchText(text) {

        console.log(text);
        if (text === '') {
            this.setState({
                searchAktif: 0,
            });
        } else {
            this.setState(
                {page: 1, searchAktif: 1, isLoading: false, searchText: text},
                this.searchData,
            );
        }

    }

    _onSubmitNama() {
        if (this.state.simpanFavorite === false) {
            this.setState({
                nomor_mr: this.state.nomorMr,
                statusIsi: 1,
                status: 'before',
                nama: '',
            });
            this.setModalUnvisible(!this.state.modalVisible);
            this.showDataCaraBayar();
            this.showDataPoly();
        } else if (this.state.simpanFavorite === true) {
            this.setState({
                state: true,
            });
            fetch(baseApi + '/user/simpanNomr', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                },
                body: JSON.stringify({
                    id: this.props.getUser.userDetails.id,
                    nomorMr: this.state.nomorMr,
                    nama: this.state.nama,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.success === true) {
                    this.showDataCaraBayar();
                    this.showDataPoly();
                    this.setModalUnvisible(!this.state.modalVisible);
                    console.log(responseJson.data);
                    this.setState({
                        data: this.state.data.concat(responseJson.data),
                        loading: false,
                        statusIsi: 1,
                        nomor_mr: this.state.nomorMr,
                        status: 'before',
                        nama: '',
                    });

                    showMessage({
                        message: responseJson.message,
                        type: 'info',
                        position: 'bottom',
                    });
                } else {
                    this.setState({
                        loading: false,
                    });

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
        this.setState({
            loading: true,
        });
        fetch(baseApi + '/user/cariNomorMr', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                nomorMr: this.state.nomorMr,
                tahunLahir: this.state.tahunLahir,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                showMessage({
                    message: responseJson.message,
                    type: 'info',
                    position: 'bottom',
                });

                if (parseInt(responseJson.data.no_ktp) !== 0 && responseJson.data.tempat_lahir !== '' &&
                    responseJson.data.pekerjaan !== null && responseJson.data.nama_provinsi !== null &&
                    responseJson.data.nama_kab_kota !== null && responseJson.data.nama_kecamatan !== null &&
                    responseJson.data.nama_keluranahan !== null && responseJson.data.suku !== null &&
                    responseJson.data.bahasa !== null && responseJson.data.alamat !== ''
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
                    loading: false,
                });

                if (responseJson.data.no_bpjs != 0) {
                    this.cekBPJS(responseJson.data.no_bpjs);
                }

                this.state.loading = false;
                console.log(responseJson.data.jns_kelamin);
                this.state.message = responseJson.data;

            } else {
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'bottom',
                });
                this.setState({
                    loading: false,
                });
                console.log(responseJson.message);

            }
        }).catch((error) => {
            this.setState({
                loading: false,
            });
            console.log(error);
            this.state.message = error;
        });

    }

    _onSubmitFinish() {
        if (this.state.caraBayar === 'Umum') {
            this.validate({
                pilihCaraBayar: {required: true},
                pilihPoly: {required: true},
                pilihNrp: {required: true},
                pilihHari: {required: true},
                pilihJam: {required: true},
                pilihAgama: {required: true},
                jenisKelamin: {required: true},
                statusKawin: {required: true},
                chosenDate: {required: true},
                noTelpon: {minlength: 10, maxlength: 13, number: true, required: true},
                tempatLahir: {minlength: 3, required: true},
                nama: {minlength: 4, maxlength: 50, required: true},
                pekerjaan: {minlength: 4, maxlength: 50,required: true},
                nik: {minlength: 16, maxlength: 16, required: true},
                pilihProvinsi: {required: true},
                pilihKota: {required: true},
                pilihKecamatan: {required: true},
                pilihDesa: {required: true},
                pilihSuku: {required: true},
                pilihBahasa: {required: true},
                pilihWn: {required: true},
                alamat: {minlength: 4,required: true},
            });
            if (this.isFormValid()) {
                this.setState({
                    loading: true,
                });
                fetch(baseApi + '/user/daftarPasienBaru', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        idUser:this.props.getUser.userDetails.id,
                        nomorKtp: this.state.nik,
                        namaPasien: this.state.nama,
                        tempatLahir: this.state.tempatLahir,
                        statusKawin:this.state.statusKawin,
                        tanggalLahir: this.state.chosenDate,
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


                        noTelpon: this.state.noTelpon,
                        nama: this.state.nama,
                        pekerjaan: this.state.pekerjaan,
                        nik: this.state.nik,
                        pilihProvinsi: this.state.pilihProvinsi,
                        pilihKota: this.state.pilihJenisKota + ' ' +this.state.pilihKota,
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
                                tanggalMendaftar: responseJson.data.updated_at,
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
                        console.log(responseJson.message);
                    }
                }).catch((error) => {
                    this.setState({
                        loading: false,
                    });
                    console.log(error);
                    this.state.message = error;
                });
            }
        } else {
            if (this.state.nomorKtpBpjs === this.state.nomorKtp) {
                this.validate({
                    pilihCaraBayar: {required: true},
                    pilihPoly: {required: true},
                    pilihNrp: {required: true},
                    pilihHari: {required: true},
                    pilihJam: {required: true},
                    noBpjs: {required: true},
                    no_jaminan: {required: true},
                    pilihRujukan: {required: true},
                    pilihAgama: {required: true},
                    jenisKelamin: {required: true},
                    statusKawin: {required: true},
                    chosenDate: {required: true},
                    noTelpon: {minlength: 10, maxlength: 13, number: true, required: true},
                    tempatLahir: {minlength: 3, required: true},
                    nama: {minlength: 4, maxlength: 50, required: true},
                    pekerjaan: {minlength: 4, maxlength: 50,required: true},
                    nik: {minlength: 16, maxlength: 16, required: true},
                    pilihProvinsi: {required: true},
                    pilihKota: {required: true},
                    pilihKecamatan: {required: true},
                    pilihDesa: {required: true},
                    pilihSuku: {required: true},
                    pilihBahasa: {required: true},
                    pilihWn: {required: true},
                    alamat: {minlength: 4,required: true},
                });
                if (this.isFormValid()) {
                    this.setState({
                        loading: true,
                    });
                    fetch(baseApi + '/user/daftarPasienBaru', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                        },
                        body: JSON.stringify({
                            idUser:this.props.getUser.userDetails.id,
                            nomorKtp: this.state.nik,
                            namaPasien: this.state.nama,
                            tempatLahir: this.state.tempatLahir,
                            tanggalLahir: this.state.chosenDate,
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

                            nomorRujukan: this.state.no_jaminan,
                            kelas: this.state.kelas,
                            idKelas: this.state.idKelas,
                            noTelpon: this.state.noTelpon,
                            nama: this.state.nama,
                            pekerjaan: this.state.pekerjaan,
                            nik: this.state.nik,
                            pilihProvinsi: this.state.pilihProvinsi,
                            pilihKota: this.state.pilihJenisKota + ' ' +this.state.pilihKota,
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
                                    tanggalMendaftar: responseJson.data.updated_at,
                                    namaDokter: responseJson.data.namaDokterJaga,
                                    tanggalLahir: responseJson.data.tgl_lahir,

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
                            console.log(responseJson.message);
                        }
                    }).catch((error) => {
                        this.setState({
                            loading: false,
                        });
                        console.log(error);
                        this.state.message = error;
                    });
                }
            } else {
                showMessage({
                    message: 'Nomor KTP anda dengan yang di BPJS tidak sama',
                    type: 'info',
                    position: 'bottom',
                });
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

    renderRow = ({item}) => {
        if (this.state.data.length === 0) {
            return (
                <List>
                    <ListItem thumbnail>
                        <Body>

                            <View style={{flex: 1, flexDirection: 'row', marginTop: 2}}>
                                <Text>Tidak ada List Favorit Tersimpan</Text>
                            </View>
                        </Body>
                    </ListItem>
                </List>);
        } else {
            return (
                <List>
                    <ListItem onPress={() => {
                    }}>
                        <Body>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 2}}>
                                <Text>Nama </Text><Text note>{item.nama}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 2}}>
                                <Text>Nomor MR </Text><Text note>{item.nomr}</Text>
                            </View>
                        </Body>
                        <Right>
                            <Button onPress={() => {
                            }} transparent>
                                <Text>Pilih</Text>
                            </Button>
                        </Right>
                    </ListItem>
                </List>);
        }

    };

    pilihJam(jam, name) {
        console.log(name);
        this.setState({
            pilihJam: jam,
            pilihJamLabel: name,
            pilihDokter: this.state.dataDokter[0].name,
            pilihNrp: this.state.dataDokter[0].nrp,
            pilihFoto: this.state.dataDokter[0].foto,
        });
        this.setModalUnvisibleDokter(!this.state.modalVisibleDokter);
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
                            <Text style={{color: 'gray'}}>{item.name}</Text>
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

    render() {

        const {showAlert} = this.state;
        const {onChange} = this.props;
        var jenisKel = [];


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

        if (this.state.dataProfil.pilihKota != '') {
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
                            title='Pilih Provinsi'
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
                            title='Pilih Kota'
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
                                    pilihJenisKota: this.state.dataKota[data].jenis
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
                            title='Pilih Kecamatan'
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
                            title='Pilih Desa'
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
                            title='Pilih Suku'
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
                            title='Pilih Bahasa'
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
                    />
                    {this.isFieldInError('pilihWn') && this.getErrorsInField('pilihWn').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>,
            );

            listViewProfil1.push(
                <View>
                    <TextInput
                        keyboardType={'numeric'}
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
                        ref="tempatLahir"
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
                        ref="pekerjaan"
                        onChangeText={(pekerjaan) => this.setState({pekerjaan})}
                        style={styles.inputBox}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        placeholder="Pekerjaaaan"
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        selectionColor="#999999"
                    />
                    {this.isFieldInError('pekerjaan') && this.getErrorsInField('pekerjaan').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                    <TextInput
                        keyboardType={'numeric'}
                        defaultValue={this.state.noTelpon != '' ? this.state.noTelpon : ''}
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
                            {this.state.pilihProvinsi !== '' ? listViewKota : <View></View>}
                            {this.state.pilihKota !== '' && this.state.pilihProvinsi !== '' ? listViewKecamatan :
                                <View></View>}
                            {this.state.pilihKecamatan !== '' && this.state.pilihKota !== '' && this.state.pilihProvinsi !== '' ? listViewDesa :
                                <View></View>}


                            <Textarea ref="alamat"
                                      autoCapitalize='words'
                                      onChangeText={(alamat) => this.setState({alamat})}
                                      placeholderTextColor="#ffffff" style={styles.inputBox} rowSpan={5}
                                      bordered
                                      placeholder="Alamat"/>
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
        }else {
                listViewProfil1.push(
                    <View>
                        <LoaderModal
                            loading={true}/>
                    </View>,
                );

            }

        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
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

                <ScrollView>
                    <View style={{marginBottom: 40}}>
                        <TextInput
                            keyboardType={'numeric'}
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
                            ref="tempatLahir"
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
                            ref="pekerjaan"
                            onChangeText={(pekerjaan) => this.setState({pekerjaan})}
                            style={styles.inputBox}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            placeholder="Pekerjaaaan"
                            placeholderTextColor="rgba(255,255,255,0.8)"
                            selectionColor="#999999"
                        />
                        {this.isFieldInError('pekerjaan') && this.getErrorsInField('pekerjaan').map(errorMessage =>
                            <Text>{errorMessage}</Text>)}
                        <TextInput
                            keyboardType={'numeric'}
                            defaultValue={this.state.noTelpon != '' ? this.state.noTelpon : ''}
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
                                {this.state.pilihProvinsi !== '' ? listViewKota : <View></View>}
                                {this.state.pilihKota !== '' && this.state.pilihProvinsi !== '' ? listViewKecamatan :
                                    <View></View>}
                                {this.state.pilihKecamatan !== '' && this.state.pilihKota !== '' && this.state.pilihProvinsi !== '' ? listViewDesa :
                                    <View></View>}


                                <Textarea ref="alamat"
                                          autoCapitalize='words'
                                          onChangeText={(alamat) => this.setState({alamat})}
                                          placeholderTextColor="#ffffff" style={styles.inputBox} rowSpan={5}
                                          bordered
                                          placeholder="Alamat"/>
                                {this.isFieldInError('alamat') && this.getErrorsInField('alamat').map(errorMessage =>
                                    <Text>{errorMessage}</Text>)}

                                {listViewSuku}
                                {listViewBahasa}
                            </View> : this.state.pilihWn === 'WNA' ?
                                <View>{listViewPilihNegara}</View> : <View></View>
                        }
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
                                        style={styles.inputBox}
                                        underlineColorAndroid="rgba(0,0,0,0)"
                                        placeholderTextColor="rgba(255,255,255,0.8)"
                                        selectionColor="#999999"
                                    />
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
                                    />
                                    {this.state.cekRujukan === 0 ?
                                        <View>
                                            <List>
                                                <ListItem>
                                                    <Left>
                                                        <Text>No Rujukan</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text note>Tidak Ada Rujukan</Text>
                                                    </Body>
                                                </ListItem>
                                            </List>
                                        </View> : this.state.cekRujukan === 1 ?
                                            <View>
                                                <TouchableOpacity style={styles.buttonModalInputText}
                                                                  onPress={() => this.showModalBpjs(true)}>
                                                    <Text style={styles.buttonText}>Pilih Rujukan</Text>
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
                                                            <Text note>{this.state.pilihDokter}</Text>
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
                        ><Container style={{margin: 0, marginBottom: 0, backgroundColor: '#fff'}}>
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
                                            <Tabs initialPage={0} back>
                                                <Tab tabStyle={{backgroundColor: 'white'}}
                                                     textStyle={{color: 'black'}}
                                                     activeTabStyle={{backgroundColor: '#1da30b'}}
                                                     activeTextStyle={{
                                                         color: '#fff',
                                                         fontWeight: 'normal',
                                                     }}
                                                     heading="Faskes 1">
                                                </Tab>
                                                <Tab tabStyle={{backgroundColor: 'white'}}
                                                     textStyle={{color: 'black'}}
                                                     activeTabStyle={{backgroundColor: '#1da30b'}}
                                                     activeTextStyle={{
                                                         color: '#fff',
                                                         fontWeight: 'normal',
                                                     }}
                                                     heading="Faskes 2">
                                                </Tab>
                                            </Tabs>
                                        </View>
                                    }
                                </Content>
                            </View>
                        </Container>
                        </Modal>
                        <Modal
                            onRequestClose={() => {
                                this.setModalUnvisibleDokter(!this.state.modalVisibleDokter);
                            }}
                            transparent={false}
                            animationType="slide"
                            visible={this.state.modalVisibleDokter}
                        >
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

export default connect(mapStateToProps, mapDispatchToProps)(PendaftaranOnlineDiriSendiri);
