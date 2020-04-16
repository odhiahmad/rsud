import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator,RefreshControl } from 'react-native';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/auth.actions';
import {baseApi, fetchApi} from '../service/api';
import Loader from '../components/Loader';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhotoUpload from 'react-native-photo-upload';
import {
    Container,
    Header,
    Content,
    Button,
    ListItem,
    Text,
    Icon,
    Left,
    Body,
    Right,
    Switch,
    Col,
    Row,
    Grid,
    Fab,
} from 'native-base';
import LoaderModal from '../components/LoaderModal';


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
        };
    }

    componentDidMount() {
        this.showProfil()

    }

    showProfil(){
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
                refreshing:false,
            });

            console.log(this.props.getUser.userDetails.id);
        })
            .catch((error) => {
                console.log(error);
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
        this.showProfil()

    }

    render() {

        const {showAlert} = this.state;
        const userDetails = this.state.dataProfil;
        const userProfil = this.state.dataUser;
        const id = this.props.getUser.userDetails.id;
        const token = this.props.getUser.userDetails.token;
        console.log(token);
        var listView = [];
        var listViewProfil = [];

        if (userProfil != 'Kurok') {
            listViewProfil.push(
                <View>
                    <Left/>
                    <Body style={{padding: 20}}>
                        <Icon active type="FontAwesome" name="map-marker"/>
                        <Text style={{textAlign: 'center'}}>{userProfil != null
                            ? userProfil.nama_provinsi + ' ' + userProfil.nama_kab_kota + ' ' + userProfil.nama_kecamatan + ' ' + userProfil.nama_kelurahan : ''}</Text>
                        <Text style={{textAlign: 'center'}}>{userProfil != null
                            ? userProfil.alamat : ''}</Text>
                    </Body>
                    <Right/>

                    <Grid style={{marginBottom: 10, marginTop: 5}}>
                        <Col style={{height: 50}}></Col>
                        <Col style={{width: 165, height: 50, marginRight: 5}}>
                            <Button full rounded info
                                    onPress={!this.state.inClickEditProfil ? this.onClickEditProfil : null}>
                                <Text style={{color: '#ffffff'}}> Edit Profil </Text>
                            </Button></Col>
                        <Col style={{width: 160, height: 50}}>
                            <Button full info rounded
                                    onPress={!this.state.inClickUbahPassword ? this.onClickUbahPassword : null}>
                                <Text style={{color: '#ffffff'}}> Ganti Password </Text>
                            </Button></Col>
                        <Col style={{height: 50}}></Col>
                    </Grid>
                    <ListItem icon>
                        <Left>
                            <Text>Nama</Text>
                        </Left>
                        <Body>

                        </Body>
                        <Right>
                            <Text>{userProfil != null ? userProfil.nama : ''}</Text>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Text>No BPJS</Text>
                        </Left>
                        <Body>

                        </Body>
                        <Right>
                            <Text>{userProfil != null ? userProfil.no_bpjs : ''}</Text>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Text>Penanggung Jawab</Text>
                        </Left>
                        <Body>

                        </Body>
                        <Right>
                            <Text>{userProfil != null ? userProfil.penanggung_jawab : ''}</Text>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Text>Agama</Text>
                        </Left>
                        <Body>

                        </Body>
                        <Right>
                            <Text>{userProfil != null ? userProfil.agama : ''}</Text>
                        </Right>
                    </ListItem>
                </View>,
            );
        } else if (userProfil === 'Kurok') {
            listViewProfil.push(
                <View>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon active name="person"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>Akun anda belum di approve</Text>
                        </Body>
                    </ListItem>
                </View>,
            );
        } else {
            listViewProfil.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

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
            <Container>
                <Content  refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>

                        <View
                            style={styles.container}>

                            {/*<Fab*/}
                            {/*    active={this.state.active}*/}
                            {/*    direction="up"*/}
                            {/*    containerStyle={{bottom: 65}}*/}
                            {/*    style={styles.fab}*/}
                            {/*    position="bottomRight"*/}
                            {/*    onPress={() => this.setState({active: !this.state.active})}*/}
                            {/*>*/}
                            {/*    <Icon name="md-share"/>*/}
                            {/*    <Button style={{backgroundColor: '#3B5998'}}>*/}
                            {/*        <Icon name="logo-facebook"/>*/}
                            {/*    </Button>*/}
                            {/*    <Button style={{backgroundColor: '#34AF23'}}>*/}
                            {/*        <Icon name="logo-whatsapp"/>*/}
                            {/*    </Button>*/}
                            {/*</Fab>*/}
                            <View style={styles.header}>
                                <Image style={{height: 170, width: '100%', transform: [{scale: 1.44}]}}
                                       resizeMode='contain' source={require('../images/logo/rsud.jpg')}/></View>

                            <PhotoUpload
                                quality={30}
                                containerStyle={styles.avatarPhoto}
                                onPhotoSelect={avatar => {
                                    if (avatar) {
                                        console.log('Image base64 string: ', avatar);
                                        if (avatar) {
                                            console.log({
                                                id: this.props.getUser.userDetails.id,
                                                photo: avatar,
                                            });
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
                                                console.log(responseJson);
                                            })
                                                .catch((error) => {
                                                    console.log(error);
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
                                <Grid style={{marginBottom: 10, marginTop: 5}}>
                                    <Col style={{height: 50}}></Col>
                                    <Col style={{width: 300, height: 50}}><Button full success rounded
                                                                                  onPress={this.showAlert}>
                                        <Icon type="FontAwesome" name='sign-out'/>
                                        <Text style={{color: '#ffffff'}}> Keluar dari Akun </Text>
                                    </Button></Col>
                                    <Col style={{height: 50}}></Col>
                                </Grid>

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


                        </View>

                </Content>
            </Container>
        );


    }
}

const styles = StyleSheet.create({

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
