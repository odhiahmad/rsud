import React, {Component} from 'react';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {Header, Icon, ListItem} from 'react-native-elements';
import ModalKomponen from '../../components/Modal';
import CustomRow from '../../components/CustomRow';
import {baseApi, baseUrlFoto} from '../../service/api';
import LoaderModal from '../../components/LoaderModal';

import {
    ScrollView,
    Text,
    ToastAndroid,
    ActivityIndicator,
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    Share,
    SearchBar, RefreshControl, StatusBar,
} from 'react-native';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';
import StepIndicator from 'react-native-step-indicator';
import ViewShot from 'react-native-view-shot';
import {Actions} from 'react-native-router-flux';
import Ripple from 'react-native-material-ripple';

const {height} = Dimensions.get('window');
const resources = {
    file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
    url: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
    base64: 'JVBERi0xLjMKJcfs...',
};

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
};
const labels = ['Mendaftar', 'Sedang Berobat', 'Selesai Berobat', 'Mendapatkan Obat', 'Selesai'];

class Obat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            dataIsi: null,
            dataJudul: null,
            modalArticleData: {},
            setModalVisible: false,
            namaKelas: null,
            isLoading: false,
            dataSource: null,
            dataDetail: null,
            isLoadingDataModal: true,
            isModalVisible: false,
            modalVisible: false,
            modalVisibleRiwayat: false,
            loading: true,
            data: [],
            page: 1,
            dataPostLink: null,
            dataPostTanggal: null,
            searchText: null,
            searchAktif: 1,
            svg: '',

            index: 0,
            dataQrCode: [],
            namaPasien: '',
            namaDokter: '',
            tanggalKunjungan: '',
            jamKunjungan: '',
            tanggalLahir: '',
            nomorMr: '',
            jenisKelamin: '',
            status_berobat: '',
            busy: true,
            imageSaved: false,
            currentPosition: 0,
            inClick: false,
            idShuttle: this.props.id,
            idTrip: this.props.idTrip,
            tanggalMendaftar: '',
            namaRuang: '',
            jamKunjunganLabel: '',
            caraBayar: '',

            showTryAgain: false,

            onClickButtonRiwayatObat: false,

        };
    }

    onPageChange(position) {
        this.setState({currentPosition: position});
    }

    componentDidMount() {
        this.getData();
    }


    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    setModalUnvisibleRiwayat(visible) {
        this.setState({
            modalVisibleRiwayat: visible,
        });
    }

    handleLoadMore = () => {

        if (this.state.data.length >= 5) {
            this.setState(
                {page: this.state.page + 1, isLoading: true},
                this.getData,
            );
        }

    };

    renderFooter = () => {
        return (
            this.state.isLoading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View> : null
        );
    };

    hideAlert = () => {

        this.setState({
            showAlert: false,
        });

    };

    getData = async () => {
        this.setState({
            loading: true,
            showTryAgain: false,
        });

        const url = baseApi + '/user/getNotifikasiObat?page=' + this.state.page;
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                id: this.props.getUser.userDetails.id,
            }),

        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                loading: false,
                showTryAgain: false,
                data: this.state.data.concat(responseJson.data.data),
            });
        }).catch((error) => {
            this.setState({
                loading: false,
                showTryAgain: true,
            });

            console.log(this.state.showTryAgain);
        });
    };

    showData = async () => {

        const url = baseApi + '/user/getRiwayatPendaftaran?page=' + this.state.page;
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                id: this.props.getUser.userDetails.id,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoading: false,
                data: responseJson.data.data,
            });


        }).catch((error) => {

        });
    };

    setModalVisible(visible, id) {
        this.setState({
            modalVisible: visible,
        });
        fetch(baseApi + '/user/getNotifikasiObatDetail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                id: id,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                dataDetail: responseJson.data,
            });

        }).catch((error) => {

        });


    }

    setModalVisibleRiwayat(visible) {
        this.setState({
            modalVisibleRiwayat: visible,
        });


    }

    _onRefresh = () => {
        this.setState({isLoading: true}, this.showData);

    };


    _onChangeSearchText(text) {


        if (text === '') {
            this.setState({
                searchAktif: 0,
            });
        } else {
            this.setState(
                {page: 1, searchAktif: 1, isLoading: false, searchText: text},
                this.searchData,
            );
        }

    }

    onClickButtonRiwayatObat = () => {
        this.setState({inClickRiwayatObat: true});
        Actions.riwayatobat();
        setTimeout(function () {
            this.setState({inClickRiwayatObat: false});
        }.bind(this), 2000);
    };

    // renderRow = ({item, index}) => {
    //     var time = moment(item.tgl_masuk).format('LLLL');
    //     return (
    //         <ListItem onPress={() => {
    //             this.setModalVisible(true, item.idx);
    //         }}
    //
    //                   title={item.nama_pasien}
    //                   leftAvatar={{
    //                       source: {uri: baseUrlFoto + 'profile/' + item.foto},
    //                       title: item.nama_pasien[0],
    //                   }}
    //                   subtitle={<View>
    //                       <Text style={{color: 'grey'}}>{item.namaDokterJaga}</Text>
    //                       <Text style={{color: 'grey'}}>{item.status_berobat}</Text>
    //                       <Text>{time}</Text></View>}
    //                   bottomDivider
    //                   chevron
    //         >
    //         </ListItem>
    //     );
    // };

    renderRow = ({item, index}) => {
        var time = moment(item.tgl_masuk).format('LLLL');
        return (
            <ListItem onPress={() => {
                this.setModalVisible(true, item.idx);
            }}

                      title={item.nama_pasien}
                      leftAvatar={{
                          source: {uri: baseUrlFoto + 'profile/' + item.foto},
                          title: item.nama_pasien[0],
                      }}
                      subtitle={<View>
                          <Text style={{color: 'grey'}}>{item.namaDokterJaga}</Text>
                          <Text style={{color: 'grey'}}>{item.status_berobat}</Text>
                          <Text>{time}</Text></View>}
                      bottomDivider
                      chevron
            >
            </ListItem>
        );
    };
    renderRowDetail = ({item, index}) => {
        return (
            <ListItem
                title={item.NMBRG}
                subtitle={<View>
                    {/*<Text style={{color: 'grey'}}>{item.NMBRG}</Text>*/}
                    <Text style={{color: 'grey'}}>{item.AP}</Text>
                </View>}

            >
            </ListItem>
        );
    };

    render() {
        let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
        return (
            <View style={{flex: 1}}>
                <LoaderModal
                    loading={this.state.loading}/>
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
                    rightComponent={
                        <Ripple onPress={!this.state.inClickRiwayatObat ? this.onClickButtonRiwayatObat : null}>
                        <Icon name='history' color='#fff'
                              /></Ripple>}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Obat Pasien', style: {fontWeight: 'bold', color: '#fff'}}}
                />

                {this.state.showTryAgain === true ?
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={styles.button}
                                          onPress={() => this.getData()}>
                            <Text style={styles.buttonText}>Refresh </Text>
                        </TouchableOpacity></View> :
                    <View style={{flex: 1}}>
                        {this.state.data.length !== 0 ? <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />}
                                renderItem={this.renderRow}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.1}
                                ListFooterComponent={this.renderFooter}
                                data={this.state.data}/> :
                            <View style={{  flex: 1,
                                backgroundColor: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center',}}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1
                                }}><Text
                                    style={{color: 'gray'}}>Tidak Ada Data</Text></View></View>}</View>

                }


                <Modal
                    onSwipeComplete={() => {
                        this.setModalUnvisibleRiwayat(!this.state.modalVisibleRiwayat);
                    }}
                    scrollHorizontal
                    propagateSwipe
                    swipeDirection={['down']}
                    swipearea={50}
                    onRequestClose={() => {
                        this.setModalUnvisibleRiwayat(!this.state.modalVisibleRiwayat);
                    }}
                    animationType="slide"
                    visible={this.state.modalVisibleRiwayat}
                    backdropOpacity={1}>
                    <View style={{flex: 1}}>
                        <FlatList
                            renderItem={this.renderRowRiwayat}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.dataRiwayat}/>
                    </View>
                </Modal>
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
                    <View style={{flex: 1}}>
                        <Text style={{
                            color: 'gray',
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Detail Obat {this.state.namaKelas}</Text>
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
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loader: {
        marginTop: 18,
        alignItems: 'center',
    },
    item: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
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
    itemImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    itemText: {
        fontSize: 16,
        padding: 5,
    },
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Obat);
