import React, {Component} from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';
import {Text,Image, Dimensions, View, BackHandler, TouchableOpacity, Animated} from 'react-native';


import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Home from '../pages/Home';
import Notifikasi from '../pages/Notifikasi';

import BedMonitoringIndex from '../pages/bed-monitoring/index';
import ShuttleBus from '../pages/shuttle-bus/ShuttleBus'
import ShuttleBusDetail from '../pages/shuttle-bus/ShuttleBusDetail';
import DaftarOnlineIndex from '../pages/daftar-online/index';
import FormPendaftaran from '../pages/daftar-online/form-pendaftaran';
import Faq from '../pages/Faq';
import Pengaduan from '../pages/Pengaduan'
import InformasiIndex from '../pages/informasi/index';
import LupaPassword from '../pages/LupaPassword';
import JadwalPoliklinikIndex from '../pages/jadwal-poliklinik/index';
import {Icon} from 'native-base';
import GrayScreen from '../pages/GrayScreen';

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

export default class Routes extends Component<{}> {

    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100);
        this.state = {
            backClickCount: 0,

        };
    }

    // componentWillMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    // }
    //
    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    // }
    //
    // _spring() {
    //     this.setState({backClickCount: 1}, () => {
    //         Animated.sequence([
    //             Animated.spring(
    //                 this.springValue,
    //                 {
    //                     toValue: -.15 * height,
    //                     friction: 5,
    //                     duration: 300,
    //                     useNativeDriver: true,
    //                 },
    //             ),
    //             Animated.timing(
    //                 this.springValue,
    //                 {
    //                     toValue: 100,
    //                     duration: 300,
    //                     useNativeDriver: true,
    //                 },
    //             ),
    //
    //         ]).start(() => {
    //             this.setState({backClickCount: 0});
    //         });
    //     });
    //
    // }
    //
    //
    // handleBackButton = () => {
    //     this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
    //
    //     return true;
    // };

    render() {
        return (
            // navigationBarStyle={{ backgroundColor: '#81b71a' }}
            <Router >
                <Scene>
                    <Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
                        <Scene key="login" component={Login} initial={true}/>
                        <Scene key="signup" component={Signup} title="Register"/>
                        <Scene key="lupapassword" component={LupaPassword} title="Lupa Password"/>
                    </Scene>
                    <Scene key="app" hideNavBar={true} initial={this.props.isLoggedIn}>
                        <Scene
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
                            </Scene>
                            <Scene key="notifikasi" component={Notifikasi} title="Riwayat" icon={TabIcon}>

                            </Scene>
                            {/* Tab and it's scenes */}
                            <Scene key="profil" title="Profil" icon={TabIcon}>
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
