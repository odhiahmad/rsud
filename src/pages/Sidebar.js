import React, { Component } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Text } from 'native-base';
export default class Sidebar extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Header Sidebar</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <Text>
                        This is Sidebar Menu
                    </Text>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full>
                            <Text>Footer</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}
