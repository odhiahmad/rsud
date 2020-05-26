import React, {Component} from 'react';
import {Container, Content, Accordion, ListItem, Left, Button, Icon, Body, Root} from 'native-base';
import {baseApi} from '../service/api';
import {Header} from 'react-native-elements';
import {ActivityIndicator, StatusBar, StyleSheet, Text, View} from 'react-native';
import LoaderModal from '../components/LoaderModal';

export default class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namaKelas: null,
            isLoading: false,
            dataSource: null,
            dataArray: [],
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        });
        return fetch(baseApi + '/user/faq').then((response) => response.json()).then((responseJson) => {
            const dataArray = [];


            for (let i = 0; i < responseJson.data.length; i++) {
                this.state.dataArray.push({
                    title: responseJson.data[i].pertanyaan,
                    content: responseJson.data[i].jawaban,
                });
            }

            this.setState({
                isLoading: false,
            });
        })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {


        return (
            <View>
                <LoaderModal
                    loading={this.state.isLoading}/>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'FAQ', style: {fontWeight: 'bold', color: '#fff'}}}
                />
                <Accordion
                    dataArray={this.state.dataArray}
                    headerStyle={{backgroundColor: '#b7daf8'}}
                    contentStyle={{backgroundColor: '#ddecf8'}}
                />
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

