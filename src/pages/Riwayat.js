import React, {Component} from 'react';
import RNFetchBlob from 'react-native-fetch-blob';
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs"
import CameraRoll from "@react-native-community/cameraroll";
import {
    Badge,
    Container,
    Header,
    Content,
    List,
    ListItem,
    Item,
    Input,
    Thumbnail,
    Text,
    Left,
    Body,
    Right,
    Button,
    Root, Icon,
    Title,
    Fab,
} from 'native-base';
import ModalKomponen from '../components/Modal';
import CustomRow from '../components/CustomRow';
import {baseApi} from '../service/api';
import LoaderModal from '../components/LoaderModal';
import {
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
    SearchBar, RefreshControl,
} from 'react-native';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';
import StepIndicator from 'react-native-step-indicator';

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
            svg:'',

            namaPasien: '',
            namaDokter: '',
            tanggalKunjungan: '',
            jamKunjungan: '',
            tanggalLahir: '',
            nomorMr: '',
            jenisKelamin: '',
            status_berobat: '',
            busy:true,
            imageSaved:false,
            currentPosition: 0,
            inClick: false,
            idShuttle: this.props.id,
            idTrip: this.props.idTrip,

        };
    }

    onPageChange(position) {
        this.setState({currentPosition: position});
    }

    componentWillReceiveProps(value) {
        this.setState({
            isLoading: true,
        }, this.getData);
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        }, this.getData);

    }

    downloadPdf() {

        var date = new Date();
        var url = 'http://www.clker.com/cliparts/B/B/1/E/y/r/marker-pin-google-md.png';
        var ext = this.extention(url);
        ext = '.' + ext[0];
        const {config, fs} = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir + '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
                description: 'Image',
            },
        };
        config(options).fetch('GET', url).then((res) => {
            Alert.alert('Success Downloaded');
        });
    }

    extention(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    handleLoadMore = () => {

        if (this.state.data.length > 5) {
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

    getData = async () => {
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
                data: this.state.data.concat(responseJson.data.data),
            });

            console.log(responseJson.data.data);
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

        this.setState({
            modalVisible: visible,
            namaPasien: this.state.data[id].nama_pasien,
            namaDokter: this.state.data[id].namaDokterJaga,
            tanggalKunjungan: this.state.data[id].tgl_masuk,
            jamKunjungan: this.state.data[id].jam_kunjungan,
            tanggalLahir: this.state.data[id].tgl_lahir,
            nomorMr: this.state.data[id].nomr,
            jenisKelamin: this.state.data[id].jns_kelamin,
            statusBerobat: this.state.data[id].status_berobat,
            currentPosition: posisiSekarang,
        });


    }
    _onRefresh = () => {
        this.setState({isLoading: true,}, this.showData);

    }
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
        this.svg.toDataURL((data) => {
            RNFS.writeFile(RNFS.CachesDirectoryPath+"/some-name.png", data, 'base64')
                .then((success) => {
                    return CameraRoll.saveToCameraRoll("file:///sdcard/img.png", 'photo')
                })
                .then(() => {
                    this.setState({ busy: false, imageSaved: true  })
                    ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT)
                }).catch((err) => {
                console.warn(err.message);
            });
        })
    }


    shareQR(){
        this.svg.toDataURL((data) => {
            console.log(data)
            const shareImageBase64 = {
                title: "QR",
                message: "Ehi, this is my QR code",
                url: `data:image/png;base64,${data}`
            };
            Share.open(shareImageBase64);
        });
    }

    renderRow = ({item, index}) => {
        moment.locale('id');
        var time = moment(item.tgl_masuk).format('LLLL');
        return (
            <List>
                <ListItem onPress={() => {
                    this.setModalVisible(true, index);
                }}>
                    <Body>
                        <Text>{item.nama_pasien}</Text>
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <Text note>{item.namaDokterJaga}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <Text note>{time}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <Badge danger><Text note>{item.status_berobat}</Text></Badge>
                        </View>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {
                            this.setModalVisible(true, item.id);
                        }}>
                            <Text>View</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>);
    };


    render() {
        let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
        return (
            <Container>
                <Content  refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
            <View style={{flex: 1, height: height}}>
                <FlatList
                    style={styles.container}
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
                >
                    <Container style={{margin: 0, marginBottom: 0, backgroundColor: '#fff'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Content style={{margin: 5}}>

                                <List>
                                    <ListItem>
                                        <Left>
                                            <Text>{this.state.namaPasien}</Text>
                                        </Left>
                                        <Body>
                                            <Text note>{moment(this.state.tanggalKunjungan).format('LLLL')}</Text>
                                        </Body>
                                    </ListItem>
                                </List>
                                <View style={{padding: 20}}>
                                    <StepIndicator
                                        direction="horizontal"
                                        stepCount={labels.length}
                                        customStyles={customStyles}
                                        currentPosition={this.state.currentPosition}
                                        labels={labels}
                                    />
                                </View>
                                <View style={{padding: 20}}>
                                    <Body>
                                        <TouchableOpacity onPress={() => {this.saveQrToDisk()}}>
                                        <QRCode
                                            size={200}
                                            value="Hellow World"
                                            logoSize={30}
                                            logoBackgroundColor='transparent'
                                            getRef={(c) => (this.svg = c)}
                                        />
                                        </TouchableOpacity>
                                    </Body>
                                </View>

                            </Content>

                        </View>
                    </Container>
                </Modal>
            </View>
                </Content>
            </Container>
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
