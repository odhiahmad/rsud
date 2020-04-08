import React, {Component} from 'react';
import {
    StyleSheet,
    Animated,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    BackHandler,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/auth.actions';
import {BottomLayer} from './component/BottomLayer';
import {Icon,Container, Header, Button, Content, Text} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {SliderBox} from 'react-native-image-slider-box';
import PushNotification from 'react-native-push-notification';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import FlashMessage from 'react-native-flash-message';

type Props = {}
let {width, height} = Dimensions.get('window');
const options = [
    'Keluar',
    <Text onPress={Actions.daftaronline}>Daftar Sendiri</Text>,
    <Text onPress={Actions.daftaronline}>Daftar Untuk Orang Lain</Text>
]

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
            inClickHome: false,
            inClickHomeSendiri: false,
            inClickBed: false,
            inClickJadwal: false,
            inClickInfo: false,
            inClickShuttle:false,
            inClickFaq:false,
            inClickPengaduan:false,
            inClickNews:false,


        };
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    async componentDidMount(){
        PushNotification.configure({
            onNotification: function (notification) {
               console.log("Notification ",notification)
            }
        })
    }
    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };

    onClickButtonHome = () => {
        this.setState({inClickHome: true});
        Actions.daftaronline();
        this.ActionSheet.hide()
        setTimeout(function () {
            this.setState({inClickHome: false});
        }.bind(this), 2000);
    };
    onClickButtonHomeSendiri = () => {
        this.setState({inClickHomeSendiri: true});
        Actions.daftaronlinesendiri();
        this.ActionSheet.hide()
        setTimeout(function () {
            this.setState({inClickHomeSendiri: false});
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
    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<Text style={{color: '#000', fontSize: 18}}>Pilih Jenis Daftar</Text>}
                        options={
                            [
                                'Keluar',
                                <Text onPress={!this.state.inClickHome ? this.onClickButtonHome : null}>Daftar Sendiri</Text>,
                                <Text onPress={!this.state.inClickHomeSendiri ? this.onClickButtonHomeSendiri : null}>Daftar Untuk Orang Lain</Text>
                            ]
                        }
                        cancelButtonIndex={0}
                        destructiveButtonIndex={4}
                        onPress={(index) => { /* do something */ }}
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
                            position: "absolute",
                            bottom: 0,
                            padding: 0,
                            alignItems: "center",
                            alignSelf: "center",
                            justifyContent: "center",
                            paddingVertical: 10
                        }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginHorizontal: 0,
                            padding: 0,
                            margin: 0,
                            backgroundColor: "rgba(128, 128, 128, 0.92)"
                        }}
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        autoplay
                        circleLoop/>
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <View style={{marginHorizontal: 2, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginTop: 18}}>
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
                                                borderWidth: 1,
                                                borderColor: 'red',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                name="paper" style={{
                                                fontSize: 30,
                                                color: 'red',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
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
                                                borderWidth: 1,
                                                borderColor: 'blue',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                name="calendar" style={{
                                                fontSize: 30,
                                                color: 'blue',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
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
                                                borderWidth: 1,
                                                borderColor: '#1aed28',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                name="bed" style={{
                                                fontSize: 30,
                                                color: '#1aed28',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
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
                                                borderWidth: 1,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                type="FontAwesome"
                                                name="bus" style={{
                                                fontSize: 30,
                                                color: 'orange',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
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
                                                borderWidth: 1,
                                                borderColor: 'red',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                type="FontAwesome"
                                                name="comments" style={{
                                                fontSize: 30,
                                                color: 'red',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>FAQ</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        // onPress={!this.state.inClickPengaduan ? this.onClickButtonPengaduan : null}
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
                                                borderWidth: 1,
                                                borderColor: 'purple',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon

                                                name="headset" style={{
                                                fontSize: 30,
                                                color: 'purple',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
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
                                                borderWidth: 1,
                                                borderColor: 'orange',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                type="FontAwesome"
                                                name="tablet" style={{
                                                fontSize: 30,
                                                color: 'orange',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
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
                                                borderWidth: 1,
                                                borderColor: '#f542b0',
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                type="FontAwesome"
                                                name="info" style={{
                                                fontSize: 30,
                                                color: '#f542b0',
                                                alignSelf: 'center',
                                                position: 'absolute',
                                            }}/>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: 6,
                                            }}>Information</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/*<View style={{paddingTop: 16, paddingHorizontal: 16}}>*/}
                        {/*    <View>*/}
                        {/*        <Image source={require('../images/sepak-bola.jpg')}*/}
                        {/*               style={{height: 170, width: '100%', borderRadius: 6}}></Image>*/}
                        {/*    </View>*/}
                        {/*    <View style={{paddingTop: 16, paddingBottom: 20}}>*/}
                        {/*        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1c1c1c'}}>RSUD-NEWS</Text>*/}
                        {/*        <Text style={{fontSize: 14, fontWeight: '500', color: '#7a7a7a'}}>Tim Jagua Grebek Rumah*/}
                        {/*            untuk ritual santet</Text>*/}
                        {/*    </View>*/}
                        {/*</View>*/}
                    </View>
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
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
