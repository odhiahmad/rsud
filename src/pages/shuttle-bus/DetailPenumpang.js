import React, {Component, useEffect} from 'react';
import {baseApi} from '../../service/api';
import {ListItem, Header, Badge, Icon} from 'react-native-elements';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity, Image, StatusBar, FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import {Actions} from 'react-native-router-flux';
import LoaderModal from '../../components/LoaderModal';
import Ripple from 'react-native-material-ripple';

export default class DetailPenumpang extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            namaKelas: null,
            isLoading: true,
            data: [],
            inClick: false,
            showTryAgain: false,
        };
    }

    onClickButton = () => {
        this.setState({inClickHome: true});
        Actions.shuttlebusdetail({id: id});
        setTimeout(function () {
            this.setState({inClickHome: false});
        }.bind(this), 2000);
    };

    componentDidMount() {
        this.getIndex();
    }

    getIndex() {
        this.setState({
            loading: true,
            showTryAgain: false,
        });
        return fetch(baseApi + '/user/shuttleBusPenumpang', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_shuttle: this.state.idShuttle,
            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                loading: false,
                data: responseJson.data,
                showTryAgain: false,
            });
        })
            .catch((error) => {
                this.setState({
                    loading: false,
                    showTryAgain: true,
                });
            });
    }


    renderRow = ({item, index}) => {
        return (
            <ListItem
                title={<Text>{item.nama}</Text>}
                leftAvatar={{
                    title: item.nama[0],
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
                    centerComponent={{text: 'Shuttle Bus Detail Penumpang', style: {color: '#fff'}}}
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
                        }} onPress={() => this.getIndex()}>
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

            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});
