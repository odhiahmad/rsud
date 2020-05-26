import React, {Component, useEffect} from 'react';
import {baseApi} from '../../service/api';
import {ListItem, Header, Badge,Icon} from 'react-native-elements';
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

export default class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            namaKelas: null,
            isLoading: true,
            data: [],
            inClick: false,
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
        this.setState({
            loading: true,
        });
        return fetch(baseApi + '/user/shuttle').then((response) => response.json()).then((responseJson) => {
            this.setState({
                loading: false,
                data: responseJson.data,
            });
        })
            .catch((error) => {
                console.log(error);
            });
    }


    renderRow = ({item, index}) => {
        return (
            <ListItem  onPress={() =>
                Actions.shuttlebusdetail({id: item.id})
            }

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
                <View>
                    <LoaderModal
                        loading={this.state.loading}/>
                    <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                    <Header
                        statusBarProps={{barStyle: 'light-content'}}
                        containerStyle={{
                            backgroundColor: '#1da30b',
                            justifyContent: 'space-around',
                        }}
                        barStyle="light-content"
                        placement="center"
                        centerComponent={{text: 'Shuttle Bus', style: {color: '#fff'}}}
                    />
                    <FlatList
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}/>
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
