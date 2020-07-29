import React, {Component} from 'react';
import {
    Container,
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
    Root,
    Title,
    Fab, Textarea,
} from 'native-base';
import ModalKomponen from '../../components/Modal';
import CustomRow from '../../components/CustomRow';
import {baseApi} from '../../service/api';
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
    StatusBar,
} from 'react-native';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';

const {height} = Dimensions.get('window');
const imageUrl = '../../images/banner/banner1.jpg';
import {Header, Badge, Icon} from 'react-native-elements';
import {showMessage} from 'react-native-flash-message';
import ValidationComponent from 'react-native-form-validator';
import {Actions} from 'react-native-router-flux';

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
            data: [],
            page: 1,
            dataPostLink: null,
            dataPostTanggal: null,
            searchText: null,
            searchAktif: 0,
            pengaduan: '',

            showTryAgain: false,
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

    _onSubmitFinish() {
        this.validate({
            pengaduan: {required: true},
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
                    pengaduan: this.state.pengaduan,
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
    }

    renderRow = ({item}) => {
        return (
            <List>
                <ListItem thumbnail>
                    <Left><Text style={{color: 'gray'}}>Pesan</Text></Left>
                    <Body>
                        <Text>{item.pesan_pengaduan}</Text>
                    </Body>
                </ListItem>
            </List>);
    };


    render() {
        return (
            <View style={{flex: 1}}>
                <LoaderModal
                    loading={this.state.loading}/>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    leftComponent={
                        <Icon type='ionicon' name='arrow-back-outline' color='#fff'
                              onPress={()=>Actions.pop()}/>}
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
                        </TouchableOpacity></View>: <FlatList
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
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'gray',
                        }}>Form Pengaduan</Text>

                        <Textarea ref="pengaduan"
                                  autoCapitalize='words'
                                  onChangeText={(pengaduan) => this.setState({pengaduan})}
                                  placeholderTextColor="#ffffff" style={styles.inputBox} rowSpan={5}
                                  bordered
                                  placeholder="Tulis Pengaduan Disini"/>
                        <TouchableOpacity style={styles.button}
                                          onPress={this._onSubmitFinish.bind(this)}>
                            <Text style={styles.buttonText}>Submit Pengaduan</Text>
                        </TouchableOpacity>
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
