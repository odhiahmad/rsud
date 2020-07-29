import React, {Component} from 'react';
import {Container, Content, Accordion, ListItem, Left, Button, Body, Root, List, Right} from 'native-base';
import {baseApi} from '../service/api';
import {Header,Icon,Badge} from 'react-native-elements';
import {ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LoaderModal from '../components/LoaderModal';
import MapView from 'react-native-maps';
import {Actions} from 'react-native-router-flux';

export default class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namaKelas: null,
            isLoading: false,
            dataSource: null,
            dataArray: [],
            showTryAgain: false,
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    componentDidMount() {
        this.getIndex();
    }

    getIndex() {
        this.setState({
            isLoading: true,
            showTryAgain: false,
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
                showTryAgain: false,
            });
        })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    showTryAgain: true,
                });
            });
    }


    onRegionChange(region) {
        this.setState({region});
    }

    render() {


        return (
            <View style={{flex: 1}}>
                <LoaderModal
                    loading={this.state.isLoading}/>
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
                    centerComponent={{text: 'Informasi', style: {fontWeight: 'bold', color: '#fff'}}}
                />

                <List>
                    <ListItem itemDivider>
                        <Text>Informasi</Text>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#1da30b'}}>
                                <Icon color='#fff' active name="home"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>Jl. Tabek Gadang Kel.Ganting</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#1da30b'}}>
                                <Icon color='#fff' active name="phone"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>Telp. (0752) 484250 Fax. (0752) 82046</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#1da30b'}}>
                                <Icon  color='#fff' active name="mail"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>rsud.pp@padangpanjang.go.id</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: '#1da30b'}}>
                                <Icon color='#fff' active name="cloud-circle"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>rsud.padangpanjang.go.id</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon style={{marginBottom: 20}}>
                        <Left>
                            <Button style={{backgroundColor: '#1da30b'}}>
                                <Icon color='#fff' active name="person"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>Layanan Pengaduan Masyarakat</Text>
                        </Body>
                        <Right>
                            <Text>0811-6661-414</Text>
                        </Right>
                    </ListItem>
                    <ListItem itemDivider>
                        <Text>FAQ</Text>
                    </ListItem>

                    {this.state.showTryAgain === true ?
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.button}
                                              onPress={() => this.getIndex()}>
                                <Text style={styles.buttonText}>Refresh </Text>
                            </TouchableOpacity></View> : <Accordion
                            dataArray={this.state.dataArray}
                            headerStyle={{backgroundColor: '#b7daf8'}}
                            contentStyle={{backgroundColor: '#ddecf8'}}
                        />}


                </List>

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
    container: {
        marginTop:10,
        flex: 0,
        backgroundColor: '#fff',
        alignItems: 'center',
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

