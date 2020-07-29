import React, {Component} from 'react';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import {
    Animated,
    Image,
    BackHandler,
    NetInfo,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Alert, TextInput, ScrollView, ActivityIndicator, Modal, FlatList, Dimensions,
} from 'react-native';
import {ListItem, Header, Badge} from 'react-native-elements';
import ParallaxScrollView from 'react-native-parallax-scrollview';
import LoaderModal from '../components/LoaderModal';
import ValidationComponent from 'react-native-form-validator';
import Loader from '../components/Loader';
import {baseApi, baseApiBpjs, baseUrlFoto} from '../service/api';
import {Actions} from 'react-native-router-flux';
import StickyParalaxHeader from 'react-native-sticky-parallax-header';
import AwesomeAlert from 'react-native-awesome-alerts';
import email from 'react-native-email';
import PasswordInputText from 'react-native-hide-show-password-input';

import {connect} from 'react-redux';
import Select2 from 'react-native-select-two';
import {logoutUser} from '../actions/auth.actions';
import HTMLView from 'react-native-htmlview';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import PhotoUpload from 'react-native-photo-upload';
import moment from 'moment';


const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});


class Notifikasi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
        };

    }

    componentDidMount() {
        this.setState({
            loading: true,
        });
        return fetch(baseApi + '/user/getNotifikasi', {
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
            });

        }).catch((error) => {

        });
    }

    renderRow = ({item, index}) => {
        return (
            <ListItem
                title={<Text>{item.judul}</Text>}
                subtitle={<Text style={{color: 'gray'}}>{item.keterangan}</Text>}
                leftAvatar={{
                    title: item.judul[0],
                }}
            />
        );
    };

    render() {
        return (
            <View>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Daftar Notifikasi', style: {color: '#fff'}}}
                />
                <LoaderModal
                    loading={this.state.loading}/>
                {this.state.data.length !== 0 ?
                    <FlatList
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}/> :
                    <ListItem
                        title={<Text>Tidak Ada Notifikasi</Text>}
                    />}


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

export default connect(mapStateToProps, mapDispatchToProps)(Notifikasi);
