import React, { Component } from 'react';
import { Container,View, Header, Content, List, ListItem, Text, Left, Right, Icon, Fab } from 'native-base';
import {Actions} from 'react-native-router-flux';
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false
        };
    }

    render() {
        return (
            <Container>

                <Content>
                    <List>
                        <ListItem selected>
                            <Left>
                                <Text>Simon Mignolet</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Text>Nathaniel Clyne</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Text>Dejan Lovren</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                    </List>



                </Content>
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => Actions.formpendaftaran()}>
                    <Icon type="FontAwesome" name="plus"/>

                </Fab>
            </Container>
        );
    }
}
