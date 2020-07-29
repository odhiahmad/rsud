import React, {Component, useEffect} from 'react';
import {baseApi} from '../../service/api';
import {ListItem, Header, Badge, Icon} from 'react-native-elements';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity, StatusBar, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import LoaderModal from '../../components/LoaderModal';
import {Actions} from 'react-native-router-flux';

export default class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            namaKelas: null,
            isLoading: true,
            data: null,
            dataDetail: null,
            isLoadingDataModal: true,
            isModalVisible: false,
            modalVisible: false,
            showTryAgain: false,
        };
    }

    componentDidMount() {
        this.getIndex();
    }

    componentWillUnmount() {

    }

    getIndex() {
        this.setState({
            loading: true,
            showTryAgain: false,
        });
        return fetch(baseApi + '/user/ruangan').then((response) => response.json()).then((responseJson) => {
            this.setState({
                loading: false,
                data: responseJson.data,
                showTryAgain: false,
            });
        })
            .catch((error) => {
                console.log(error)
                this.setState({
                    loading: false,
                    showTryAgain: true,
                });
            });
    }

    setModalUnvisible(visible) {
        this.setState({modalVisible: visible, dataDetail: null});
    }

    setModalVisible(visible, id, namaKelas) {
        this.setState({
            namaKelas: namaKelas,
            modalVisible: visible,
            loadingModal: true,
        });
        fetch(baseApi + '/user/detailRuangan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),

        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoadingDataModal: false,
                dataDetail: responseJson.data,
                loadingModal: false,

            });

        })
            .catch((error) => {
                console.log(error);
            });

    }

    renderRowDetail = ({item, index}) => {
        var tersedia = (item.map_kapasitas) - item.map_isipr + item.map_isilk;
        var terisi = item.map_isipr + item.map_isilk;
        return (
            <ListItem

                title={item.get_kelas_ketersedian[0].kelas_nama}
                subtitle={
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{width: 40}}>
                            <Icon
                                color='#1da30b'
                                type="font-awesome"
                                name="check" style={{
                                fontSize: 12,
                            }}/>
                            <Icon
                                fontSize={12}
                                color='red'
                                type="font-awesome"
                                name="close" style={{
                                fontSize: 12,
                            }}/>
                        </View>
                        <View style={{width: 100}}>
                            <Text style={{fontSize: 18, color: 'grey'}}>Tersedia</Text>
                            <Text style={{fontSize: 18, color: 'grey'}}>Terisi</Text>
                        </View>
                        <View style={{width: 100}}>
                            <Text style={{fontSize: 18, color: 'grey'}}>{tersedia}</Text>
                            <Text style={{fontSize: 18, color: 'grey'}}>{terisi}</Text>
                        </View>
                    </View>
                }
                leftAvatar={{
                    title: item.get_kelas_ketersedian[0].kelas_nama[0],
                }}
                bottomDivider
            >
            </ListItem>);
    };

    renderRow = ({item, index}) => {
        return (
            <ListItem onPress={() => {
                this.setModalVisible(true, item.map_kamarid, item.get_ruangan_ketersedian.grNama);
            }}

                      title={<Text>{item.get_ruangan_ketersedian.grNama}</Text>}
                      subtitle={<Text style={{color: 'gray'}}>Total Tersedia {item.total}</Text>}
                      leftAvatar={{
                          title: item.get_ruangan_ketersedian.grNama[0],
                      }}
                      chevron
            />
        );
    };

    renderFooter = () => {
        return (
            this.state.loadingModal ?
                <View style={styles.loader}>
                    <ActivityIndicator size="small"/>
                </View> : null
        );
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <LoaderModal
                    loading={this.state.loading}/>
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
                    centerComponent={{text: 'Monitoring Ketersedian Kamar', style: {color: '#fff'}}}
                />
                {this.state.showTryAgain === true ?
                    <View style={styles.container}>
                        <Text style={{color: 'gray'}}>Koneksi Bermasalah :(</Text>
                        <TouchableOpacity style={{
                            width: 200,
                            backgroundColor: 'red',
                            borderRadius: 25,
                            marginVertical: 2,
                            paddingVertical: 13,
                        }} onPress={() => this.getIndex()}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}>Refresh </Text>
                        </TouchableOpacity></View>:<FlatList
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}/>}

                <Modal
                    onHardwareBackPress={() => this.setModalUnvisible(!this.state.modalVisible)}
                    propagateSwipe={true}
                    modalTitle="Tes"
                    animationInTiming="300"
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalUnvisible(!this.state.modalVisible);
                    }}>
                    <View style={{flex: 1}}>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: 12,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>JADWAL {this.state.namaKelas}</Text>
                        <FlatList
                            ListFooterComponent={this.renderFooter}
                            renderItem={this.renderRowDetail}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.dataDetail}/>
                    </View>
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
    loader: {
        marginTop: 18,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 63,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});
