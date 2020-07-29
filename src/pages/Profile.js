import React, {Component} from 'react';
import {ListItem, Icon, Header} from 'react-native-elements';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator,
    RefreshControl, StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/auth.actions';
import {baseApi, baseUrlFoto, fetchApi} from '../service/api';
import Loader from '../components/Loader';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhotoUpload from 'react-native-photo-upload';
import LoaderModal from '../components/LoaderModal';
import {showMessage} from 'react-native-flash-message';


type Props = {}


class Profile extends Component <{}> {
    constructor() {
        super();
        this.state = {
            refreshing: false,
            foto: '',
            showAlert: false,
            data: null,
            loaded: false,
            error: null,
            isLoading: true,
            dataProfil: null,
            inClick: false,
            dataUser: null,
            active: false,
            inClickEditProfil: false,
            inClickUbahPassword: false,
            inClickUbahNomorHp: false,
        };
    }

    componentDidMount() {
        this.showProfil();

    }

    showProfil() {
        fetch(baseApi + '/user/user', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoading: false,
                dataProfil: responseJson.dataUser.user,
                dataUser: responseJson.dataProfile,
                foto: responseJson.image,
                refreshing: false,
            });


        })
            .catch((error) => {

            });
    }

    onClickEditProfil = () => {
        this.setState({inClickEditProfil: true});
        Actions.editProfil();
        setTimeout(function () {
            this.setState({inClickEditProfil: false});
        }.bind(this), 2000);
    };

    onClickUbahPassword = () => {
        this.setState({inClickUbahPassword: true});
        Actions.gantiPassword();
        setTimeout(function () {
            this.setState({inClickUbahPassword: false});
        }.bind(this), 2000);
    };

    onClickUbahNomorHp = () => {
        this.setState({inClickUbahNomorHp: true});
        Actions.gantiPassword();
        setTimeout(function () {
            this.setState({inClickUbahNomorHp: false});
        }.bind(this), 2000);
    };

    logoutUser = () => {
        this.setState({inClick: true});
        this.props.dispatch(logoutUser(this.props.getUser.userDetails.id));
        setTimeout(function () {
            this.setState({inClick: false});
        }.bind(this), 2000);
    };

    showAlert = () => {
        this.setState({
            showAlert: true,
        });
    };

    hideAlert = () => {

        this.setState({
            showAlert: false,
        });

    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.showProfil();

    };

    render() {

        const {showAlert} = this.state;
        const userDetails = this.state.dataProfil;
        const userProfil = this.state.dataUser;
        const id = this.props.getUser.userDetails.id;
        const token = this.props.getUser.userDetails.token;

        var listView = [];
        var listViewProfil = [];

        listViewProfil.push(
            <View>
                <View style={{padding: 20, alignItems: 'center'}}>
                    <Icon active type="font-awesome" name="map-marker"/>
                    <Text style={{textAlign: 'center'}}>{userProfil != null
                        ? userProfil.nama_provinsi + ' ' + userProfil.nama_kab_kota + ' ' + userProfil.nama_kecamatan + ' ' + userProfil.nama_kelurahan : ''}</Text>
                    <Text style={{textAlign: 'center'}}>{userProfil != null
                        ? userProfil.alamat : ''}</Text>
                </View>
                <ListItem
                    title="Nama"
                    subtitle={userProfil != null ? userProfil.nama : ''}
                />
                <ListItem
                    title="No Bpjs"
                    subtitle={userProfil != null ? userProfil.no_bpjs : ''}
                />
                <ListItem
                    title="Nomor Telpon"
                    subtitle={userProfil != null ? userProfil.no_telpon : ''}
                />
                <ListItem
                    title="Agama"
                    subtitle={userProfil != null ? userProfil.agama : ''}
                />
            </View>,
        );


        var fotoProfil = [];
        if (this.state.foto != '') {
            fotoProfil.push(
                <View>
                    <Image
                        key={this.state.foto.uri}
                        style={{
                            paddingVertical: 40,
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                        }}
                        resizeMode='cover'
                        source={{uri: this.state.foto}}
                    />
                </View>,
            );
        } else {
            fotoProfil.push(
                <View>
                    <Image
                        style={{
                            paddingVertical: 30,
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                        }}
                        resizeMode='cover'
                        source={require('../images/logo/logo-hitam.jpg')}
                    />
                </View>,
            );
        }
        return (
            <View style={{flex: 1}}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{ text: 'Profil', style: { fontWeight:'bold',color: '#fff' } }}
                />
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            }>
                <View style={styles.header}>
                    <Image style={{height: 170, width: '100%', transform: [{scale: 1.44}]}}
                           resizeMode='contain' source={require('../images/logo/rsud.jpg')}/></View>
                <PhotoUpload
                    quality={30}
                    containerStyle={styles.avatarPhoto}
                    onPhotoSelect={avatar => {
                        if (avatar) {

                            if (avatar) {

                                fetch(baseApi + '/user/updatePhoto', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
                                    },
                                    body: JSON.stringify({
                                        id: this.props.getUser.userDetails.id,
                                        photo: avatar,
                                    }),
                                }).then((response) => response.json()).then((responseJson) => {
                                    if(responseJson.success === true){
                                        showMessage({
                                            message: 'Foto berhasil di upload',
                                            type: 'warning',
                                            position: 'bottom',
                                        });
                                    }else{
                                        showMessage({
                                            message: 'Foto gagal di update',
                                            type: 'danger',
                                            position: 'bottom',
                                        });
                                    }
                                })
                                    .catch((error) => {

                                    });
                            }
                        }
                    }}
                >
                    {this.state.foto != '' ? <Image
                        key={new Date()}
                        style={{
                            paddingVertical: 40,
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                        }}
                        resizeMode='cover'
                        source={{uri: this.state.foto + '?' + new Date()}}
                    /> : <Image
                        style={{
                            paddingVertical: 30,
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                        }}
                        resizeMode='cover'
                        source={require('../images/logo/logo-hitam.jpg')}
                    />}
                </PhotoUpload>
                <View style={{marginBottom: 10, marginTop: 20, justifyContent: 'center'}}>
                    {listViewProfil}
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={styles.button}
                                          onPress={!this.state.inClickEditProfil ? this.onClickEditProfil : null}>
                            <Text style={styles.buttonText}> Edit Profil </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}
                                          onPress={!this.state.inClickUbahPassword ? this.onClickUbahPassword : null}>
                            <Text style={styles.buttonText}> Ubah Password </Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={styles.button}*/}
                        {/*                  onPress={!this.state.inClickUbahPassword ? this.onClickUbahNomorHp : null}>*/}
                        {/*    <Text style={styles.buttonText}> Ubah Nomor Hp </Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity style={styles.buttonLogout} onPress={this.showAlert}>
                            <Text style={styles.buttonText}> Logout </Text>
                        </TouchableOpacity></View>

                    <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        title="Notifikasi"
                        message="Apakah anda yakin ingin keluar"
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        confirmText="Ya"
                        cancelText="Tidak"
                        confirmButtonColor="#DD6B55"
                        onConfirmPressed={() => {
                            this.logoutUser();
                        }}
                        onCancelPressed={() => {
                            this.hideAlert();
                        }}
                    />
                </View>
            </ScrollView>
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
    buttonLogout: {
        width: 300,
        backgroundColor: '#50574f',
        borderRadius: 25,
        marginVertical: 2,
        paddingVertical: 13,
    },
    header: {
        width: '100%',
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',


    },
    headerPhoto: {
        height: 170,
    },
    avatarPhoto: {
        width: 150,
        height: 150,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 30,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 90,
    },
    name1: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name2: {
        fontSize: 28,
        color: '#696969',
        fontWeight: '600',
    },
    info: {
        fontSize: 16,
        color: '#00BFFF',
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        color: '#696969',
        marginTop: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: '#1da30b',
    },
    loader: {
        marginTop: 18,
        alignItems: 'center',
    },
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
