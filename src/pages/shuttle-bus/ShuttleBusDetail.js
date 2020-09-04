import React, {Component} from 'react';
import {ListItem, Header, Badge, Icon} from 'react-native-elements';
import StepIndicator from 'react-native-step-indicator';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {baseApi} from '../../service/api';
import moment from 'moment';
import LoaderModal from '../../components/LoaderModal';
import {Actions} from 'react-native-router-flux';
import Ripple from 'react-native-material-ripple';


export default class ShuttleBusDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentPosition: 0,
            namaKelas: null,
            isLoading: true,
            dataSource: null,
            inClick: false,
            idShuttle: this.props.id,
            curTime: '',
            panjangData: null,

            showTryAgain: false,
            statusJaringan: 0,

            lastItem: '',
        };
    }

    componentDidMount() {
        this.getIndex();
    }

    getIndex() {
        setInterval(() => {
            this.setState({
                curTime: new Date().toLocaleString(),
            });
        }, 1000);

        this.setState({
            loading: true,
            showTryAgain: false,
        });
        return fetch(baseApi + '/user/shuttleDetail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.idShuttle,
            }),
        }).then((response) => response.json()).then((responseJson) => {

            if (responseJson.data.length === 0) {

                this.setState({
                    lastItem: 0,
                    showTryAgain: false,
                    statusJaringan: 1,
                    loading: false,
                    dataSource: responseJson.data,
                    panjangData: responseJson.data.length,
                });
                console.log(responseJson.data.length);
            } else {
                var array1 = responseJson.data;
                var last_element = array1[array1.length - 3].id;
                this.setState({
                    lastItem: last_element,
                    showTryAgain: false,
                    statusJaringan: 1,
                    loading: false,
                    dataSource: responseJson.data,
                    panjangData: responseJson.data.length,
                });
            }


        }).catch((error) => {
            this.setState({
                showTryAgain: true,
                statusJaringan: 2,
                loading: false,
            });
        });
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    renderRow = ({item, index}) => {
        var labels = [];

        for (let i = 0; i < this.state.dataSource.length; i++) {
            labels.push(this.state.dataSource[i].rute);
        }
        var today = new Date();
        var time = null;
        if (today.getHours() > 9) {
            if (today.getMinutes() > 9) {
                if (today.getSeconds() > 9) {
                    time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                } else {
                    time = today.getHours() + ':' + today.getMinutes() + ':0' + today.getSeconds();
                }
            } else {
                if (today.getSeconds() > 9) {
                    time = today.getHours() + ':' + '0' + today.getMinutes() + ':' + today.getSeconds();
                } else {
                    time = today.getHours() + ':' + '0' + today.getMinutes() + ':0' + today.getSeconds();
                }
            }
        } else {
            if (today.getMinutes() > 9) {
                if (today.getSeconds() > 9) {
                    time = '0' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                } else {
                    time = '0' + today.getHours() + ':' + today.getMinutes() + ':0' + today.getSeconds();
                }
            } else {
                if (today.getSeconds() > 9) {
                    time = '0' + today.getHours() + ':' + '0' + today.getMinutes() + ':' + today.getSeconds();
                } else {
                    time = '0' + today.getHours() + ':' + '0' + today.getMinutes() + ':0' + today.getSeconds();
                }
            }
        }

        var dt = new Date();
        dt.setMinutes(dt.getMinutes() + 15);
        var time1 = null;

        if (dt.getHours() > 9) {
            if (dt.getMinutes() > 9) {
                time1 = dt.getHours() + ':' + dt.getMinutes() + ':00';
            } else {
                time1 = dt.getHours() + ':' + '0' + dt.getMinutes() + ':00';
            }
        } else {
            if (dt.getMinutes() > 9) {
                time1 = '0' + dt.getHours() + ':' + dt.getMinutes() + ':00';
            } else {
                time1 = '0' + dt.getHours() + ':' + '0' + dt.getMinutes() + ':00';

            }
        }

        var dt1 = new Date();
        dt1.setMinutes(dt1.getMinutes() - 10);
        var time2 = null;

        if (dt1.getHours() > 9) {
            if (dt1.getMinutes() > 9) {
                time2 = dt1.getHours() + ':' + dt1.getMinutes() + ':00';
            } else {
                time2 = dt1.getHours() + ':' + '0' + dt1.getMinutes() + ':00';
            }
        } else {
            if (dt1.getMinutes() > 9) {
                time2 = '0' + dt1.getHours() + ':' + dt1.getMinutes() + ':00';
            } else {
                time2 = '0' + dt1.getHours() + ':' + '0' + dt1.getMinutes() + ':00';
            }
        }

        var posisiSekarang = 0;
        for (let i = 0; i < labels.length; i++) {
            if (i === 0) {
                posisiSekarang = i;

            } else {
                if ((time >= this.state.dataSource[i - 1].jam) && (time <= this.state.dataSource[i].jam)) {
                    posisiSekarang += i;
                }
            }

        }

        var a = parseInt(this.state.dataSource[posisiSekarang - 1].jam.substr(3, 2)) + 1;
        var b = this.state.dataSource[posisiSekarang - 1].jam.substr(0, 2);
        var c = this.state.dataSource[posisiSekarang - 1].jam.substr(6, 2);

        var total = '';
        if (a <= 9) {
            total = b + ':0' + a + ':' + c;
        } else {
            total = b + ':' + a + ':' + c;
        }

        // if((posisiSekarang > index + 1) || (posisiSekarang === index) || (posisiSekarang < index -1)){

        // if(this.state.lastItem === this.state.dataSource[posisiSekarang].id){
        //     Actions.shuttlebus()
        // }
        // console.log({
        //     "lastItem" : this.state.lastItem,
        //     "source" : this.state.dataSource[posisiSekarang].id
        // })

        console.log(time1)
        if (item.jam >= time2 && item.jam <= time1) {
            return (
                <ListItem
                    title={<Text>{item.jam}</Text>}
                    subtitle={
                        index === posisiSekarang ?
                            <Text note>Sedang di Perjalanan menuju {this.Capitalize(item.rute)}</Text> :
                            index > posisiSekarang ?
                                <Text>Akan Sampai di {this.Capitalize(item.rute)}</Text> :
                                ((index === posisiSekarang - 1) && (time <= total)) ?
                                    <Text note>Sedang Berhenti {this.Capitalize(item.rute)}</Text> :
                                    <Text note>Sudah Melewati {this.Capitalize(item.rute)}</Text>}
                    leftAvatar={<View
                        style={index === posisiSekarang ? {
                            margin: 10,
                            width: 40,
                            height: 40,
                            borderWidth: 1,
                            borderColor: 'green',
                            borderRadius: 50,
                            justifyContent: 'center',
                        } : ((index === posisiSekarang - 1) && (time <= total)) ? {
                            margin: 10,
                            width: 40,
                            height: 40,
                            borderWidth: 1,
                            borderColor: 'red',
                            borderRadius: 50,
                            justifyContent: 'center',
                        } : {
                            margin: 10,
                            width: 40,
                            height: 40,
                            borderWidth: 1,
                            borderColor: 'orange',
                            borderRadius: 50,
                            justifyContent: 'center',
                        }}>
                        {index === posisiSekarang ? <Icon
                            color='green'
                            fontSize='30'
                            type="font-awesome"
                            name="step-forward" style={{
                            alignSelf: 'center',
                            position: 'absolute',
                        }}/> : ((index === posisiSekarang - 1) && (time <= total)) ? <Icon
                            fontSize="20"
                            color='red'
                            type="font-awesome"
                            name="stop" style={{
                            alignSelf: 'center',
                            position: 'absolute',
                        }}/> : index < posisiSekarang ? <Icon
                            fontSize="20"
                            color='orange'
                            type="font-awesome"
                            name="check" style={{
                            alignSelf: 'center',
                            position: 'absolute',
                        }}/> : <Icon
                            fontSize="20"
                            color='orange'
                            type="font-awesome"
                            name="circle" style={{
                            alignSelf: 'center',
                            position: 'absolute',
                        }}/>}

                    </View>}
                >
                </ListItem>
            );
        }

    };

    render() {

        return (
            <View style={{flex: 1}}>
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
                    centerComponent={{text: 'Shuttle Bus Detail', style: {color: '#fff'}}}
                />
                <LoaderModal
                    loading={this.state.loading}/>
                {this.state.showTryAgain === true ?
                    <View style={styles.container}>
                        <ListItem title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                                  subtitle={<Text>Jadwal Bus Pada Jam 7 Pagi, 9 Pagi, dan 1 Siang WIB</Text>}
                        ></ListItem></View>
                    :
                    <View>
                        {this.state.statusJaringan === 2 ?
                            <ListItem title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                                      subtitle={<Text>Jadwal Bus Pada Jam 7 Pagi, 9 Pagi, dan 1 Siang WIB</Text>}
                            ></ListItem> : this.state.statusJaringan === 1 ? <View>
                                    {this.state.panjangData === 0 && this.state.idShuttle === 1 ?
                                        <ListItem title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                                                  subtitle={<Text>Jadwal Bus Pada Jam 7 Pagi, 9 Pagi, dan 1 Siang
                                                      WIB</Text>}
                                        ></ListItem> : this.state.panjangData === 0 && this.state.idShuttle === 2 ?
                                            <ListItem title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                                                      subtitle={<Text>Jadwal Bus Pada Jam 7 Pagi, 9 Pagi, dan 1 Siang
                                                          WIB</Text>}
                                            ></ListItem> :
                                            <View>
                                                <FlatList
                                                    renderItem={this.renderRow}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    data={this.state.dataSource}/>
                                            </View>
                                    }</View>
                                : <View>
                                    <ListItem title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                                              subtitle={<Text>Jadwal Bus Pada Jam 7 Pagi, 9 Pagi, dan 1 Siang
                                                  WIB</Text>}
                                    ></ListItem>
                                </View>
                        }
                    </View>}


            </View>
        );
    }
}
const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});
