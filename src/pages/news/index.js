import React, {Component} from 'react';
import {
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

const {height} = Dimensions.get('window');
const imageUrl = '../../images/banner/banner1.jpg';


export default class ListThumbnailExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            searchAktif: 0,

            showTryAgain: false,
        };
    }

    componentDidMount() {
        this.getData();

    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
            dataIsi: null,
            dataJudul: null,
            dataPostLink: null,
            dataPostTanggal: null,
        });
    }

    handleLoadMore = () => {

        if (this.state.searchAktif === 0) {
            this.setState(
                {page: this.state.page + 1, isLoading: true},
                this.getData,
            );
        }

    };

    handleShare = () => {
        const tanggalTahun = this.state.dataPostTanggal.substring(0, 4);
        const tanggalBulan = this.state.dataPostTanggal.substring(5, 7);
        const tanggalHari = this.state.dataPostTanggal.substring(8, 11);

        const url = 'https://rsud.padangpanjang.go.id/' + tanggalHari + '/' + tanggalBulan + '/' + tanggalTahun + '/' + this.state.dataPostLink;
        const title = this.state.dataJudul;
        const message = `${title}\n\nRead More @ ${url}\n\nShare via RSUD Smart APP`;
        return Share.share(
            {title, message, url: message},
            {dialogTitle: 'Share' + this.state.dataJudul},
        );
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
        this.setState({
            isLoading: true,
            showTryAgain: false,
        });

        const url = baseApi + '/user/berita?page=' + this.state.page;
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
                isLoading: false,
                showTryAgain: false,
                data: this.state.data.concat(responseJson.data.data),
            });

        }).catch((error) => {
            this.setState({
                isLoading: false,
                showTryAgain: true,
            });
        });
    };

    setModalVisible(visible, judul, Isi, tanggal, link) {
        this.setState({
            modalVisible: visible,
            dataIsi: Isi,
            dataJudul: judul,
            dataPostLink: link,
            dataPostTanggal: tanggal,
        });

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

    renderRow = ({item}) => {
        const time = moment(item.post_tanggal || moment.now()).fromNow();
        const deskripsi = item.post_isi.substring(0, 40);
        return (
            <List>
                <ListItem thumbnail>
                    <Left>
                        <Thumbnail square source={require('../../images/banner/banner1.jpg')}/>
                    </Left>
                    <Body>
                        <Text>{item.post_judul}</Text>
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <Text note>{time}</Text>
                        </View>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {
                            this.setModalVisible(true, item.post_judul, item.post_isi, item.post_tglpublish, item.post_link);
                        }}>
                            <Text style={{color: 'orange'}}>View</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>);
    };


    render() {
        return (
            <View style={{flex: 1, height: height}}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header searchBar rounded transparent androidStatusBarColor="#106604">
                    <Item>
                        <Icon name="ios-search"/>
                        <Input onChangeText={this._onChangeSearchText.bind(this)} placeholder="Cari Berita"/>
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>

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
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={this.renderFooter}
                        data={this.state.data}/>}

                <Modal
                    onRequestClose={() => {
                        this.setModalUnvisible(!this.state.modalVisible);
                    }}
                    animationType="slide"
                    transparent
                    visible={this.state.modalVisible}
                >
                    <Container style={{margin: 15, marginBottom: 0, backgroundColor: '#fff'}}>
                        <View style={{flex: 1}}>
                            <Header style={{backgroundColor: '#009387'}}>
                                <Body>
                                    <Title style={{fontSize: 12}} children={this.state.dataJudul}></Title>
                                </Body>
                                <Right>
                                    <Button style={{marginRight: 5}} onPress={this.handleShare}>
                                        <Icon name="share" style={{color: 'white', fontSize: 12}}/>
                                    </Button>
                                    <Button onPress={() => {
                                        this.setModalUnvisible(!this.state.modalVisible);
                                    }}>
                                        <Icon name="close" style={{color: 'white', fontSize: 12}}/>
                                    </Button>
                                </Right>
                            </Header>
                            <Content style={{margin: 5}}>
                                <Text style={{fontSize: 24, fontWeight: 'bold'}}>{this.state.dataJudul} :</Text>
                                <HTMLView
                                    value={this.state.dataIsi}
                                    stylesheet={styles.a}
                                />
                                {/*<Fab*/}
                                {/*    position="bottomRight"*/}
                                {/*>*/}
                                {/*    <Icon name="share" style={{color:'white',fontSize:12}}/>*/}
                                {/*</Fab>*/}
                            </Content>


                        </View>
                    </Container>
                </Modal>
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
