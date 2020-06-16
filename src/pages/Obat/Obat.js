import React, {Component} from 'react';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {Header, ListItem} from 'react-native-elements';
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


        };
    }

    onPageChange(position) {
        this.setState({currentPosition: position});
    }

    componentDidMount() {

        this.setState({
            isLoading: true,
        }, this.getData);

    }


    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
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
                isLoading: false,
                data: this.state.data.concat(responseJson.data.data),
            });
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            this.setState({
                isLoading: false,
            });
        });
    };

    showData = async () => {
        console.log(this.props.getUser.userDetails.id);
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

            console.log(responseJson.data.data);
        }).catch((error) => {
            console.log(error);
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
            console.log(responseJson.data);

        }).catch((error) => {
            console.log(error);
        });


    }

    _onRefresh = () => {
        this.setState({isLoading: true}, this.showData);

    };


    _onChangeSearchText(text) {

        console.log(text);
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


    renderRow = ({item, index}) => {
        moment.locale('id');
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
            <View>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Obat Pasien', style: {fontWeight: 'bold', color: '#fff'}}}
                />

                {this.state.data.length !== 0 ?<FlatList
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
                    <View style={{alignItems: 'center', justifyContent: 'center'}}><Text
                        style={{color: 'gray'}}>Tidak Ada Data</Text></View>}

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
        marginBottom: 28,
        backgroundColor: '#F5FCFF',
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
