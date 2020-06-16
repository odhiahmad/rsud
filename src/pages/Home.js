import React, {Component, useEffect} from 'react';
import {Header, Icon, Tile, ListItem} from 'react-native-elements';
import {Body, Drawer, Left, List, Right, Root, Thumbnail} from 'native-base';
import SideBar from './Sidebar';
import TextTicker from 'react-native-text-ticker';
import Carousel from 'react-native-snap-carousel';
import {
    Text,
    StyleSheet,
    Animated,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    BackHandler,
    Dimensions, StatusBar, Modal, FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/auth.actions';
import {BottomLayer} from './component/BottomLayer';
import {Actions} from 'react-native-router-flux';
import {SliderBox} from 'react-native-image-slider-box';
import PushNotification from 'react-native-push-notification';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import FlashMessage from 'react-native-flash-message';
import LoaderModal from '../components/LoaderModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import StepIndicator from 'react-native-step-indicator';
import ViewShot from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import CameraRoll from '@react-native-community/cameraroll';
import {baseApi, baseUrlFoto} from '../service/api';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
};
type Props = {}
let {width, height} = Dimensions.get('window');
const options = [
    'Keluar',
    'Daftar Sendiri',
    'Daftar Untuk Orang Lain Pasien Lama',
    'Daftar Untuk Orang Lain Pasien Baru',
];
const labels = ['Mendaftar', 'Sedang Berobat', 'Selesai Berobat', 'Mendapatkan Obat', 'Selesai'];

class Profile extends Component {
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100);
        this.state = {
            images: [
                require('../images/banner/banner1.jpg'),
                require('../images/banner/banner3.jpg'),
                require('../images/banner/banner4.jpg'),
            ],
            inClickNotifikasi: false,
            inClickHome: false,
            inClickHomeSendiri: false,
            inClickHomeOrangLainBaru: false,
            inClickBed: false,
            inClickJadwal: false,
            inClickInfo: false,
            inClickShuttle: false,
            inClickFaq: false,
            inClickPengaduan: false,
            inClickNews: false,
            inClickObat: false,

            status: false,
            nomorAntrian: '',
            tanggalKunjungan: '',
            jamKunjungan: '',
            showAlert: false,
            modalVisible: false,
            jamKunjunganLabel: '',
            namaPasien: '',
            namaRuang: '',
            caraBayar: '',
            tanggalMendaftar: '',
            namaDokter: '',
            tanggalLahir: '',
            nomorMr: '',
            jenisKelamin: '',
            statusBerobat: '',
            dataQrCode: [],
            tokenNotif: '',
            dataDokterLibur: [],
            dataDokterLiburKeterangan: [],
            activeIndex: 0,
            dataDashboard: [],

        };
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    };

    componentWillReceiveProps(value) {

        if (value.nomorAntrian != null) {
            this.setModalVisible(true);
            this.setState({
                nomorAntrian: value.nomorAntrian,
                tanggalKunjungan: value.tanggalKunjungan,
                jamKunjungan: value.jamKunjungan,
                jamKunjunganLabel: value.jamKunjunganLabel,
                jamKunjunganAntrian: value.jamKunjunganAntrian,
                namaPasien: value.namaPasien,
                namaRuang: value.namaRuang,
                caraBayar: value.caraBayar,
                tanggalMendaftar: value.tanggalMendaftar,
                namaDokter: value.namaDokter,
                tanggalLahir: value.tanggalLahir,
                nomorMr: value.nomorMr,
                jenisKelamin: value.jenisKelamin,
                statusBerobat: value.statusBerobat,
            });

            this.state.dataQrCode = [{
                nomorAntrian: value.nomorAntrian,
                tanggalKunjungan: value.tanggalKunjungan,
                jamKunjungan: value.jamKunjungan,
                jamKunjunganLabel: value.jamKunjunganLabel,
                namaPasien: value.namaPasien,
                namaRuang: value.namaRuang,
                caraBayar: value.caraBayar,
                tanggalMendaftar: value.tanggalMendaftar,
                namaDokter: value.namaDokter,
                tanggalLahir: value.tanggalLahir,
                nomorMr: value.nomorMr,
                jenisKelamin: value.jenisKelamin,
                statusBerobat: value.statusBerobat,
            }];
        }


    }
    componentWillUnmount() {
        this.getJadwalDokter();
    }
    componentDidMount() {
        this.getJadwalDokter();
        // this.getDataDashboard();
        messaging()
            .getToken()
            .then(token => {
                console.log(token);
                fetch(baseApi + '/user/updateToken', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                    },
                    body: JSON.stringify({
                        id: this.props.getUser.userDetails.id,
                        token: token,
                    }),
                }).then((response) => response.json()).then((responseJson) => {
                    console.log('Success');
                });
            })

    }

    getDataDashboard() {
        fetch(baseApi + '/user/getDataDashboard', {
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
              dataDashboard:responseJson.data
            });
        }).catch((error) => {
            console.log(error);
        }).finally(() => {

        });;
    }

    getJadwalDokter() {
        fetch(baseApi + '/user/liburDokter', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                dataDokterLibur: responseJson.data,
                dataDokterLiburKeterangan: responseJson.dataKeterangan,
            });

            console.log(responseJson.dataKeterangan);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {

        });;
    }


    updateToken(token) {

    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width,
        });
    };

    onClickButtonHome(index) {

        if (index === 1) {
            this.setState({inClickHome: true});
            Actions.daftaronline();
            this.ActionSheet.hide();
            setTimeout(function () {
                this.setState({inClickHome: false});
            }.bind(this), 2000);
        } else if (index === 2) {
            this.setState({inClickHomeSendiri: true});
            Actions.daftaronlinesendiri();
            this.ActionSheet.hide();
            setTimeout(function () {
                this.setState({inClickHomeSendiri: false});
            }.bind(this), 2000);
        } else if (index === 3) {
            this.setState({inClickHomeOrangLainBaru: true});
            Actions.daftaronlineoranglainbaru();
            this.ActionSheet.hide();
            setTimeout(function () {
                this.setState({inClickHomeOrangLainBaru: false});
            }.bind(this), 2000);
        }


    };

    saveQrToDisk() {
        this.refs.viewShot.capture().then(uri => {
            console.log('do something with ', uri);

            CameraRoll.saveToCameraRoll(uri, 'photo');

        });
    }

    onClickButtonNotifikasi = () => {
        this.setState({inClickNotifikasi: true});
        Actions.notifikasi();
        setTimeout(function () {
            this.setState({inClickNotifikasi: false});
        }.bind(this), 2000);
    };

    onClickButtonHomeSendiri = () => {
        this.setState({inClickHomeSendiri: true});
        Actions.daftaronlinesendiri();
        this.ActionSheet.hide();
        setTimeout(function () {
            this.setState({inClickHomeSendiri: false});
        }.bind(this), 2000);
    };
    onClickButtonObat = () => {
        this.setState({inClickObat: true});
        Actions.obat();
        setTimeout(function () {
            this.setState({inClickObat: false});
        }.bind(this), 2000);
    };
    onClickButtonJadwal = () => {
        this.setState({inClickJadwal: true});
        Actions.jadwalpoliklinik();
        setTimeout(function () {
            this.setState({inClickJadwal: false});
        }.bind(this), 2000);
    };
    onClickButtonBed = () => {
        this.setState({inClickBed: true});
        Actions.bedmonitoring();
        setTimeout(function () {
            this.setState({inClickBed: false});
        }.bind(this), 2000);
    };
    onClickButtonInfo = () => {
        this.setState({inClickInfo: true});
        Actions.daftaronline();
        setTimeout(function () {
            this.setState({inClickInfo: false});
        }.bind(this), 2000);
    };
    onClickButtonShuttle = () => {
        this.setState({inClickShuttle: true});
        Actions.shuttlebus();
        setTimeout(function () {
            this.setState({inClickShuttle: false});
        }.bind(this), 2000);
    };
    onClickButtonFaq = () => {
        this.setState({inClickFaq: true});
        Actions.faq();
        setTimeout(function () {
            this.setState({inClickFaq: false});
        }.bind(this), 2000);
    };
    onClickButtonPengaduan = () => {
        this.setState({inClickPengaduan: true});
        Actions.pengaduan();
        setTimeout(function () {
            this.setState({inClickPengaduan: false});
        }.bind(this), 2000);
    };
    onClickButtonNews = () => {
        this.setState({inClickNews: true});
        Actions.news();
        setTimeout(function () {
            this.setState({inClickNews: false});
        }.bind(this), 2000);
    };

    closeDrawer() {
        this.drawer._root.close();
    }

    openDrawer() {
        this.drawer._root.open();
    }

    _renderItem = ({item, index}) => {
        // console.log(this.state.dataDokterLiburKeterangan.length)
        return (
            <View style={{ borderWidth: 1,
                borderColor: 'orange',
                borderRadius: 0,
                justifyContent: 'center',}}>
            <ListItem
                title={<Text>{item.dokter_nama}</Text>}
                subtitle={
                    <View>
                        <Text style={{color: 'gray'}}>NRP {item.nrp}</Text>
                        {/*{this.state.dataDokterLiburKeterangan.length !== 0 ? <Text*/}
                        {/*    style={{color: 'gray'}}>Keterangan {this.state.dataDokterLiburKeterangan[index].libur_keterangan}</Text> : ''}*/}

                    </View>

                }
                leftAvatar={
                    item.fhoto != null ?
                        {
                            rounded: true,
                            height: 80,
                            width: 80,
                            source: this.state.urlImage && {uri: baseUrlFoto + 'dokter/' + item.fhoto},
                            title: item.dokter_nama[0],
                        }
                        :
                        {
                            rounded: true,
                            height: 80,
                            width: 80,
                            source: require('../images/dokter.png'),
                            title: item.dokter_nama[0],
                        }
                }
            />
            </View>
        );
    };

    _renderItemMenu = ({item, index}) => {
        return (
            <View style={{ borderWidth: 1,
                borderColor: 'orange',
                borderRadius: 0,
                justifyContent: 'center',}}>
                <ListItem
                    title={<Text>Total {item.Jumlah}</Text>}
                    subtitle={<Text style={{color: 'gray'}}>{item.Keterangan}</Text>}
                />
            </View>

        );
    };

    render() {

        const {showAlert} = this.state;
        const handlePress = (index) => {
            console.log(index);
        };
        return (
            <View style={{flex: 1}}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    rightComponent={
                        <Icon name='notifications' color='#fff'
                              onPress={!this.state.inClickNotifikasi ? this.onClickButtonNotifikasi : null}/>}
                    // leftComponent={{text: 'Smart Hospital', style: {fontWeight: 'bold', color: '#fff', width: 200}}}
                    leftComponent={<Image style={{width: 140, height: 40}}
                                          source={require('../images/logo-smart/newlogo.png')}/>}
                />

                <ScrollView style={{flex: 1, backgroundColor: 'white'}}>

                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<Text style={{color: '#000', fontSize: 18}}>Pilih Jenis Daftar</Text>}
                        options={options}
                        cancelButtonIndex={0}
                        destructiveButtonIndex={4}
                        onPress={(index) => this.onClickButtonHome(index)}

                    />
                    <SliderBox
                        ImageComponentStyle={{borderRadius: 15, width: '97%', marginTop: 5}}
                        images={this.state.images}
                        sliderBoxHeight={200}
                        parentWidth={this.state.width}
                        // onCurrentImagePressed={
                        //     index => console.warn(`image ${index} pressed`)
                        // }
                        dotColor="#FFEE58"
                        paginationBoxStyle={{
                            position: 'absolute',
                            bottom: 0,
                            padding: 0,
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingVertical: 10,
                        }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginHorizontal: 0,
                            padding: 0,
                            margin: 0,
                            backgroundColor: 'rgba(128, 128, 128, 0.92)',
                        }}
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        autoplay
                        circleLoop/>
                    <View style={{marginTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{color: 'gray'}}>Dokter Yang Tidak Hadir Hari Ini</Text>
                    </View>
                    {this.state.dataDokterLibur.length !== 0 ?
                        <View style={{marginLeft:5,marginTop: 10,marginBottom:10, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Carousel
                                enableMomentum={true}
                                autoplay={true}
                                loop={true}
                                layout={'default'}
                                ref={(c) => {
                                    this._carousel = c;
                                }}
                                onSnapToItem={index => this.setState({activeIndex: index})}
                                data={this.state.dataDokterLibur}
                                renderItem={this._renderItem}
                                sliderWidth={300}
                                itemWidth={300}
                            />
                        </View> :
                        <View style={{marginTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: 'gray'}}>Tidak Ada Dokter Libur Hari Ini</Text>
                        </View>}

                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <View style={{marginHorizontal: 0, flexDirection: 'row'}}>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginHorizontal: 5,
                                marginTop: 5,
                            }}>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    height: '50%',
                                    width: '100%',
                                    marginBottom: 4,
                                }}>
                                    <TouchableOpacity
                                        onPress={this.showActionSheet}
                                        // onPress={!this.state.inClickHome ? this.onClickButtonHome : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/online.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Daftar Online</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickJadwal ? this.onClickButtonJadwal : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/dokter.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Jadwal Poliklinik</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickBed ? this.onClickButtonBed : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/bedmonitoring.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Bed Monitoring</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickShuttle ? this.onClickButtonShuttle : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/shuttlebus.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Shuttle Bus</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    width: '100%',
                                    height: '50%',
                                    marginBottom: 18,
                                }}>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickFaq ? this.onClickButtonFaq : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/informasi.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Informasi</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickPengaduan ? this.onClickButtonPengaduan : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/pengaduan.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Pengaduan Masyarakat</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickNews ? this.onClickButtonNews : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/news.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>RSUD News</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickObat ? this.onClickButtonObat : null}
                                        style={{
                                            marginRight: 2,
                                            width: '25%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 70,
                                                height: 70,
                                                borderWidth: 0,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Image style={{height: 70, width: 70}}
                                                   resizeMode='contain'
                                                   source={require('../images/logo-smart/informasi.png')}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Obat Pasien</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                        {/*<View style={{paddingTop: 16,marginBottom:20,justifyContent: 'center', paddingHorizontal: 16}}>*/}
                        {/*    <View>*/}
                        {/*        <Image source={require('../images/obat.png')}*/}
                        {/*               style={{height: 170, width: '100%', borderRadius: 6}}></Image>*/}
                        {/*    </View>*/}
                        {/*    /!*<View style={{justifyContent: 'center',paddingTop: 16, paddingBottom: 20}}>*!/*/}
                        {/*    /!*    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1c1c1c'}}>Obat</Text>*!/*/}
                        {/*    /!*    <Text style={{fontSize: 14, fontWeight: '500', color: '#7a7a7a'}}>Pasien Yang Telah Selesai berobat di RSUD Padang Panjang</Text>*!/*/}
                        {/*    /!*</View>*!/*/}
                        {/*</View>*/}
                    </View>
                    <View style={{marginLeft:5,marginTop: 10,marginBottom:10, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Carousel
                            enableMomentum={true}
                            autoplay={true}
                            loop={true}
                            layout={'default'}
                            ref={(c) => {
                                this._carousel = c;
                            }}
                            onSnapToItem={index => this.setState({activeIndex: index})}
                            data={this.state.dataDashboard}
                            renderItem={this._renderItemMenu}
                            sliderWidth={250}
                            itemWidth={250}
                        />
                    </View>
                    <Modal
                        onSwipeComplete={() => {
                            this.setModalUnvisible(!this.state.modalVisible);
                        }}
                        scrollHorizontal
                        propagateSwipe
                        swipeDirection={['down']}
                        swipearea={50}
                        onRequestClose={() => {
                            this.setModalUnvisible(!this.state.modalVisible);
                        }}
                        animationType="slide"
                        visible={this.state.modalVisible}
                    >
                        <ScrollView style={{backgroundColor: 'white'}}>
                            <ListItem
                                title={this.state.namaPasien}
                                subtitle={moment(this.state.tanggalKunjungan).format('LLLL')
                                }
                            >
                            </ListItem>
                            <View style={{backgroundColor: 'white'}}>
                                <StepIndicator
                                    direction="horizontal"
                                    stepCount={labels.length}
                                    customStyles={customStyles}
                                    currentPosition={this.state.currentPosition}
                                    labels={labels}
                                />
                                <ViewShot ref="viewShot"
                                          style={{padding: 20, alignItems: 'center', backgroundColor: 'white'}}
                                          options={{format: 'png', quality: 20}}>

                                    <View>
                                        {this.state.dataQrCode.length != 0 ?
                                            <QRCode
                                                size={200}
                                                value={this.state.dataQrCode}
                                                logoSize={30}
                                                logoBackgroundColor='transparent'
                                                getRef={(c) => (this.svg = c)}
                                            />
                                            : null}

                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <View style={{width: 150, backgroundColor: 'white'}}>
                                            <Text style={{fontSize: 12}}>Tanggal</Text>
                                            <Text style={{fontSize: 12}}>No MR</Text>
                                            <Text style={{fontSize: 12}}>Nama</Text>
                                            <Text style={{fontSize: 12}}>Tgl Kunjungan</Text>
                                            <Text style={{fontSize: 12}}>Jam Kunjungan</Text>
                                            <Text style={{fontSize: 12}}>Poly Tujuan</Text>
                                            <Text style={{fontSize: 12}}>Cara Bayar</Text>
                                        </View>
                                        <View style={{width: 150, backgroundColor: 'white'}}>
                                            <Text style={{fontSize: 12}}>: {this.state.tanggalMendaftar}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.nomorMr}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.namaPasien}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.tanggalKunjungan}</Text>
                                            <Text
                                                style={{fontSize: 12}}>: {this.state.jamKunjunganAntrian}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.namaRuang}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.caraBayar}</Text>
                                        </View>
                                    </View>
                                    <View style={{padding: 10, backgroundColor: 'white'}}>
                                        <Text style={{fontSize: 12}}>Mohon Diperhatikan</Text>
                                        <Text style={{fontSize: 8}}>1. Pasien diharapkan hadir sebelum
                                            pukul {this.state.jamKunjungan} </Text>
                                        <Text style={{fontSize: 8}}>2. Silahkan datang ke counter checkin yang
                                            sudah
                                            kami
                                            sediakan</Text>
                                        <Text style={{fontSize: 8}}>3. bawalah bukti reservasi, Kartu Pasien,
                                            Kartu
                                            BPJS,
                                            dan surat rujukan/Surat Kontrol ulang yang masih berlaku</Text>
                                    </View>
                                    <View style={{padding: 10, backgroundColor: 'white'}}>
                                        <Text style={{fontSize: 12}}>Catatan</Text>
                                        <Text style={{fontSize: 8}}>1. Pasien yang mendaftar online akan
                                            dilayani
                                            jika,
                                            Membawa bukti reservasi pendaftaran online, kartu bpjs, dan surat
                                            rujukan
                                            yang
                                            masih berlaku (Rujukan faskes 1 berlaku selama 90 Hari)</Text>
                                        <Text style={{fontSize: 8}}>2. Jika anda datang lewat dari jam kunjungan
                                            anda,
                                            anda
                                            tidak akan dilayani</Text>
                                    </View>
                                </ViewShot>
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    padding: 10,
                                    justifyContent: 'center',
                                }}><TouchableOpacity
                                style={styles.button} onPress={() => {
                                this.saveQrToDisk();
                            }}>
                                <Text style={styles.buttonText}>Simpan Bukti Reservasi</Text>
                            </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Modal>
                </ScrollView>
                <FlashMessage position="top"/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    view1: {},
    view2: {},
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    button: {
        width: 300,
        backgroundColor: 'orange',
        borderRadius: 25,
        marginVertical: 2,
        paddingVertical: 13,
    },
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
