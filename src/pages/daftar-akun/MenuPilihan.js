import React, {Component} from 'react';
import {
    StyleSheet,
    Animated,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    BackHandler,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {SliderBox} from 'react-native-image-slider-box';
import Logo from '../../components/Logo';

type Props = {}
let {width, height} = Dimensions.get('window');

class MenuPilihan extends Component {
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100);
        this.state = {
            inClickAkunBaru: false,
            inClickAkunLama: false,


        };
    }

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };

    goBack() {
        Actions.login();
    }

    onClickButtonAkunBaru = () => {
        this.setState({inClickAkunBaru: true});
        Actions.signup();
        setTimeout(function () {
            this.setState({inClickAkunBaru: false});
        }.bind(this), 2000);
    };
    onClickButtonAkunLama = () => {
        this.setState({inClickAkunLama: true});
        Actions.signupmr();
        setTimeout(function () {
            this.setState({inClickAkunLama: false});
        }.bind(this), 2000);
    };
    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{marginVertical: 15,flex: 1, backgroundColor: 'white'}}>
                    <Logo/>
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <View style={{marginHorizontal: 2, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginTop: 50}}>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    height: '100%',
                                    width: '100%',
                                    marginBottom: 4,
                                }}>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickAkunLama ? this.onClickButtonAkunLama : null}
                                        style={{
                                            marginRight: 2,
                                            width: '50%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 140,
                                                height: 140,
                                                borderWidth: 1,
                                                borderColor: 'black',
                                                borderRadius: 0,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                name="paper" style={{
                                                fontSize: 30,
                                                color: 'black',
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
                                            }}>Sudah Punya Nomor MR? Silahkan Klik Disini</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickAkunBaru ? this.onClickButtonAkunBaru : null}
                                        style={{
                                            marginRight: 2,
                                            width: '50%',
                                            height: '60%',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                margin: 10,
                                                width: 140,
                                                height: 140,
                                                borderWidth: 1,
                                                borderColor: 'black',
                                                borderRadius: 0,
                                                justifyContent: 'center',
                                            }}>
                                            <Icon
                                                name="calendar" style={{
                                                fontSize: 30,
                                                color: 'black',
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
                                            }}>Daftar Akun Baru? Silahkan Klik Disini</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>

                        </View>
                    </View>
                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>Sudah mempunyai akun?, silahkan</Text>
                        <TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}> Login</Text></TouchableOpacity>

                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
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
});

export default MenuPilihan;
