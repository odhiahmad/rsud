import React, {Component, useEffect} from 'react';
import {baseApi, baseUrlFoto} from '../../service/api';
import CustomLoader from '../../components/CustomLoader';
import CustomLoader1 from '../../components/CustomLoader';
import {ListItem, Header, Badge, Icon} from 'react-native-elements';
import {
    StatusBar,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity, Image, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import LoaderModal from '../../components/LoaderModal';
import moment from 'moment';
import {Actions} from 'react-native-router-flux';

export default class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingModal: false,
            loading: false,
            namaKelas: null,
            showTryAgain: false,
            isLoading: true,
            dataSource: null,
            data: [],
            dataDetail: null,
            isLoadingDataModal: true,
            isModalVisible: false,
            modalVisible: false,
            urlImage: '',
        };
    }

    componentDidMount() {
        this.getIndex();
    }

    getIndex() {
        this.setState({
            loading: true,
            showTryAgain: false,
        });
        return fetch(baseApi + '/user/poly').then((response) => response.json()).then((responseJson) => {
            this.setState({
                loading: false,
                data: responseJson.data,
                showTryAgain: false,
            });
        })
            .catch((error) => {
                console.log(error);
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
        fetch(baseApi + '/user/polyDetail', {
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
                loadingModal: false,
                dataDetail: responseJson.data,
                urlImage: responseJson.urlImage,

            });

        })
            .catch((error) => {

            });

    }

    renderRowDetail = ({item, index}) => {
        return (
            <ListItem
                title={item.get_dokter_jadwal[0].dokter_nama}
                subtitle={<View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: 100}}>
                        <Text style={{color: 'grey'}}>Hari</Text>
                        <Text style={{color: 'grey'}}>Jam Mulai</Text>
                        <Text style={{color: 'grey'}}>Jam Selesai</Text>
                        <Text style={{color: 'grey'}}>Jam Checkin</Text>
                    </View>
                    <View style={{width: 100}}>
                        <Text>{item.jadwal_hari}</Text>
                        <Text>{item.jadwal_jam_mulai}</Text>
                        <Text>{item.jadwal_jam_selesai}</Text>
                        <Text>{item.jadwal_jam_selesai}</Text>
                    </View>

                </View>}
                rightAvatar={
                    item.get_dokter_jadwal[0].dokter_fhoto != null ?
                        {
                            rounded: true,
                            height: 80,
                            width: 80,
                            source: this.state.urlImage && {uri: this.state.urlImage + '/' + item.get_dokter_jadwal[0].dokter_fhoto},
                            title: item.get_dokter_jadwal[0].dokter_nama[0],
                        }
                        :
                        {
                            rounded: true,
                            height: 80,
                            width: 80,
                            source: require('../../images/dokter.png'),
                            title: item.get_dokter_jadwal[0].dokter_nama[0],
                        }


                }
                bottomDivider
            >
            </ListItem>);
    };

    renderRow = ({item, index}) => {
        return (
            <ListItem onPress={() => {
                this.setModalVisible(true, item.poly_id, item.poly_nama);
            }}

                      title={<Text>{item.poly_nama}</Text>}
                      leftAvatar={{
                          title: item.poly_nama[0],
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
                    centerComponent={{text: 'Jadwal Poliklinik', style: {color: '#fff'}}}
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
                        </TouchableOpacity></View>: <FlatList
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
