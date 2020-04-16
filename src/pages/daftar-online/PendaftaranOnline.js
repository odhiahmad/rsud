import React, {Component} from 'react';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

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
import {baseApi, baseApiBpjs} from '../../service/api';
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
        backgroundColor: '#1c313a',
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


class PendaftaranOnline extends ValidationComponent {

    constructor(props) {
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            statusIsi: 0,
            inClickNomorMR: false,
            showPassword: true,
            loading: false,
            inClickLengkapiProfil:false,

            dataPasien: [],
            modalVisible: false,
            modalVisibleDokter: false,
            simpanFavorite: false,
            id_pasien: '',
            nomorMr: '',
            status: 'before',
            nama: '',
            jenisKelaminTampil: '',

            data: [],
            dataCaraBayar: [],
            dataRujukan: [],
            dataPoly: [],
            dataDokter: [],
            dataTanggal: [],
            dataJam: [
                {id: 0, name: '08:00:00 - 09:00:00', jam: '08:00:00'},
                {id: 1, name: '09:00:00 - 10:00:00', jam: '09:00:00'},
                {id: 2, name: '10:00:00 - 11:00:00', jam: '10:00:00'},
                {id: 3, name: '11:00:00 - 12:00:00', jam: '11:00:00'},
                {id: 4, name: '13:00:00 - 14:00:00', jam: '13:00:00'},
                {id: 5, name: '14:00:00 - 15:00:00', jam: '14:00:00'},
                {id: 6, name: '15:00:00 - 16:00:00', jam: '15:00:00'},
                {id: 7, name: '16:00:00 - 17:00:00', jam: '16:00:00'},
            ],

            page: 1,
            total: 0,
            next_page_url: null,
            searchText: null,
            searchAktif: 0,

            statusLengkap: 0,

            statusMendaftar:0,
            idCaraBayar:'',
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
            pilihIdPoly:'',
        };
    }
    componentWillReceiveProps(value){
        console.log(value.nomorMr)

        if(value.nomorMr !== undefined && value.tahunLahir !== undefined){
            this.setState({
                loading: true,
            });

            this.getDataProfil()
        }
    }
    getDataProfil(){
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
                showMessage({
                    message: responseJson.message,
                    type: 'info',
                    position: 'top',
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
                this.state.loading = false;
                console.log(responseJson.data.jns_kelamin);
                this.state.message = responseJson.data;

            } else {
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'top',
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
    componentDidMount() {
        this.cekDaftar()
        if(this.state.nomor_mr != ''){

        }
        this.setState({
            isLoading: true,
        }, this.getData);

        var dayName = [];
        var hitung = [];
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
                console.log(hitung.length);

                tomorrow.setDate(new Date().getDate() + angka);
                this.state.dataTanggal.push({
                    id: i,
                    name: days[someDate.getDay()] + ', ' + (tomorrow.toString().substring(8, 10)) + ' ' + bulan[someDate.getMonth()] + ' ' + someDate.getFullYear(),
                    tanggal: tomorrow,
                    hari: days[someDate.getDay()],
                });

                if (hitung.length === 3) {

                } else if (hitung.length < 3 && hitung.length > 2) {
                    tomorrow.setDate(new Date().getDate() + angka + 1);
                    this.state.dataTanggal.push({
                        id: i + 1,
                        name: days[someDate.getDay() + 1] + ', ' + (tomorrow.toString().substring(8, 10)) + ' ' + bulan[someDate.getMonth()] + ' ' + someDate.getFullYear(),
                        tanggal: tomorrow,
                        hari: days[someDate.getDay() + 1],
                    });
                }
            } else if (someDate.getDay() === 0) {
                // tomorrow.setDate(new Date().getDate() + angka + 1);
                // this.state.dataTanggal.push({
                //     id: i,
                //     name: days[someDate.getDay() + 1] + ', ' + (tomorrow.toString().substring(8, 10)) + ' ' + bulan[someDate.getMonth()],
                //     tanggal: tomorrow,
                //     hari: days[someDate.getDay() + 1],
                // });
            }


        }

        this.getDataProfil()
        this.showDataPoly()
        this.showDataCaraBayar()


    }
    cekDaftar(){
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
                id:this.props.getUser.userDetails.id,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'top',
                });
                this.setState({
                    loading: false,
                    statusMendaftar:1
                });
                Actions.pop();

            } else {
                showMessage({
                    message: responseJson.message,
                    type: 'warning',
                    position: 'top',
                });
                this.setState({
                    loading: false,
                    statusMendaftar:0
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
            id:this.state.nomorMr,
            tahunLahir:this.state.tahunLahir
        });
        setTimeout(function () {
            this.setState({inClickLengkapiProfil: false});
        }.bind(this), 2000);
    };
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
                    idCaraBayar:a[i].id_cara_bayar,

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
        console.log(this.state.pilihPoly);
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
            }),
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson.data);
            var a = responseJson.data;
            for (let i = 0; i < a.length; i++) {
                this.state.dataDokter.push({
                    id: i,
                    name: a[i].get_dokter_jadwal[0].dokter_nama,
                    nrp: a[i].get_dokter_jadwal[0].nrp,
                });
            }
            this.setState({
                loading: false,
            });

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
    _onSubmitFinish() {
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
                    idUser:this.props.getUser.userDetails.id,
                    nomorMr: this.state.nomor_mr,
                    nomorKtp: this.state.nomorKtp,
                    namaPasien: this.state.namaPasien,
                    tempatLahir: this.state.tempatLahir,
                    tanggalLahir: this.state.tanggalLahir,
                    jenisKelamin: this.state.jenisKelamin,
                    jamKunjungan:this.state.pilihJam,
                    pilihCaraBayar: this.state.pilihCaraBayar,
                    tanggalKunjungan: this.state.pilihTanggalKunjungan,
                    namaRuang: this.state.pilihPoly,
                    idRuang:this.state.pilihIdPoly,
                    caraBayar: this.state.caraBayar,
                    idCaraBayar:this.state.idCaraBayar,
                    pilihRujukan: this.state.pilihRujukan,
                    pilihDokter: this.state.pilihDokter,
                    pilihNrp: this.state.pilihNrp,
                    npBpjs:null,
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.success === true) {
                    showMessage({
                        message: responseJson.message,
                        type: 'info',
                        position: 'top',
                    });
                    this.setState({
                        loading: false,
                    });
                    Actions.pop();

                } else {
                    showMessage({
                        message: responseJson.message,
                        type: 'danger',
                        position: 'top',
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
                    <ListItem thumbnail>
                        <Body>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 2}}>
                                <Text>Nama </Text><Text note>{item.nama}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginTop: 2}}>
                                <Text>Nomor MR </Text><Text note>{item.nomr}</Text>
                            </View>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Text>Pilih</Text>
                            </Button>
                        </Right>
                    </ListItem>
                </List>);
        }

    };

    pilihJam(jam) {
        console.log(jam);
        this.setState({
            pilihJam: jam,
            pilihDokter: this.state.dataDokter[0].name,
            pilihNrp: this.state.dataDokter[0].nrp,
        });
        this.setModalUnvisibleDokter(!this.state.modalVisibleDokter);
    }

    renderRowDokterJam = ({item}) => {
        return (
            <View>
                <List>
                    <ListItem onPress={() => this.pilihJam(item.jam)} thumbnail>
                        <Left>
                            <Text>Jam</Text>
                        </Left>
                        <Body>
                            <Text>{item.name}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity
                                onPress={() => this.pilihJam(item.jam)}><Text>Pilih</Text></TouchableOpacity>
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
                            <Thumbnail source={require('../../images/banner/banner1.jpg')}/>
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

        return (
            <View style={styles.container}>
                <LoaderModal
                    loading={this.state.loading}/>
                    <ScrollView>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{height: 200, paddingVertical: 20}}>
                                {/*<Image style={{height: 180, width: '100%', transform: [{scale: 1.22}]}}*/}
                                {/*       resizeMode='contain'*/}
                                {/*       source={require('../../images/logo/logo-launch.png')}/>*/}


                                <Grid>
                                    <Col style={{width: 120, height: 100}}><PhotoUpload
                                        quality={30}
                                        onPhotoSelect={avatar => {
                                            if (avatar) {
                                                console.log('Image base64 string: ', avatar);
                                                if (avatar) {
                                                    console.log({
                                                        id: this.props.getUser.userDetails.id,
                                                        photo: avatar,
                                                    });
                                                    fetch(baseApi + '/user/updatePhoto', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json',
                                                            'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                                                        },
                                                        body: JSON.stringify({
                                                            id: this.props.getUser.userDetails.id,
                                                            photo: avatar,
                                                        }),
                                                    }).then((response) => response.json()).then((responseJson) => {
                                                        console.log(responseJson);
                                                    })
                                                        .catch((error) => {
                                                            console.log(error);
                                                        });
                                                }
                                            }
                                        }}
                                    >
                                        <Image
                                            key={new Date()}
                                            style={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: 75,
                                            }}
                                            resizeMode='cover'
                                            source={{uri: this.state.foto + '?' + new Date()}}
                                        />
                                    </PhotoUpload></Col>
                                    <Col style={{width: 225, height: 250}}>
                                        <List>
                                            <ListItem>
                                                <Left>
                                                    <Text>Nama</Text>
                                                </Left>
                                                <Body>
                                                    <Badge danger><Text
                                                        style={{color: 'white'}}>{this.state.namaPasien}</Text></Badge>
                                                </Body>
                                            </ListItem>
                                            <ListItem>
                                                <Left>
                                                    <Text>Nomor MR</Text>
                                                </Left>
                                                <Body>
                                                    <Badge danger><Text style={{
                                                        fontSize: 15,
                                                        color: '#fff',
                                                        lineHeight: 20,
                                                    }}>{this.state.nomor_mr}</Text></Badge>
                                                </Body>
                                            </ListItem>
                                            <ListItem>
                                                <Left>
                                                    <Text>Tanggal Lahir</Text>
                                                </Left>
                                                <Body>
                                                    <Badge danger><Text style={{
                                                        fontSize: 15,
                                                        color: '#fff',
                                                        lineHeight: 20,
                                                    }}>{this.state.tanggalLahir}</Text></Badge>
                                                </Body>
                                            </ListItem>
                                            <ListItem>
                                                <Left>
                                                    <Text>Jenis Kelamin</Text>
                                                </Left>
                                                <Body>
                                                    <Badge danger><Text style={{
                                                        fontSize: 15,
                                                        color: '#fff',
                                                        lineHeight: 20,
                                                    }}>{this.state.jenisKelaminTampil}</Text></Badge>
                                                </Body>
                                            </ListItem>
                                        </List>
                                    </Col>
                                </Grid>

                            </View>
                            <View style={{marginBottom: 10, marginTop: 65, justifyContent: 'center'}}>
                                {this.state.statusLengkap === 1 ?
                                    <View style={{justifyContent: 'center',alignItems: 'center'}}>
                                        <TouchableOpacity style={styles.button}  onPress={!this.state.inClickLengkapiProfil ? this.onClickButtonLengkapiProfil : null}>
                                            <Text style={styles.buttonText}>Lengkapi Profil Anda Terlebih dahulu</Text></TouchableOpacity>
                                    </View> :
                                    <View style={{justifyContent: 'center',alignItems: 'center'}}>
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
                                                     this.setState({pilihCaraBayar: '', tanggalMasuk: '', pilihHari: ''});
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
                                                         idCaraBayar:this.state.dataCaraBayar[data].idCaraBayar,
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
                                                        placeholder="Masukan No BPJS"
                                                        onChangeText={(noBpjs) => this.setState({noBpjs})}
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
                                                                 });
                                                                 console.log(this.state.pilihRujukan);
                                                             }}
                                                             onRemoveItem={data => {
                                                                 this.setState({pilihRujukan: ''});
                                                             }}
                                                    />
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
                                                         pilihIdPoly:this.state.dataPoly[data].idPoly,
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
                                                                        <Thumbnail
                                                                            source={require('../../images/banner/banner1.jpg')}/>
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
                                        <TouchableOpacity style={styles.button} onPress={this._onSubmitFinish.bind(this)}>
                                            <Text style={styles.buttonText}>Go Daftar</Text>
                                        </TouchableOpacity>
                                        <Modal
                                            transparent={false}
                                            animationType="slide"
                                            visible={this.state.modalVisibleDokter}
                                        >
                                            <Container style={{marginBottom: 0, backgroundColor: '#fffff', marginTop: 50}}>
                                                <View style={{flex: 1}}>
                                                    <Header style={{backgroundColor: 'white'}}>
                                                        <Body>
                                                            <Title style={{color: 'black', marginLeft: 10, fontSize: 20}}
                                                                   children="Nomor MR"></Title>
                                                        </Body>
                                                        <Right>
                                                            <Button style={{backgroundColor: 'black'}} onPress={() => {
                                                                this.setModalUnvisibleDokter(!this.state.modalVisibleDokter);
                                                            }}>
                                                                <Icon name="close"
                                                                      style={{
                                                                          color: 'white',
                                                                          fontSize: 30,
                                                                          fontWeight: 'bold',
                                                                      }}/>
                                                            </Button>
                                                        </Right>
                                                    </Header>
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

export default connect(mapStateToProps, mapDispatchToProps)(PendaftaranOnline);
