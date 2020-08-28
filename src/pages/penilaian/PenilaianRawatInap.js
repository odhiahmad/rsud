import {StatusBar, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import LoaderModal from '../../components/LoaderModal';
import React, {Component} from 'react';
import ValidationComponent from 'react-native-form-validator';
import {Text, Textarea} from 'native-base';
import Select2 from 'react-native-select-two';
import {baseApi} from '../../service/api';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import Ripple from 'react-native-material-ripple';

class PenilaianRawatInap extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            nomorMr:'',
            tahunLahir:'',
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
            status:'before',

        };
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

    render() {
        return (
            <View style={{flex:1}}>
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
                    centerComponent={{text: 'Penilaian Rawat Inap', style: {color: '#fff'}}}
                />
                <View style={{alignItems: 'center',
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
                        </View> :
                        this.state.status === 'before' ?
                            <View style={{padding: 5,marginTop:30}}>
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
                                </TouchableOpacity></View> : <View></View>
                    }
                    {this.isFieldInError('nomorMr') && this.getErrorsInField('nomorMr').map(errorMessage =>
                        <Text>{errorMessage}</Text>)}
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PenilaianRawatInap);
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
