import React, {Component} from 'react';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {Header, ListItem, Icon, Rating, AirbnbRating, CheckBox} from 'react-native-elements';
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
import {Textarea, Button, Container, Content,Badge} from 'native-base';
import {showMessage} from 'react-native-flash-message';
import ValidationComponent from 'react-native-form-validator';
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
const labels = ['Mendaftar', 'Selesai Berobat', 'Mendapatkan Obat', 'Selesai'];
var ratingBintang = 3;

class Riwayat extends ValidationComponent {
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

            nomorAntrian: '',
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

            checked: false,

            checkedKeramahan: false,
            checkedPelayanan: false,

            catatan: '',
            rating: 0,
            idPendaftaran: '',

            dataRating:[],

            rute:'',
            jam:'',
            tempat:'',
            statusShuttle:'',

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

    handleLoadMore = () => {

        if (this.state.data.length >= 10) {
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
            isLoading: true,
            showTryAgain: false,
        });
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
                loading: false,
                isLoading: false,
                showTryAgain: false,
                data: this.state.data.concat(responseJson.data.data),
            });

        }).catch((error) => {
            this.setState({
                loading: false,
                isLoading: false,
                showTryAgain: true,
            });
        });
    };

    _submitPenilaian() {
        this.setState({
            loading: true,
        });
        fetch(baseApi + '/user/inputPenilaian', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                idPendaftaran: this.state.idPendaftaran,
                idUser: this.props.getUser.userDetails.id,
                idRating:this.state.dataRating.id,
                rating: ratingBintang,
                catatan: this.state.catatan,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                this.setState({
                    loading: false,
                });
                this.setModalUnvisible(!this.state.modalVisible);
                showMessage({
                    message: responseJson.message,
                    type: 'info',
                    position: 'bottom',
                });
            } else {
                this.setState({
                    loading: false,
                });
                this.state.data.push(responseJson.data);
                this.setModalUnvisible(!this.state.modalVisible);
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'bottom',
                });
            }
        });

    }

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
        console.log(this.state.data[id].shuttle_bus)
        if(this.state.data[id].shuttle_bus === 1){
            console.log(true)
            this.setState({
                rute:this.state.data[id].get_user_shuttle.rute,
                jam:this.state.data[id].get_user_shuttle.jam,
                tempat:this.state.data[id].get_user_shuttle.tempat_tunggu,
                statusShuttle:1
            })

        }

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
            dataRating:this.state.data[id].get_user_rating,
            modalVisible: visible,
            nomorAntrian: this.state.data[id].nomor_daftar,
            index: id,
            idPendaftaran: this.state.data[id].idx,
            caraBayar: this.state.data[id].cara_bayar,
            namaRuang: this.state.data[id].nama_ruang,
            tanggalMendaftar: this.state.data[id].tanggal_daftar,
            namaPasien: this.state.data[id].nama_pasien,
            namaDokter: this.state.data[id].namaDokterJaga,
            tanggalKunjungan: this.state.data[id].tanggal_kunjungan,
            jamKunjungan: this.state.data[id].jam_kunjunganAntrian,
            jamKunjunganLabel: this.state.data[id].jam_kunjunganLabel,
            tanggalLahir: this.state.data[id].tgl_lahir,
            nomorMr: this.state.data[id].nomr,
            jenisKelamin: this.state.data[id].jns_kelamin,
            statusBerobat: this.state.data[id].status_berobat,
            currentPosition: posisiSekarang,
            dataQrCode: this.state.dataQrCode,
        });




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


        }).catch((error) => {

        });
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

    saveQrToDisk() {
        this.refs.viewShot.capture().then(uri => {


            CameraRoll.saveToCameraRoll(uri, 'photo');
            ToastAndroid.show('Disimpan di galery !!', ToastAndroid.SHORT);
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
                          <Text>{item.status_berobat}</Text>


                          {item.status_berobat === 'Mendapatkan Obat' ? <Text>Silahkan Beri Penilaian Anda</Text> :
                              <Text><Text>{time}</Text></Text>}
                          {item.shuttle_bus !== 0 ?<Text style={{color:'gray'}}>{item.get_user_shuttle.tempat_tunggu} {item.get_user_shuttle.jam}</Text>:<View></View>}
                      </View>}
                      bottomDivider
                      chevron
            >
            </ListItem>
        );
    };

    ratingCompleted(rating) {
        // console.log(rating)
        ratingBintang = rating;

        console.log(ratingBintang);
    }

    render() {
        let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
        return (

            <View style={{flex: 1}}>
                <LoaderModal
                    loading={this.state.loading}/>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    rightComponent={
                        <Ripple onPress={() => this._onRefresh}>
                        <Icon type='font-awesome-5' name='sync' color='#fff'/></Ripple>}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Riwayat', style: {fontWeight: 'bold', color: '#fff'}}}
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
                        }} onPress={() => this.getData()}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}>Refresh </Text>
                        </TouchableOpacity></View> :
                    <View style={styles.container}>
                        {this.state.data.length !== 0 ?
                            <View>
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
                                <View style={{padding:2,flexDirection: 'row',alignItems:'center',justifyContent: 'center'}}>
                                    <Text style={{fontSize: 10,color:'gray'}}>Klik tombol refresh sebelah kanan atas untuk mendapatkan status terbaru berobat</Text>
                                </View>
                            </View> :
                            <View style={{padding:2,flex:1,alignItems: 'center', justifyContent: 'center'}}>
                                <Text
                                style={{color: 'gray'}}>Tidak Ada Data</Text>
                                <Text style={{fontSize: 10,color: 'gray'}}>Klik tombol refresh sebelah kanan atas untuk mendapatkan status terbaru berobat</Text>
                            </View>}
                    </View>
                }

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

                        {this.state.statusBerobat === 'Mendaftar' ?
                            <View>
                                <ViewShot ref="viewShot"
                                          style={{padding: 10, alignItems: 'center', backgroundColor: 'white'}}
                                          options={{format: 'png', quality: 20}}>

                                    {this.state.dataQrCode.length != 0 ?
                                        <QRCode
                                            size={180}
                                            value={this.state.dataQrCode}
                                            logoSize={30}
                                            logoBackgroundColor='transparent'
                                            getRef={(c) => (this.svg = c)}
                                        />
                                        : null}
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <View style={{width: 100, backgroundColor: 'white'}}>
                                            <Text style={{fontSize: 12}}>Tanggal</Text>
                                            <Text style={{fontSize: 12}}>No MR</Text>
                                            <Text style={{fontSize: 12}}>Nama</Text>
                                            <Text style={{fontSize: 12}}>Tgl Kunjungan</Text>
                                            <Text style={{fontSize: 12}}>Jam Kunjungan</Text>
                                            <Text style={{fontSize: 12}}>Poly Tujuan</Text>
                                            <Text style={{fontSize: 12}}>Cara Bayar</Text>
                                        </View>
                                        <View style={{width: 200, backgroundColor: 'white'}}>
                                            <Text style={{fontSize: 12}}>: {this.state.tanggalMendaftar}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.nomorMr}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.namaPasien}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.tanggalKunjungan}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.jamKunjunganLabel}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.namaRuang}</Text>
                                            <Text style={{fontSize: 12}}>: {this.state.caraBayar}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <Text style={{fontSize: 24}}>Nomor
                                            Antrian: {this.state.nomorAntrian}</Text>
                                    </View>
                                    <View style={{padding: 10, backgroundColor: 'white'}}>
                                        <Text style={{fontSize: 12}}>Mohon Diperhatikan</Text>
                                        <Text style={{fontSize: 8}}>1. Pasien diharapkan hadir sebelum
                                            pukul {this.state.jamKunjungan} </Text>
                                        <Text style={{fontSize: 8}}>2. Silahkan datang ke counter checkin yang sudah
                                            kami
                                            sediakan</Text>
                                        <Text style={{fontSize: 8}}>3. bawalah bukti reservasi, Kartu Pasien, Kartu
                                            BPJS,
                                            dan surat rujukan/Surat Kontrol ulang yang masih berlaku</Text>
                                    </View>
                                    <View style={{padding: 10, backgroundColor: 'white'}}>
                                        <Text style={{fontSize: 12}}>Catatan</Text>
                                        <Text style={{fontSize: 8}}>1. Pasien yang mendaftar online akan dilayani jika,
                                            Membawa bukti reservasi pendaftaran online, kartu bpjs, dan surat rujukan
                                            yang
                                            masih berlaku (Rujukan faskes 1 berlaku selama 90 Hari)</Text>
                                        <Text style={{fontSize: 8}}>2. Jika anda datang lewat dari jam kunjungan anda,
                                            anda
                                            tidak akan dilayani</Text>
                                    </View>
                                </ViewShot>
                                {this.state.statusShuttle === 1 ?
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            padding: 10,
                                            justifyContent: 'center',
                                        }}>
                                        <Icon active color="gray" type="font-awesome" name="map-marker"/>
                                        <Text>{this.state.rute}</Text>
                                        <Text>{this.state.jam}</Text>
                                        <Text>{this.state.tempat}</Text>
                                    </View>
                                    :
                                    <View></View>
                                }
                            </View>

                            : this.state.statusBerobat === 'Selesai Berobat' ?
                                <View style={{padding: 10, alignItems: 'center', backgroundColor: 'white'}}>
                                    <View style={{flexDirection: 'row', marginTop: 40}}>
                                        <Text style={{fontSize: 14}}>Silahkan Tunggu Sejenak Untuk Menunggu Obat
                                            Anda ^_^ </Text>
                                     </View>
                                </View>
                                : this.state.statusBerobat === 'Mendapatkan Obat' ?
                                    <View>
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <View style={{flexDirection: 'row', marginTop: 40}}>
                                                <Text style={{fontSize: 14}}>Silahkan Beri Penilaian Anda Terhadap
                                                    Rumah Sakit Kami ^_^</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                                <AirbnbRating
                                                    onFinishRating={this.ratingCompleted}
                                                    count={3}
                                                    reviews={['Buruk', 'Sedang', 'Baik']}
                                                    defaultRating={3}
                                                    size={20}
                                                />
                                            </View>


                                        </View>
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Textarea ref="catatan"
                                                      autoCapitalize='words'
                                                      onChangeText={(catatan) => this.setState({catatan})}
                                                      placeholderTextColor="#ffffff" style={styles.inputBox} rowSpan={5}
                                                      bordered
                                                      placeholder="Tulis Catatan Disini"/>
                                        </View>
                                        <View style={{alignItems: 'center', padding: 10, justifyContent: 'center'}}>
                                            <TouchableOpacity
                                                style={styles.button} onPress={() => {
                                                this._submitPenilaian();
                                            }}>
                                                <Text style={styles.buttonText}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View> :
                                    <View style={{padding: 10, alignItems: 'center', backgroundColor: 'white'}}>
                                        <View style={{flexDirection: 'row', marginTop: 10}}>
                                            <View style={{width: 120, backgroundColor: 'white'}}>
                                                <Text style={{fontSize: 12}}>Tanggal</Text>
                                                <Text style={{fontSize: 12}}>No MR</Text>
                                                <Text style={{fontSize: 12}}>Nama</Text>
                                                <Text style={{fontSize: 12}}>Tgl Kunjungan</Text>
                                                <Text style={{fontSize: 12}}>Jam Kunjungan</Text>
                                                <Text style={{fontSize: 12}}>Poly Tujuan</Text>
                                                <Text style={{fontSize: 12}}>Cara Bayar</Text>
                                                <Text style={{fontSize: 12}}>Rating</Text>
                                                <Text style={{fontSize: 12}}>Catatan</Text>
                                            </View>
                                            <View style={{width: 250, backgroundColor: 'white'}}>
                                                <Text style={{fontSize: 12}}>: {this.state.tanggalMendaftar}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.nomorMr}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.namaPasien}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.tanggalKunjungan}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.jamKunjunganLabel}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.namaRuang}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.caraBayar}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.dataRating.rating}</Text>
                                                <Text style={{fontSize: 12}}>: {this.state.dataRating.catatan}</Text>
                                            </View>
                                        </View>
                                    </View>
                        }

                    </View>
                    {this.state.statusBerobat === 'Mendaftar' ?
                        <View style={{alignItems: 'center', padding: 10, justifyContent: 'center'}}>
                            <TouchableOpacity
                                style={styles.button} onPress={() => {
                                this.saveQrToDisk();
                            }}>
                                <Text style={styles.buttonText}>Simpan Bukti Reservasi</Text>
                            </TouchableOpacity>
                        </View> : <View></View>}

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
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Riwayat);
