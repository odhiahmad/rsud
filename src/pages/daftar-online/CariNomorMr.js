import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';
import Tab1 from './InputBaru';
import Tab2 from './DaftarTersimpan';
export default class CariNomorMr extends Component {
    render() {
        return (
            <Container>
                <Tabs initialPage={1} back>
                    <Tab tabStyle={{backgroundColor: 'white'}} textStyle={{color: 'black'}}
                         activeTabStyle={{backgroundColor: '#1da30b'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}
                         heading="Masukan Baru">
                        <Tab1 />
                    </Tab>
                    <Tab tabStyle={{backgroundColor: 'white'}} textStyle={{color: 'black'}}
                         activeTabStyle={{backgroundColor: '#1da30b'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}
                         heading="Daftar Tersimpan">
                        <Tab2 />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
