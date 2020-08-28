import React, {Component} from 'react';
import {
    Container,
    Content,
    List,
    Item,
    Input,
    Thumbnail,
    Left,
    Body,
    Right,
    Button,
    Root,
    Title,
    Fab, Textarea,
} from 'native-base';
import ModalKomponen from '../../components/Modal';
import CustomRow from '../../components/CustomRow';
import {baseApi, baseUrlFoto} from '../../service/api';
import LoaderModal from '../../components/LoaderModal';
import {
    ActivityIndicator,
    View,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    Share,
    SearchBar,
    Text,
    StatusBar, TextInput, ScrollView,
} from 'react-native';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';

const {height} = Dimensions.get('window');
const imageUrl = '../../images/banner/banner1.jpg';
import {Header, Badge, Icon,ListItem} from 'react-native-elements';
import {showMessage} from 'react-native-flash-message';
import ValidationComponent from 'react-native-form-validator';
import {Actions} from 'react-native-router-flux';
import Select2 from 'react-native-select-two';
import Ripple from 'react-native-material-ripple';

class Pengaduan extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            dataIsi: null,
            dataJudul: null,
            modalArticleData: {},
            setModalVisible: false,
            namaKelas: null,
            dataSource: null,
            dataDetail: null,
            isLoadingDataModal: true,
            isModalVisible: false,
            modalVisible: false,
            loading: true,

            page: 1,
            dataPostLink: null,
            dataPostTanggal: null,
            searchText: null,
            searchAktif: 0,
            pengaduan: '',

            showTryAgain: false,

            alamat:'',
            id_pasien: '',
            nomorMr: '',
            status: 'before',
            nama: '',
            jenisKelaminTampil: '',
            dataRujukanBpjs: [],
            data: [],
            dataCaraBayar: [],
            dataRujukan: [],
            dataPoly: [],
            dataDokter: [],
            dataTanggal: [],
            dataJenisRawatan: [
                {id: 0, name: 'Rawat Inap'},
                {id: 1, name: 'Rawat Jalan'},
                {id: 2, name: 'IGD'},
            ],

            dataJenisHubungan: [
                {id: 0, name: 'Diri Sendiri'},
                {id: 1, name: 'Keluarga'},
                {id: 2, name: 'Orang Lain'},
                {id: 3, name: 'Teman/Kerabat'},
            ],

            pilihJenisHubungan:'',

            total: 0,
            next_page_url: null,
            cekRujukan: 3,
            statusLengkap: 0,

            statusMendaftar: 0,
            idCaraBayar: '',
            tahunLahir: '',
            nomor_mr: '',
            nomorKtp: '',
            namaPasien: '',
            tempatLahir: '',
            tanggalLahir: '',
            jenisKelamin: '',
            jenisLayanan: '',
            tanggalMasuk: '',
            tanggalDaftar: '',
            no_telp:'',
            email:'',

            pilihCaraBayar: '',
            pilihTanggalKunjungan: '',
            pilihPoly: '',
            caraBayar: '',
            pilihRujukan: '',
            pilihDokter: '',
            pilihNrp: '',
            pilihHari: '',
            pilihJam: '',
            pilihIdPoly: '',
            kelas: '',
            idKelas: '',
            no_jaminan: '',
            pilihFoto: '',
            pilihJenisRawatan:'',
            chosenDate: new Date(),
            chosenDate1: new Date(),
            kronologis:'',
            dataKamar:[],
            pilihKamar:'',
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
        }, this.getData);

    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }


    getData = async () => {
        this.setState({
            loading: true,
            showTryAgain: false,
        });
        const url = baseApi + '/user/pengaduan';
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
                data: responseJson.data,
                showTryAgain: false,
            });

        }).catch((error) => {
            this.setState({
                loading: false,
                showTryAgain: true,
            });
        });
    };

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
        });

    }

    _onSubmit() {
        this.setState({
            loading: true,
        });
        fetch(baseApi + '/user/cariNomorMr', {
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
                if (parseInt(responseJson.data.no_ktp) !== 0 && responseJson.data.tempat_lahir !== '' &&
                    responseJson.data.pekerjaan !== null && responseJson.data.nama_provinsi !== null &&
                    responseJson.data.nama_kab_kota !== null && responseJson.data.nama_kecamatan !== null &&
                    responseJson.data.nama_keluranahan !== null && responseJson.data.suku !== null &&
                    responseJson.data.bahasa !== null && responseJson.data.alamat !== ''
                ) {
                    this.setState({
                        statusLengkap: 0,
                    });
                } else {
                    this.setState({
                        statusLengkap: 1,
                    });
                }
                var jenisKelaminTampil = '';
                if (parseInt(responseJson.data.jns_kelamin) === 0) {
                    jenisKelaminTampil = 'Perempuan';
                } else if (parseInt(responseJson.data.jns_kelamin) === 1) {
                    jenisKelaminTampil = 'Laki - laki';
                }
                this.setState({
                    alamat:responseJson.data.alamat,
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
                    no_telp:responseJson.data.no_telpon,
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

            this.state.message = error;
        });

    }

    showJenisLayanan(data){
        this.setState({
            dataPoly:[]
        })
        if(data === 'Rawat Inap'){
            this.setState({
                loading:true
            })
            fetch(baseApi + '/user/polyPengaduan', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json()).then((responseJson) => {


                var dataRespon1 = responseJson.data
                var angka1 = 0;
                for (let i = 0; i < dataRespon1.length ; i++) {
                    if(dataRespon1[i].poly_glid === 'GL001'){
                        this.state.dataPoly.push({
                            id:angka1,
                            name:dataRespon1[i].poly_nama
                        })

                        angka1 = angka1 + 1;
                    }
                }

                console.log(this.state.dataPoly)


                this.setState({
                    loading:false
                })

            }).catch(error =>{
                this.setState({
                    loading:false
                })
            })
        }else if(data === 'Rawat Jalan'){
            this.setState({
                loading:true
            })
            fetch(baseApi + '/user/polyPengaduan', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json()).then((responseJson) => {

                var dataRespon = responseJson.data
                var angka = 0;
                for (let i = 0; i < dataRespon.length ; i++) {
                    if(dataRespon[i].poly_glid === 'GL002'){
                        this.state.dataPoly.push({
                            id:angka,
                            name:dataRespon[i].poly_nama
                        })

                        angka = angka + 1;
                    }
                }

                this.setState({
                    loading:false
                })

            }).catch(error =>{
                this.setState({
                    loading:false
                })
            })
        }else{
            this.setState({
                pilihPoly:'IGD'
            })
        }
    }
    _onSubmitFinish() {
        this.validate({
            kronologis: {required: true},
        });
        if (this.isFormValid()) {
            this.setState({
                loading: true,
            });

            fetch(baseApi + '/user/inputPengaduan', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                },
                body: JSON.stringify({
                    id_user: this.props.getUser.userDetails.id,
                    kronologis: this.state.kronologis,
                    nomorKtp: this.state.nomorKtp ,
                    namaPasien: this.state.namaPasien ,
                    tempatLahir: this.state.tempatLahir ,
                    tanggalLahir: this.state.tanggalLahir ,
                    jenisKelamin: this.state.jenisKelamin ,
                    nomorMr: this.state.nomorMr,
                    nama: this.state.nama,
                    alamat:this.state.alamat,
                    pengaduanTempatRawat:this.state.pilihPoly,
                    pengaduanJenisLayanan:this.state.pilihJenisRawatan,
                    pengaduanHubungan:this.state.pilihJenisHubungan,
                    no_telp:this.state.no_telp
                }),
            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.success === true) {
                    this.setState({
                        loading: false,
                        kronologis:'',
                        nomorMr:'',
                        dataJenisLayanan:[],
                        pilihJenisRawatan:'',
                        pilihPoly:'',
                        pilihJenisHubungan:'',
                        status:'before',
                        tahunLahir:''
                    });


                    this.state.data.push(responseJson.data)
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
                    this.setModalUnvisible(!this.state.modalVisible);
                    showMessage({
                        message: responseJson.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                }
            }).catch(error =>{
                this.setState({
                    loading: false,
                });
                showMessage({
                    message: error,
                    type: 'danger',
                    position: 'bottom',
                });
            })
        }
    }

    _onSubmitNama() {

        this.setState({
            nomor_mr: this.state.nomorMr,
            statusIsi: 1,
            status: 'before',
            nama: '',
        });
    }

    renderRow = ({item}) => {
        return (

                <ListItem onPress={() => {
                    this.setModalVisible(true);
                }}

                          title={item.pengaduan_namapasien}
                          leftAvatar={{
                              title: item.pengaduan_namapasien[0,1],
                          }}
                          subtitle={<View>
                              <Text>Kronologis : {item.pengaduan_kronologis}</Text>
                              <Text style={{color: 'grey',fontSize:12}}>{item.pengaduan_tempatrawat}</Text>
                              <Text style={{color: 'grey',fontSize:14}}>{item.pengaduan_jenislayanan}</Text>
                          </View>}
                          bottomDivider
                >
                </ListItem>
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
                    centerComponent={{text: 'Pengaduan Masyarakat', style: {color: '#fff'}}}
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
                        </TouchableOpacity></View> : <FlatList
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}/>}


                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{bottom: 65}}
                    style={styles.fab}
                    position="bottomRight"
                    onPress={() => this.setModalVisible(true)}
                >
                    <Icon name="add" color='#fff'/>
                </Fab>
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
                    <View style={{flex:1,alignItems: 'center',
                    justifyContent: 'center',}}>
                    {this.state.status === 'after' ?
                        <View style={{padding: 5,marginTop:30}}>
                            <View style={{marginBottom: 10, padding: 5}}>
                                <Text style={styles.signupButton}>Nomor Mr</Text>
                                <Text style={styles.signupText}>{this.state.nomorMr}</Text>
                            </View>
                            <View style={{marginBottom: 10, padding: 5}}>
                                <Text style={styles.signupButton}>Nama</Text>
                                <Text style={styles.signupText}>{this.state.nama}</Text>
                            </View>
                            <Select2
                                placeholderTextColor="#ffffff"
                                listEmptyTitle="Tidak ada data"
                                cancelButtonText="Keluar"
                                selectButtonText="Pilih"
                                isSelectSingle
                                style={styles.inputBox}
                                colorTheme="#1da30b"
                                selectedTitleStyle={{color: 'white'}}
                                searchPlaceHolderText="Cari Jenis Hubungan"
                                popupTitle="Pilih Jenis Hubungan"
                                title="Pilih Jenis Hubungan"
                                data={this.state.dataJenisHubungan}
                                onSelect={data => {
                                    this.setState({
                                        pilihJenisHubungan: this.state.dataJenisHubungan[data].name,
                                    });
                                }}
                                onRemoveItem={data => {
                                    this.setState({pilihJenisHubungan: ''});
                                }}
                            />
                            <Select2
                                placeholderTextColor="#ffffff"
                                listEmptyTitle="Tidak ada data"
                                cancelButtonText="Keluar"
                                selectButtonText="Pilih"
                                isSelectSingle
                                style={styles.inputBox}
                                colorTheme="#1da30b"
                                selectedTitleStyle={{color: 'white'}}
                                searchPlaceHolderText="Cari Jenis Rawatan"
                                popupTitle="Pilih Jenis Rawatan"
                                title="Pilih Jenis Rawatan"
                                data={this.state.dataJenisRawatan}
                                onSelect={data => {

                                    this.setState({
                                        pilihJenisRawatan: this.state.dataJenisRawatan[data].name,
                                    });
                                    this.showJenisLayanan(this.state.dataJenisRawatan[data].name)

                                }}
                                onRemoveItem={data => {
                                    this.setState({pilihJenisRawatan: ''});
                                }}
                            />
                            {this.state.pilihJenisRawatan === 'Rawat Jalan'?
                            <View>
                                <Select2
                                    placeholderTextColor="#ffffff"
                                    listEmptyTitle="Tidak ada data"
                                    cancelButtonText="Keluar"
                                    selectButtonText="Pilih"
                                    isSelectSingle
                                    style={styles.inputBox}
                                    colorTheme="#1da30b"
                                    selectedTitleStyle={{color: 'white'}}
                                    searchPlaceHolderText="Cari Poly"
                                    popupTitle="Pilih Jenis Poly"
                                    title="Pilih Jenis Poly"
                                    data={this.state.dataPoly}
                                    onSelect={data => {

                                        this.setState({
                                            pilihPoly: this.state.dataPoly[data].name,
                                        });


                                    }}
                                    onRemoveItem={data => {
                                        this.setState({pilihPoly: ''});
                                    }}
                                />
                            </View>:this.state.pilihJenisRawatan === 'Rawat Inap'?
                                    <View>
                                        <Select2
                                            placeholderTextColor="#ffffff"
                                            listEmptyTitle="Tidak ada data"
                                            cancelButtonText="Keluar"
                                            selectButtonText="Pilih"
                                            isSelectSingle
                                            style={styles.inputBox}
                                            colorTheme="#1da30b"
                                            selectedTitleStyle={{color: 'white'}}
                                            searchPlaceHolderText="Cari Kamar"
                                            popupTitle="Pilih Kamar"
                                            title="Pilih Kamar"
                                            data={this.state.dataPoly}
                                            onSelect={data => {

                                                this.setState({
                                                    pilihPoly: this.state.dataPoly[data].name,
                                                });


                                            }}
                                            onRemoveItem={data => {
                                                this.setState({pilihPoly: ''});
                                            }}
                                        />
                                    </View>:this.state.pilihJenisRawatan === 'IGD'?
                                        <View></View>:<View></View>
                            }

                            <Textarea ref="kronologis"
                                      onChangeText={(kronologis) => this.setState({kronologis})}
                                      placeholderTextColor="#ffffff" style={styles.inputBox} rowSpan={5}
                                      bordered
                                      placeholder="Kronologis"/>
                            <TouchableOpacity style={styles.button}
                                              onPress={this._onSubmitFinish.bind(this)}>
                                <Text style={styles.buttonText}>Lanjutkan</Text>
                            </TouchableOpacity>
                        </View> :
                        this.state.status === 'before' ?
                            <View style={{flex:1,alignItems: 'center',
                                justifyContent: 'center',}}>
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
                                </TouchableOpacity></View></View> : <View></View>
                    }
                    {this.isFieldInError('nomorMr') && this.getErrorsInField('nomorMr').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>
                </Modal>
            </View>
        );
    }
}

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
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Pengaduan);
