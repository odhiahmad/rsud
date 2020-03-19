import React, { Component } from "react";
import {Container, Header, Content, Accordion, ListItem, Left, Button, Icon, Body, Root} from 'native-base';
import {baseApi} from '../service/api';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

export default class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            namaKelas: null,
            isLoading: true,
            dataSource: null,
        };
    }

    componentDidMount() {

        return fetch(baseApi + '/user/faq').then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoading: false,
                dataSource: responseJson.data,
            });
        })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                </View>
            );
        } else {
            const dataArray = [];

            for (let i = 0; i <this.state.dataSource.length ; i++) {
                dataArray.push({
                    title:this.state.dataSource[i].pertanyaan,
                    content:this.state.dataSource[i].jawaban
                })
            }

            console.log(dataArray)


            return (
                <Container>
                    <Content padder>
                        <Accordion
                            dataArray={dataArray}
                            headerStyle={{ backgroundColor: "#b7daf8" }}
                            contentStyle={{ backgroundColor: "#ddecf8" }}
                        />
                    </Content>
                </Container>
            );

        }
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
        height:40,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});

