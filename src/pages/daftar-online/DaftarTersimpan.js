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
import {ActivityIndicator, View, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions, Modal,Share,SearchBar} from 'react-native';
import moment from 'moment'
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
const {height} = Dimensions.get('window');
const imageUrl = '../../images/banner/banner1.jpg';


class DaftarTersimpan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            page: 1,
            total:0,
            next_page_url:null,
            searchText:null,
            searchAktif:0
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        }, this.getData);

    }

    componentWillUnmount() {
        this.setState({
            isLoading: true,
        }, this.getData);
    }


    handleLoadMore = () => {

        if(this.state.searchAktif === 0 && this.state.next_page_url != null){
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
        const url = baseApi + '/user/getNomorMrSimpan?page=' + this.state.page;
        fetch(url,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.getUser.userDetails.token,
            },
            body: JSON.stringify({
                search: this.state.searchText,
                id:this.props.getUser.userDetails.id,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if(responseJson.data.total === 0){
                showMessage({
                    duration:4000,
                    message: "Tidak ada list favorit anda, silahkan masukan baru nomor MR",
                    type: 'danger',
                    position: 'bottom',
                });
                this.setState({
                    isLoading: false,
                    data:[],
                });
            }else{
                this.setState({
                    next_page_url:responseJson.data.next_page_url,
                    isLoading: false,
                    total:responseJson.data.total,
                    data: this.state.data.concat(responseJson.data.data),
                });

                console.log(this.state.data);
            }

        }).catch((error) => {
            console.log(error);
        });
    };


    searchData = async () => {
        const url = baseApi + '/user/getNomorMrSimpan?page=';
        fetch(url,{
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
        if(this.state.data.length === 0){
            return (
                <List>
                    <ListItem thumbnail>
                        <Body>

                            <View style={{flex:1,flexDirection:'row',marginTop:2}}>
                                <Text>Tidak ada List Favorit Tersimpan</Text>
                            </View>
                        </Body>
                    </ListItem>
                </List>);
        }else{
            return (
                <List>
                    <ListItem thumbnail>
                        <Body>
                            <View style={{flex:1,flexDirection:'row',marginTop:2}}>
                                <Text>Nama </Text><Text note>{item.nama}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',marginTop:2}}>
                                <Text>Nomor MR </Text><Text note>{item.nomr}</Text>
                            </View>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Text>Pilih</Text>
                            </Button>
                        </Right>
                    </ListItem>
                </List>);
        }

    };



    render() {
        return (
            <View style={{flex: 1, height: height}}>
                <View style={{padding:5}} searchBar rounded transparent>
                    <Item>
                        <Icon name="ios-search" />
                        <Input onChangeText={this._onChangeSearchText.bind(this)} placeholder="Cari Nama Favorit" />
                    </Item>
                </View>
                <FlatList
                    style={styles.container}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached= {this.handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter}
                    data={this.state.data}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DaftarTersimpan);
const styles = StyleSheet.create({
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
