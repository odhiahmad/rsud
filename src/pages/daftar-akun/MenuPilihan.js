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
                <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <View style={{marginHorizontal: 2, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginTop: 200}}>
                                <View style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    height: '100%',
                                    width: '100%',
                                    marginBottom: 4,
                                }}>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickHome ? this.onClickButtonAkunMr : null}
                                        style={{
                                            marginRight: 2,
                                            width: '50%',
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
                                            }}>Sudah Punya Nomor MR ? Silahkan Klik Disini</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={!this.state.inClickJadwal ? this.onClickButtonAkunBaru : null}
                                        style={{
                                            marginRight: 2,
                                            width: '50%',
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
                                            }}>Daftar Akun Baru ? Silahkan Klik Disini</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
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
});

export default MenuPilihan;
