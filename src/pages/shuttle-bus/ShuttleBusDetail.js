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

            this.setState({
                showTryAgain: false,
                statusJaringan: 1,
                loading: false,
                dataSource: responseJson.data,
                panjangData: responseJson.data.length,
            });
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


        if (this.state.panjangData === 0) {
            return (
                <ListItem
                    title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                >
                </ListItem>);
        } else {
            var a = parseInt(this.state.dataSource[posisiSekarang - 1].jam.substr(3, 2)) + 1;


            var b = this.state.dataSource[posisiSekarang - 1].jam.substr(0, 2);
            var c = this.state.dataSource[posisiSekarang - 1].jam.substr(6, 2);
            var total = '';
            if (a <= 9) {
                total = b + ':0' + a + ':' + c;
            } else {
                total = b + ':' + a + ':' + c;
            }


            return (
                <ListItem
                    title={<Text>{item.jam}</Text>}
                    subtitle={index === posisiSekarang ?
                        <Text note>Sedang di Perjalanan
                            menuju {this.Capitalize(item.rute)}</Text> :
                        index > posisiSekarang ?
                            <Text>Akan Sampai di {this.Capitalize(item.rute)}</Text> :
                            (index === posisiSekarang - 1 && time <= total) ?
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
                        } : (index === posisiSekarang - 1 && time <= total) ? {
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
                        {index === posisiSekarang && time >= total ? <Icon
                            color='green'
                            fontSize='30'
                            type="font-awesome"
                            name="step-forward" style={{
                            alignSelf: 'center',
                            position: 'absolute',
                        }}/> : (index === posisiSekarang - 1 && time <= total) ? <Icon
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
                        <Icon type='ionicon' name='arrow-back-outline' color='#fff'
                              onPress={()=>Actions.pop()}/>}
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
                                                      subtitle={<Text>Jadwal Bus Pada Jam 8 Pagi, 10 Pagi, dan 2 Siang
                                                          WIB</Text>}
                                            ></ListItem> : <FlatList
                                                renderItem={this.renderRow}
                                                keyExtractor={(item, index) => index.toString()}
                                                data={this.state.dataSource}/>
                                    }</View>
                                : <View></View>}
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
