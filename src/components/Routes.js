import React, {Component} from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';
import {Text,Image, Dimensions, View, BackHandler, TouchableOpacity, Animated} from 'react-native';


import Login from '../pages/Login';
import Signup from '../pages/daftar-akun/Signup';
import Profile from '../pages/Profile';
import Home from '../pages/Home';
import Notifikasi from '../pages/Notifikasi';

import BedMonitoringIndex from '../pages/bed-monitoring/index';
import MenuPilihan from '../pages/daftar-akun/MenuPilihan';
import SignupMr from '../pages/daftar-akun/SignupMr';
import SignupMrDua from '../pages/daftar-akun/SignupMrDua';
import ShuttleBus from '../pages/shuttle-bus/ShuttleBus'
import ShuttleBusDetail from '../pages/shuttle-bus/ShuttleBusDetail';
import DaftarOnlineIndex from '../pages/daftar-online/index';
import FormPendaftaran from '../pages/daftar-online/form-pendaftaran';
import Faq from '../pages/Faq';
import Pengaduan from '../pages/Pengaduan'
import InformasiIndex from '../pages/informasi/index';
import LupaPassword from '../pages/LupaPassword';
import JadwalPoliklinikIndex from '../pages/jadwal-poliklinik/index';
import News from '../pages/news/index'
import {Icon,Container, Header, Fab, Button} from 'native-base';
import GrayScreen from '../pages/GrayScreen';
import LengkapiPendaftaran from '../pages/daftar-akun/LengkapiPendaftaran';
import LengkapiPendaftaranHalamanDepan from '../pages/daftar-akun/LengkapiPendaftaranHalamanDepan';
import {connect} from 'react-redux';

let {width, height} = Dimensions.get('window');

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
            <Icon name={icon} type="FontAwesome" style={{color: this.props.focused ? '#057ce4' : '#afafa4'}}/>
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

        };
    }
    render() {
        console.log(this.props.getUser.status)
        return (

            // navigationBarStyle={{ backgroundColor: '#81b71a' }}
            <Router >
                <Scene>
                    <Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
                        <Scene key="login" component={Login} initial={true}/>
                        <Scene key="menupilihan" component={MenuPilihan}/>
                        <Scene key="signupmr" component={SignupMr}/>
                        <Scene key="singupmr2" component={SignupMrDua}/>
                        <Scene key="signup" component={Signup} title="Register"/>
                        <Scene key="lupapassword" component={LupaPassword} title="Lupa Password"/>
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
                            initial={this.props.getUser.status === false}
                            key="tabbar"
                            tabs={true}
                            tabBarStyle={{backgroundColor: '#FFFFFF'}}
                        >
                            <Scene key="beranda" title="Beranda" icon={TabIcon}>
                                <Scene
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
                                    key="formpendaftaran"
                                    component={FormPendaftaran}
                                    title="Form Pendaftaran"
                                />
                                <Scene
                                    key="jadwalpoliklinik"
                                    component={JadwalPoliklinikIndex}
                                    title="Jadwal Poliklinik"
                                />
                                <Scene
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
                            </Scene>
                            <Scene key="notifikasi" component={Notifikasi} title="Riwayat" icon={TabIcon}>

                            </Scene>
                            {/* Tab and it's scenes */}
                            <Scene key="profil" title="Profil" renderRightButton={InboxIcon}   icon={TabIcon}>
                                <Scene
                                    key="profil"
                                    component={Profile}
                                    title="Profil"
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
