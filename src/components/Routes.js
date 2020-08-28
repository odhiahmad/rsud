import React, {Component} from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';
import {Text, Image, Dimensions, View, BackHandler, TouchableOpacity, Animated, ToastAndroid} from 'react-native';
import { Icon } from 'react-native-elements'
import Login from '../pages/Login';
import Signup from '../pages/daftar-akun/Signup';
import Profile from '../pages/Profile';
import Home from '../pages/Home';
import Notifikasi from '../pages/Notifikasi';
import Riwayat from '../pages/Riwayat';
import BedMonitoringIndex from '../pages/bed-monitoring/index';
import MenuPilihan from '../pages/daftar-akun/MenuPilihan';
import SignupMr from '../pages/daftar-akun/SignupMr';
import SignupMrDua from '../pages/daftar-akun/SignupMrDua';
import ShuttleBus from '../pages/shuttle-bus/ShuttleBus'
import ShuttleBusDetail from '../pages/shuttle-bus/ShuttleBusDetail';
import DaftarOnlineIndex from '../pages/daftar-online/PendaftaranOnline';
import PendaftaranOnlineDiriSendiri from '../pages/daftar-online/PendaftaranOnlineDiriSendiri';
import PendaftaranOnlineOrangLainBaru from '../pages/daftar-online/PendaftaranOnlineOrangLainBaru';
import EditProfil from '../pages/profil/EditProfil';
import Faq from '../pages/Faq';
import Pengaduan from '../pages/pengaduan/Pengaduan'
import InformasiIndex from '../pages/informasi/index';
import LupaPassword from '../pages/LupaPassword';
import JadwalPoliklinikIndex from '../pages/jadwal-poliklinik/index';
import News from '../pages/news/index'
import {Container, Header, Fab, Button} from 'native-base';
import GrayScreen from '../pages/GrayScreen';
import LengkapiPendaftaran from '../pages/daftar-akun/LengkapiPendaftaran';
import LengkapiPendaftaranHalamanDepan from '../pages/daftar-akun/LengkapiPendaftaranHalamanDepan';
import {connect} from 'react-redux';
import GantiPassword from '../pages/profil/GantiPassword';
import CariNomorMr from '../pages/daftar-online/CariNomorMr';
import LengkapiProfil from '../pages/daftar-online/LengkapiProfil';
import Obat from '../pages/Obat/Obat';
import RiwayatObat from '../pages/Obat/RiwayatObat';
import LupaPasswordSaya from '../pages/lupa-password/LupaPasswordSaya';
import CekStatusRawatJalan from '../pages/cek-status/CekStatusRawatJalan'
import CekStatusRawatInap from '../pages/cek-status/CekStatusRawatInap'
import CekStatusIGD from '../pages/cek-status/CekStatusIGD'
import PenilaianRawatInap from '../pages/penilaian/PenilaianRawatInap';
import PenilaianRawatJalan from '../pages/penilaian/PenilaianRawatJalan';
import { createStackNavigator } from 'react-navigation-stack';


let {width, height} = Dimensions.get('window');
var backButtonPressedOnceToExit = false;
class TabIcon extends Component {


    render() {
        const title = this.props.title;

        let icon = '';

        if (title == 'Beranda') {
            icon = 'home';
        } else if (title == 'Riwayat') {
            icon = 'history';
        } else if (title == 'Profil') {
            icon = 'user';
        }

        return (
            <Icon
                name={icon}
                type='font-awesome'
                color={this.props.focused ? '#24d10d' : '#1da30b'}
            />

        );
    }
}


const InboxIcon = () => {
    return (
        <View style={{marginRight: 10}}>
            <TouchableOpacity>
                <Icon
                    style={{
                        color: '#a18c95',
                    }}
                    name='sign-out'
                    type="FontAwesome"
                    size={30}
                />
            </TouchableOpacity>
        </View>
    );
};

const Logo = () => {
    return (
        <View style={{marginLeft: 10}}>
           <Image style={{width:140,height:30}} source={require('../images/logo/logo-hitam.jpg')}/>
        </View>
    );
};

class Routes extends Component<{}> {

    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100);
        this.state = {
            backClickCount: 0,
            doubleBackToExitPressedOnce: false

        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    onButtonPress = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // then navigate
        // navigate('NewScreen');
    }

    handleBackButton = () => {
        if (Actions.currentScene !== 'home' && Actions.currentScene !== 'login') {
            Actions.pop();
            return true;
        } else {
            if(this.state.doubleBackToExitPressedOnce) {
                BackHandler.exitApp();
            }
            ToastAndroid.show('Tekan tombol dua kali untuk keluar', ToastAndroid.SHORT);
            this.setState({ doubleBackToExitPressedOnce: true });
            setTimeout(() => {
                this.setState({ doubleBackToExitPressedOnce: false });
            }, 2000);
            return true;
        }

    }


    render() {

        return (

            // navigationBarStyle={{ backgroundColor: '#81b71a' }}
            <Router backAndroidHandler={this.onBackPress}>
                <Scene>
                    <Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
                        <Scene key="login" component={Login} initial={true}/>
                        <Scene key="lupapassword" component={LupaPasswordSaya} title="Lupa Password"/>
                        <Scene key="menupilihan" component={MenuPilihan}/>
                        <Scene key="signupmr" component={SignupMr}/>
                        <Scene key="singupmr2" component={SignupMrDua}/>
                        <Scene key="signup" component={Signup} title="Register"/>

                    </Scene>
                    <Scene key="app" hideNavBar={true} initial={this.props.isLoggedIn}>
                        <Scene
                            initial={this.props.getUser.status === true}
                            key="pendaftaran"
                        >
                            <Scene
                                title="Lengkapi Data Diri"
                                key="LengkapiPendaftaran"
                                component={LengkapiPendaftaran}
                            />
                        </Scene>
                        <Scene
                            lazy
                            labelStyle={{color:'black'}}
                            swipeEnabled={true}
                            initial={this.props.getUser.status === false}
                            key="tabbar"
                            tabs={true}
                        >
                            <Scene hideNavBar={true} duration={400} key="beranda" title="Beranda" icon={TabIcon}>
                                <Scene
                                    hideNavBar={true}
                                    renderLeftButton={Logo}
                                    key="home"
                                    component={Home}
                                    title=""
                                />
                                <Scene
                                    key="daftaronline"
                                    component={DaftarOnlineIndex}
                                    title="Daftar Online"
                                />
                                <Scene
                                    direction='vertical'
                                    key="daftaronlinesendiri"
                                    component={PendaftaranOnlineDiriSendiri}
                                    title="Daftar Online"
                                />
                                <Scene
                                    direction='vertical'
                                    key="daftaronlineoranglainbaru"
                                    component={PendaftaranOnlineOrangLainBaru}
                                    title="Daftar Online"
                                />

                                <Scene
                                    direction='vertical'
                                    key="lengkapiProfil"
                                    component={LengkapiProfil}
                                    title="Daftar Online (Lengkapi Profil)"
                                />
                                <Scene
                                    hideNavBar={true}
                                    key="carinomormr"
                                    component={CariNomorMr}
                                    title="Input Nomor MR"
                                />
                                <Scene
                                    hideNavBar={true}
                                    key="obat"
                                    component={Obat}
                                    title="Obat Pasien"
                                />
                                <Scene
                                    hideNavBar={true}
                                    key="jadwalpoliklinik"
                                    component={JadwalPoliklinikIndex}
                                    title="Jadwal Poliklinik"
                                />
                                <Scene
                                    hideNavBar={true}
                                    key="bedmonitoring"
                                    component={BedMonitoringIndex}
                                    title="Ketersedian Tempat Tidur"
                                />
                                <Scene
                                    key="informasi"
                                    component={InformasiIndex}
                                    title="Informasi"
                                />
                                <Scene
                                    key="shuttlebus"
                                    component={ShuttleBus}
                                    title="Shuttle Bus"
                                />
                                <Scene
                                    key="shuttlebusdetail"
                                    component={ShuttleBusDetail}
                                    title="Shuttle Bus"
                                />
                                <Scene
                                    key="faq"
                                    component={Faq}
                                    title="FAQ"
                                />
                                <Scene
                                    key="pengaduan"
                                    component={Pengaduan}
                                    title="Pengaduan Masyarakat"
                                />
                                <Scene
                                    key="news"
                                    component={News}
                                    hideNavBar={true}

                                />
                                <Scene
                                    hideNavBar={true}
                                    key="notifikasi"
                                    component={Notifikasi}
                                    title="Notifikasi"
                                />
                                <Scene
                                    hideNavBar={true}
                                    key="riwayatobat"
                                    component={RiwayatObat}
                                    title="Riwayat Obat"
                                />
                                <Scene
                                    title="Riwayat Obat"
                                    hideNavBar={true}
                                    key="cekstatusrawatjalan"
                                    component={CekStatusRawatJalan}
                                />
                                <Scene
                                    title="Riwayat Obat"
                                    hideNavBar={true}
                                    key="cekstatusrawatinap"
                                    component={CekStatusRawatInap}
                                />
                                <Scene
                                    title="Riwayat Obat"
                                    hideNavBar={true}
                                    key="cekstatusigd"
                                    component={CekStatusIGD}
                                />
                                <Scene
                                    title="Riwayat Obat"
                                    hideNavBar={true}
                                    key="penilaianrawatjalan"
                                    component={PenilaianRawatJalan}
                                />
                                <Scene
                                    title="Riwayat Obat"
                                    hideNavBar={true}
                                    key="penilaianrawatinap"
                                    component={PenilaianRawatInap}
                                />
                            </Scene>
                            <Scene  hideNavBar={true} duration={400} key="notifikasi" component={Riwayat} title="Riwayat" icon={TabIcon}>

                            </Scene>
                            {/* Tab and it's scenes */}
                            <Scene hideNavBar={true}duration={400} key="profil" title="Profil" icon={TabIcon}>
                                <Scene
                                    initial={true}
                                    key="profil"
                                    component={Profile}
                                    title="Profil"
                                />
                                <Scene
                                    key="editProfil"
                                    component={EditProfil}
                                    title="Edit Profil"
                                />
                                <Scene
                                    key="gantiPassword"
                                    component={GantiPassword}
                                    title="Ganti Password"
                                />
                            </Scene>

                        </Scene>

                    </Scene>
                </Scene>
            </Router>

        );
    }
}
mapStateToProps = (state) => ({
    getUser: state.authReducer.authData,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
