import React, {Component} from 'react';
import {Container, Content, Accordion, ListItem, Left, Button, Icon, Body, Root,List,Right} from 'native-base';
import {baseApi} from '../service/api';
import {Header} from 'react-native-elements';
import {ActivityIndicator, StatusBar, StyleSheet, Text, View} from 'react-native';
import LoaderModal from '../components/LoaderModal';
import MapView from 'react-native-maps';
export default class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namaKelas: null,
            isLoading: false,
            dataSource: null,
            dataArray: [],
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
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


    onRegionChange(region) {
        this.setState({ region });
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
                    centerComponent={{text: 'Informasi', style: {fontWeight: 'bold', color: '#fff'}}}
                />

                <List>
                    <ListItem itemDivider>
                        <Text>Informasi</Text>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{ backgroundColor: "#1da30b" }}>
                                <Icon active name="home" />
                            </Button>
                        </Left>
                        <Body>
                            <Text>Jl. Tabek Gadang Kel.Ganting</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{ backgroundColor: "#1da30b" }}>
                                <Icon active name="contact" />
                            </Button>
                        </Left>
                        <Body>
                            <Text>Telp. (0752) 484250 Fax. (0752) 82046</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{ backgroundColor: "#1da30b" }}>
                                <Icon active name="mail" />
                            </Button>
                        </Left>
                        <Body>
                            <Text>rsud.pp@padangpanjang.go.id</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{ backgroundColor: "#1da30b" }}>
                                <Icon active name="cloud-circle" />
                            </Button>
                        </Left>
                        <Body>
                            <Text>rsud.padangpanjang.go.id</Text>
                        </Body>
                    </ListItem>
                    <ListItem icon style={{marginBottom:20}}>
                        <Left>
                            <Button style={{ backgroundColor: "#1da30b" }}>
                                <Icon active name="person" />
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

                        <Accordion
                            dataArray={this.state.dataArray}
                            headerStyle={{backgroundColor: '#b7daf8'}}
                            contentStyle={{backgroundColor: '#ddecf8'}}
                        />

                </List>

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

