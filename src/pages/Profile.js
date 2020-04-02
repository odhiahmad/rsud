import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/auth.actions';
import {baseApi, fetchApi} from '../service/api';
import Loader from '../components/Loader';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
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
            showAlert: false,
            data: null,
            loaded: false,
            error: null,
            isLoading: true,
            dataProfil: null,
            inClick: false,
            dataUser: null,
            active: false,
        };
    }

    componentDidMount() {

        return fetch(baseApi + '/user/user', {
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
            });

            console.log(responseJson.dataProfile);
        })
            .catch((error) => {
                console.log(error);
            });
    }

    logoutUser = () => {
        this.setState({inClick: true});
        this.props.dispatch(logoutUser(this.state.dataProfil.id));
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

    render() {
        const {showAlert} = this.state;
        const userDetails = this.state.dataProfil;
        const userProfil = this.state.dataUser;
        console.log(this.props.getUser.userDetails.token);
        var listView = [];
        var listViewProfil = [];
        if (userDetails != null) {
            listView.push(
                <View>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon active name="person"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>{userDetails != null ? userDetails.name : ''}</Text>
                        </Body>
                    </ListItem>


                </View>,
            );
        } else {
            listView.push(
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View>,
            );
        }

        if (userProfil != 'Kurok') {
            listViewProfil.push(
                <View>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon active name="person"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>{userProfil != null ? userProfil.nama : ''}</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon active name="home"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>{userProfil != null ? userProfil.alamat : ''}</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon active name="card"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>No BPJS</Text>
                        </Body>
                        <Right>
                            <Text>{userProfil != null ? userProfil.no_bpjs : ''}</Text>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon active name="person"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>Penanggung Jawab</Text>
                        </Body>
                        <Right>
                            <Text>{userProfil != null ? userProfil.penanggung_jawab : ''}</Text>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Body>
                            <Text>Agama</Text>
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
        return (
            <Container>
                <Content>
                    <View style={styles.container}>

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
                        <Image style={styles.header} source={require('../images/background.jpg')}/>
                        <Image style={styles.avatar} source={require('../images/profile.png')}/>
                        <View style={{marginBottom: 10, marginTop: 70, justifyContent: 'center'}}>
                        <Grid style={{marginBottom: 10, marginTop: 5}}>
                            <Col style={{height: 50}}></Col>
                            <Col style={{width: 165, height: 50,marginRight:5}}><Button  full rounded warning onPress={this.showAlert}>
                                <Icon type="FontAwesome" name='edit'/>
                                <Text style={{color: '#ffffff'}}> Edit Profil </Text>
                            </Button></Col>
                            <Col style={{width: 160, height: 50}}><Button full success rounded onPress={this.showAlert}>
                                <Icon type="FontAwesome" name='sign-out'/>
                                <Text style={{color: '#ffffff'}}> Keluar </Text>
                            </Button></Col>
                            <Col style={{height: 50}}></Col>
                        </Grid>

                            {listViewProfil}

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
        height: 170,
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
