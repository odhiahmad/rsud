import {
    FlatList,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    Modal,
    ScrollView, Image,
} from 'react-native';
import {AirbnbRating, Header, Icon, ListItem} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import LoaderModal from '../../components/LoaderModal';
import React, {Component} from 'react';
import ValidationComponent from 'react-native-form-validator';
import {Body, Col, Row, Grid, Left, List, Textarea} from 'native-base';
import Select2 from 'react-native-select-two';
import {baseApi} from '../../service/api';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import moment from 'moment';
import StepIndicator from 'react-native-step-indicator';
import ViewShot from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import PhotoUpload from 'react-native-photo-upload';
import Ripple from 'react-native-material-ripple';


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

class PenilaianRawatJalan extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            nomorMr: '',
            tahunLahir: '',
            nomorKtp: '',
            namaPasien: '',
            tempatLahir: '',
            tanggalLahir: '',
            jenisKelamin: '',
            jenisLayanan: '',
            tanggalMasuk: '',
            tanggalDaftar: '',
            no_telp: '',
            email: '',
            status: 'before',
            isLoading: false,
            dataKondisiPasien: [],
            isModalVisible: false,
            modalVisible: false,
            loading: false,
            nomorAntrian: '',
            index: 0,
            dataQrCode: [],
            namaDokter: '',
            tanggalKunjungan: '',
            jamKunjungan: '',
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

            dataRating: [],

        };
    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    _onSubmit() {
        this.setState({
            loading: true,
        });
        fetch(baseApi + '/user/cariNomorMrCekRawatJalan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                nomorMr: this.state.nomorMr,
                tahunLahir: this.state.tahunLahir,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                showMessage({
                    message: responseJson.message,
                    type: 'info',
                    position: 'bottom',
                });

                var jenisKelaminTampil = '';
                if (parseInt(responseJson.data.jns_kelamin) === 0) {
                    jenisKelaminTampil = 'Perempuan';
                } else if (parseInt(responseJson.data.jns_kelamin) === 1) {
                    jenisKelaminTampil = 'Laki - laki';
                }

                console.log(responseJson.dataBerobat);
                this.setState({
                    dataKondisiPasien: responseJson.dataBerobat,
                    alamat: responseJson.data.alamat,
                    noBpjs: responseJson.data.no_bpjs,
                    jenisKelaminTampil: jenisKelaminTampil,
                    status: 'after',
                    nomorKtp: responseJson.data.no_ktp,
                    namaPasien: responseJson.data.nama,
                    tempatLahir: responseJson.data.tempat_lahir,
                    tanggalLahir: responseJson.data.tgl_lahir,
                    jenisKelamin: responseJson.data.jns_kelamin,
                    dataPasien: [],
                    foto: responseJson.image,
                    nomorMr: responseJson.data.nomr,
                    nama: responseJson.data.nama,
                    loading: false,
                    no_telp: responseJson.data.no_telpon,
                });
                this.setState({
                    loading: false,
                });
            } else {
                showMessage({
                    message: responseJson.message,
                    type: 'danger',
                    position: 'bottom',
                });
                this.setState({
                    loading: false,
                });
            }
        }).catch((error) => {
            this.setState({
                loading: false,
            });

        });

    }

    setModalVisible(visible, id) {
        var posisiSekarang = 0;
        for (let i = 0; i < labels.length; i++) {
            if (this.state.dataKondisiPasien[id].status_berobat === labels[i]) {
                posisiSekarang = i;

            }

        }

        this.setState({
            modalVisible: visible,
            nomorAntrian: this.state.dataKondisiPasien[id].nomor_daftar,
            index: id,
            idPendaftaran: this.state.dataKondisiPasien[id].idx,
            caraBayar: this.state.dataKondisiPasien[id].cara_bayar,
            namaRuang: this.state.dataKondisiPasien[id].nama_ruang,
            tanggalMendaftar: this.state.dataKondisiPasien[id].tanggal_daftar,
            namaPasien: this.state.dataKondisiPasien[id].nama_pasien,
            namaDokter: this.state.dataKondisiPasien[id].namaDokterJaga,
            tanggalKunjungan: this.state.dataKondisiPasien[id].tanggal_kunjungan,
            jamKunjungan: this.state.dataKondisiPasien[id].jam_kunjunganAntrian,
            jamKunjunganLabel: this.state.dataKondisiPasien[id].jam_kunjunganLabel,
            tanggalLahir: this.state.dataKondisiPasien[id].tgl_lahir,
            nomorMr: this.state.dataKondisiPasien[id].nomr,
            jenisKelamin: this.state.dataKondisiPasien[id].jns_kelamin,
            statusBerobat: this.state.dataKondisiPasien[id].status_berobat,
            currentPosition: posisiSekarang,
            dataQrCode: this.state.dataQrCode,
        });


    }

    renderRow = ({item, index}) => {
        return (
            <ListItem onPress={() => {
                this.setModalVisible(true, index);
            }}

                      title={<Text>{item.nama_ruang}</Text>}
                      subtitle={
                          <View>
                              <Text style={{color: 'gray'}}>Dokter {item.namaDokterJaga}</Text>
                              <Text>Jam Kunjungan {item.jam_kunjungan}</Text>
                              <Text>Tanggal Kunjungan {item.tanggal_kunjungan}</Text>
                              <Text style={{color: 'gray'}}>Status {item.status_berobat}</Text>
                          </View>

                      }
                      leftAvatar={{
                          title: item.nama_ruang[0],
                      }}
                      chevron
            />
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
                    centerComponent={{text: 'Cek Status Rawat Jalan', style: {color: '#fff'}}}
                />
                <View style={{flex: 1}}>
                    {this.state.status === 'after' ?
                        <ScrollView>
                            <View style={{height: 130}}>
                                <Grid>
                                    <Col style={{width: 140, height: 130}}>
                                        <Image
                                            key={new Date()}
                                            style={{
                                                width: 130,
                                                height: 130,
                                                borderRadius: 75,
                                            }}
                                            resizeMode='cover'
                                            source={{uri: this.state.foto + '?' + new Date()}}
                                        />
                                    </Col>
                                    <Col style={{width: 200, height: 130}}>
                                        <ListItem
                                            title={<Text>Nama</Text>}
                                            subtitle={
                                                <Text style={{color: 'gray'}}>{this.state.namaPasien}</Text>
                                            }
                                        />
                                        <ListItem
                                            title={<Text>Nomor Mr</Text>}
                                            subtitle={
                                                <Text style={{color: 'gray'}}>{this.state.nomorMr}</Text>
                                            }
                                        />
                                        {/*<ListItem*/}
                                        {/*    subtitle={*/}
                                        {/*        <Text style={{color: 'gray'}}>Tanggal Lahir {this.state.tanggalLahir}</Text>*/}
                                        {/*    }*/}
                                        {/*/>*/}
                                    </Col>
                                </Grid>
                            </View>
                            <View style={{marginTop: 10}}>
                                <FlatList
                                    renderItem={this.renderRow}
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.dataKondisiPasien}/>
                            </View>
                        </ScrollView> :
                        this.state.status === 'before' ?
                            <View style={{
                                flex: 1,
                            }}>
                                <View style={{
                                    flex: 1,
                                    padding: 5, alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <View style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flex: 1,
                                    }}>
                                        <View style={{
                                            marginBottom:20
                                        }}>
                                            <Image style={{width: 250, height: 60}}
                                                   source={require('../../images/logo/logo-hitam.jpg')}/>
                                        </View>
                                        <TextInput
                                            keyboardType={'numeric'}
                                            defaultValue={this.state.nomorMr}
                                            ref="nomorMr"
                                            onChangeText={(nomorMr) => this.setState({nomorMr})}
                                            style={styles.inputBoxModal}
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                            placeholder="Masukan Nomor MR"
                                            placeholderTextColor="rgba(255,255,255,0.8)"
                                            selectionColor="#999999"
                                        />
                                        <TextInput
                                            keyboardType={'numeric'}
                                            defaultValue={this.state.tahunLahir}
                                            ref="tahunLahir"
                                            onChangeText={(tahunLahir) => this.setState({tahunLahir})}
                                            style={styles.inputBoxModal}
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                            placeholder="Masukan Tahun Lahir"
                                            placeholderTextColor="rgba(255,255,255,0.8)"
                                            selectionColor="#999999"
                                        />
                                        <TouchableOpacity style={styles.buttonModal}
                                                          onPress={this._onSubmit.bind(this)}>
                                            <Text style={styles.buttonText}>Submit</Text>
                                        </TouchableOpacity></View></View></View> : <View></View>
                    }
                    {this.isFieldInError('nomorMr') && this.getErrorsInField('nomorMr').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>
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
                        <View style={{
                            justifyContent: 'center',
                            flex: 1,
                            padding: 10,
                            alignItems: 'center',
                            backgroundColor: 'white',
                        }}>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <View style={{width: 90, backgroundColor: 'white'}}>
                                    <Text style={{fontSize: 12}}>Tanggal</Text>
                                    <Text style={{fontSize: 12}}>No MR</Text>
                                    <Text style={{fontSize: 12}}>Nama</Text>
                                    <Text style={{fontSize: 12}}>Tgl Kunjungan</Text>
                                    <Text style={{fontSize: 12}}>Jam Kunjungan</Text>
                                    <Text style={{fontSize: 12}}>Poly Tujuan</Text>
                                    <Text style={{fontSize: 12}}>Cara Bayar</Text>
                                </View>
                                <View style={{width: 250, backgroundColor: 'white'}}>
                                    <Text style={{fontSize: 12}}>: {this.state.tanggalMendaftar}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.nomorMr}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.namaPasien}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.tanggalKunjungan}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.jamKunjunganLabel}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.namaRuang}</Text>
                                    <Text style={{fontSize: 12}}>: {this.state.caraBayar}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                </Modal>
            </View>
        );
    }
}

mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(PenilaianRawatJalan);
const styles = StyleSheet.create({

    button: {
        width: 345,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    buttonModalInputText: {
        color: '#ffffff',
        width: 345,
        backgroundColor: '#1da30b',
        borderRadius: 25,
        marginVertical: 2,
        paddingVertical: 13,
    },
    inputBoxModal: {
        width: 320,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
    },
    buttonModal: {
        width: 320,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 30,
        paddingVertical: 13,
    },

    fab: {
        marginTop: 20,
        backgroundColor: '#1da30b',
    },
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
    inputBox: {
        width: 350,
        backgroundColor: 'rgba(29, 163, 11,0.8)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 2,
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
