import React, {Component} from 'react';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {Header, ListItem} from 'react-native-elements';
import ModalKomponen from '../components/Modal';
import CustomRow from '../components/CustomRow';
import {baseApi, baseUrlFoto} from '../service/api';
import LoaderModal from '../components/LoaderModal';

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

class Riwayat extends Component {
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
            jamKunjunganLabel:'',
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
                data: this.state.data.concat(responseJson.data.data),
            });

        }).catch((error) => {
            console.log(error);
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
        var posisiSekarang = 0;
        for (let i = 0; i < labels.length; i++) {
            if (this.state.data[id].status_berobat === labels[i]) {
                posisiSekarang = i;

            }

        }

        this.state.dataQrCode = [{
            modalVisible: visible,
            index: id,
            caraBayar: this.state.data[id].cara_bayar,
            namaRuang: this.state.data[id].nama_ruang,
            tanggalMendaftar: this.state.data[id].tanggal_daftar,
            namaPasien: this.state.data[id].nama_pasien,
            namaDokter: this.state.data[id].namaDokterJaga,
            tanggalKunjungan: this.state.data[id].tanggal_kunjungan,
            jamKunjungan: this.state.data[id].jam_kunjungan,
            jamKunjunganLabel: this.state.data[id].jam_kunjunganAntrian,
            tanggalLahir: this.state.data[id].tgl_lahir,
            nomorMr: this.state.data[id].nomr,
            jenisKelamin: this.state.data[id].jns_kelamin,
            statusBerobat: this.state.data[id].status_berobat,
            currentPosition: posisiSekarang,
        }];

        this.setState({
            modalVisible: visible,
            index: id,
            caraBayar: this.state.data[id].cara_bayar,
            namaRuang: this.state.data[id].nama_ruang,
            tanggalMendaftar: this.state.data[id].tanggal_daftar,
            namaPasien: this.state.data[id].nama_pasien,
            namaDokter: this.state.data[id].namaDokterJaga,
            tanggalKunjungan: this.state.data[id].tanggal_kunjungan,
            jamKunjungan: this.state.data[id].jam_kunjungan,
            jamKunjunganLabel: this.state.data[id].jam_kunjunganLabel,
            tanggalLahir: this.state.data[id].tgl_lahir,
            nomorMr: this.state.data[id].nomr,
            jenisKelamin: this.state.data[id].jns_kelamin,
            statusBerobat: this.state.data[id].status_berobat,
            currentPosition: posisiSekarang,
            dataQrCode: this.state.dataQrCode,
        });


        console.log(this.state.dataQrCode);


    }

    _onRefresh = () => {
        this.setState({isLoading: true}, this.showData);

    };
    searchData = async () => {
        const url = baseApi + '/user/berita?page=';
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search: this.state.searchText,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                data: responseJson.data.data,
                isLoading: false,
            });

            console.log(this.state.data);
        }).catch((error) => {
            console.log(error);
        });
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

    saveQrToDisk() {
        this.refs.viewShot.capture().then(uri => {
            console.log('do something with ', uri);

            CameraRoll.saveToCameraRoll(uri, 'photo');

        });
        // this.svg.toDataURL((data) => {
        //     RNFS.writeFile(RNFS.CachesDirectoryPath + '/some-name.png', data, 'base64')
        //         .then((success) => {
        //             return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath + '/some-name.png', 'photo');
        //
        //         })
        //         .then(() => {
        //             this.setState({busy: false, imageSaved: true});
        //             ToastAndroid.show('Disimpan di galery !!', ToastAndroid.SHORT);
        //         }).catch((err) => {
        //         console.warn(err.message);
        //     });
        // });
    }

    renderRow = ({item, index}) => {
        moment.locale('id');
        var time = moment(item.tgl_masuk).format('LLLL');
        return (
            <ListItem onPress={() => {
                this.setModalVisible(true, index);
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
                    centerComponent={{text: 'Riwayat', style: {fontWeight: 'bold', color: '#fff'}}}
                />

                <FlatList
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
                    data={this.state.data}/>
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
                ><ScrollView style={{backgroundColor: 'white'}}>
                    <ListItem
                        title={this.state.namaPasien}
                        subtitle={moment(this.state.tanggalKunjungan).format('LLLL')
                        }
                    >
                    </ListItem>
                    <View style={{backgroundColor: 'white'}}>
                        <StepIndicator
                            direction="horizontal"
                            stepCount={labels.length}
                            customStyles={customStyles}
                            currentPosition={this.state.currentPosition}
                            labels={labels}
                        />
                        <ViewShot ref="viewShot" style={{padding: 20, alignItems: 'center',backgroundColor: 'white'}}
                                  options={{format: 'png', quality: 20}}>

                            <View>
                                {this.state.dataQrCode.length != 0  ?
                                    <QRCode
                                        size={200}
                                        value={this.state.dataQrCode}
                                        logoSize={30}
                                        logoBackgroundColor='transparent'
                                        getRef={(c) => (this.svg = c)}
                                    />
                                    :null}

                            </View>
                            <View style={{flexDirection: 'row',marginTop:10}}>
                                <View style={{width: 150, backgroundColor: 'white'}}>
                                    <Text style={{fontSize: 12}}>Tanggal</Text>
                                    <Text style={{fontSize: 12}}>No MR</Text>
                                    <Text style={{fontSize: 12}}>Nama</Text>
                                    <Text style={{fontSize: 12}}>Tgl Kunjungan</Text>
                                    <Text style={{fontSize: 12}}>Jam Kunjungan</Text>
                                    <Text style={{fontSize: 12}}>Poly Tujuan</Text>
                                    <Text style={{fontSize: 12}}>Cara Bayar</Text>
                                </View>
                                <View style={{width: 150, backgroundColor: 'white'}}>
                                    <Text style={{fontSize: 12}}>: {this.state.tanggalMendaftar}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.nomorMr}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.namaPasien}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.tanggalKunjungan}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.jamKunjunganLabel}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.namaRuang}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.caraBayar}</Text>
                                </View>
                            </View>
                            <View style={{padding:10,backgroundColor: 'white'}}>
                                <Text style={{fontSize: 12}}>Mohon Diperhatikan</Text>
                                <Text style={{fontSize: 8}}>1. Pasien diharapkan hadir sebelum
                                    pukul {this.state.jamKunjungan} </Text>
                                <Text style={{fontSize: 8}}>2. Silahkan datang ke counter checkin yang sudah kami
                                    sediakan</Text>
                                <Text style={{fontSize: 8}}>3. bawalah bukti reservasi, Kartu Pasien, Kartu BPJS,
                                    dan surat rujukan/Surat Kontrol ulang yang masih berlaku</Text>
                            </View>
                            <View style={{padding:10,backgroundColor: 'white'}}>
                                <Text style={{fontSize: 12}}>Catatan</Text>
                                <Text style={{fontSize: 8}}>1. Pasien yang mendaftar online akan dilayani jika,
                                    Membawa bukti reservasi pendaftaran online, kartu bpjs, dan surat rujukan yang
                                    masih berlaku (Rujukan faskes 1 berlaku selama 90 Hari)</Text>
                                <Text style={{fontSize: 8}}>2. Jika anda datang lewat dari jam kunjungan anda, anda
                                    tidak akan dilayani</Text>
                            </View>
                        </ViewShot>
                    </View>
                    <View style={{alignItems: 'center', padding:10,justifyContent: 'center'}}><TouchableOpacity
                        style={styles.button} onPress={() => {
                        this.saveQrToDisk();
                    }}>
                        <Text style={styles.buttonText}>Simpan Bukti Reservasi</Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Riwayat);
