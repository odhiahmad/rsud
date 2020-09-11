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
    TouchableOpacity, Modal,
} from 'react-native';
import {baseApi} from '../../service/api';
import moment from 'moment';
import LoaderModal from '../../components/LoaderModal';
import {Actions} from 'react-native-router-flux';
import Ripple from 'react-native-material-ripple';
import ViewShot from "react-native-view-shot";


export default class ShuttleBusDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentPosition: 0,
            namaKelas: null,
            isLoading: true,
            dataSource: null,
            dataPenumpang: null,
            inClick: false,
            idShuttle: this.props.id,
            curTime: '',
            panjangData: null,

            showTryAgain: false,
            statusJaringan: 0,

            lastItem: '',
            modalVisible: false,
            modalVisiblePeta:false,

            rute:null,
            ruteJam:null,

            jam:null,
            jam1:null,
            jam2:null,
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
                    statusJaringan: 1,
                    loading: false,
                    dataSource: responseJson.data,
                    panjangData: responseJson.data.length,

                });

            } else {

                var array1 = responseJson.data;
                var last_element = array1[array1.length - 3].id;
                this.setState({
                    jam:responseJson.jam,
                    rute:responseJson.dataInfo.rute,
                    ruteJam:responseJson.dataInfo.rute_jam,
                    lastItem: last_element,
                    dataSource: responseJson.data,
                    panjangData: responseJson.data.length,
                    dataPenumpang: responseJson.dataPenumpang,
                });
                console.log(responseJson.dataInfo)
                if(this.state.jam === null){
                    this.setState({
                        loading: false,

                    });
                }else{
                    this.setState({
                        statusJaringan: 1,
                        loading: false,
                    });
                }
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

    setModalUnvisiblePeta(visible) {
        this.setState({
            modalVisiblePeta: visible,
        });
    }

    setModalVisiblePeta(visible) {
        this.setState({
            modalVisiblePeta: visible,
        });
    }

    renderRowDetail = ({item, index}) => {
        return (
            <ListItem
                title={ <View style={{flexDirection: 'row'}}>
                    <View style={{width: 120, backgroundColor: 'white'}}>
                        <Text>Lokasi</Text>
                        <Text>Total Penumpang</Text>
                    </View>
                    <View style={{width: 200, backgroundColor: 'white'}}>
                        <Text style={{color:'gray'}}>{this.Capitalize(item.tempat_tunggu)}</Text>
                        <Text style={{color:'gray'}}>{item.total}</Text>
                    </View>
                    </View>}
                chevron
                bottomDivider
            />
        );
    };

    renderRow = ({item, index}) => {

        var time = this.state.jam


        var labels = [];

        for (let i = 0; i < this.state.dataSource.length; i++) {
            labels.push(this.state.dataSource[i].rute);
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
                    rightComponent={
                        <Ripple onPress={() => this.getIndex()}>
                            <Icon type='font-awesome-5' name='sync' color='#fff'/></Ripple>}
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: this.state.rute === null ? 'Shuttle Bus Detail':this.state.rute, style: {color: '#fff'}}}
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
                                            <ScrollView>
                                                <ListItem
                                                    onPress={() => {
                                                        this.setModalVisible(true);
                                                    }}
                                                    title={<Text>Informasi Penumpang</Text>}
                                                    subtitle={<Text style={{color: 'gray'}}>Detail</Text>}
                                                    chevron
                                                    bottomDivider
                                                ></ListItem>
                                                <ListItem
                                                    onPress={() => {
                                                        this.setModalVisiblePeta(true);
                                                    }}
                                                    title={<Text>Informasi Peta</Text>}
                                                    subtitle={<Text style={{color: 'gray'}}>Detail</Text>}
                                                    chevron
                                                    bottomDivider
                                                ></ListItem>
                                                <View>
                                                    <FlatList
                                                        renderItem={this.renderRow}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        data={this.state.dataSource}/>
                                                </View>

                                            </ScrollView>
                                    }</View>
                                : <View>
                                    <ListItem title={<Text>Tidak ada Jadwal Bus Pada Jam Ini</Text>}
                                              subtitle={<Text>Jadwal Bus Pada Jam 7 Pagi, 9 Pagi, dan 1 Siang
                                                  WIB</Text>}
                                    ></ListItem>
                                </View>
                        }
                    </View>}

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
                    <ListItem
                        title={this.state.rute}
                        subtitle={this.state.ruteJam
                        }
                        bottomDivider
                    >
                    </ListItem>

                        <FlatList
                            renderItem={this.renderRowDetail}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.dataPenumpang}/>

                </Modal>

                <Modal
                    onSwipeComplete={() => {
                        this.setModalUnvisiblePeta(!this.state.modalVisiblePeta);
                    }}
                    scrollHorizontal
                    propagateSwipe
                    swipeDirection={['down']}
                    swipearea={50}
                    onRequestClose={() => {
                        this.setModalUnvisiblePeta(!this.state.modalVisiblePeta);
                    }}
                    animationType="slide"
                    visible={this.state.modalVisiblePeta}
                >
                    <ListItem
                        title={this.state.namaPasien}
                        subtitle={moment(this.state.tanggalKunjungan).format('LLLL')
                        }
                    >
                    </ListItem>

                </Modal>

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
