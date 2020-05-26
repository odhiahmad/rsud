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
    Fab
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
import moment from 'moment'
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';
const {height} = Dimensions.get('window');
const imageUrl = '../../images/banner/banner1.jpg';


class Pengaduan extends Component <{}> {
    constructor(props) {
        super(props);
        this.state = {
            active:false,
            dataIsi:null,
            dataJudul:null,
            modalArticleData:{},
            setModalVisible:false,
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
            dataPostLink:null,
            dataPostTanggal:null,
            searchText:null,
            searchAktif:0
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        }, this.getData);

    }

    setModalUnvisible(visible) {
        this.setState({
            modalVisible: visible,
        });
    }

    handleLoadMore = () => {

        if(this.state.searchAktif === 0){
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
        const url = baseApi + '/user/pengaduan?page=' + this.state.page;
        fetch(url,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                id:this.props.getUser.userDetails.id,
                search: this.state.searchText,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoading: false,
                data: this.state.data.concat(responseJson.data.data),
            });

            console.log(this.state.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
        });

    }

    searchData = async () => {
        const url = baseApi + '/user/pengaduan?page=';
        fetch(url,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                id:this.props.getUser.userDetails.id,
                search: this.state.searchText,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                data: responseJson.data.data,
                isLoading:false
            });

            console.log(this.state.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    _onChangeSearchText(text) {

        console.log(text)
        if(text === ''){
            this.setState({
                searchAktif:0
            })
        }else{
            this.setState(
                {page: 1,searchAktif:1, isLoading: false,searchText:text},
                this.searchData,
            );
        }

    }

    renderRow = ({item}) => {
        const time = moment(item.post_tanggal || moment.now()).fromNow()
        const deskripsi = item.post_isi.substring(0,40)
        return (
            <List>
                <ListItem thumbnail>
                    <Left>
                        <Thumbnail square source={require('../../images/banner/banner1.jpg')}/>
                    </Left>
                    <Body>
                        <Text>{item.post_judul}</Text>
                        <View style={{flex:1,flexDirection:'row',marginTop:10}}>
                            <Text note>{time}</Text>
                        </View>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {this.setModalVisible(true,item.post_judul,item.post_isi,item.post_tglpublish,item.post_link)}}>
                            <Text>View</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>);
    };



    render() {
        return (
            <View style={{flex: 1, height: height}}>
                <StatusBar translucent backgroundColor="#1da30b"/>
                <Header searchBar noShadow rounded transparent  androidStatusBarColor="#106604">
                    <Item>
                        <Icon name="ios-search" />
                        <Input onChangeText={this._onChangeSearchText.bind(this)} placeholder="Cari Pengaduan" />
                    </Item>
                    <Button transparent>
                        <Text>Cari</Text>
                    </Button>
                </Header>
                <FlatList
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter}
                    data={this.state.data}/>
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{bottom: 65}}
                    style={styles.fab}
                    position="bottomRight"
                    onPress={() => this.setModalVisible(true)}
                >
                    <Icon name="add" />
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
                    <View><Text>Tes</Text></View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fab:{
      marginTop: 20,
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(Pengaduan);
