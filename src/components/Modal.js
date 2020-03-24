import React, {Component} from 'react';
import {Dimensions, Modal, Share} from 'react-native';
import {Container, Header, Content, Body, Left, Icon, Right,Button,Title} from 'native-base';

class ModalKomponen extends Component {

    constructor(props) {
        super(props);
    }

    handleClose = () => {
        return this.props.onClose();
    };

    handleShare = () => {

    }

    render() {
        const {showModal, articleData} = this.props;

        return (
            <Modal
                animationType="slide"
                transparent
                visible={showModal}
                onRequestClose={this.handleClose}
            >
                <Container style={{margin:15,marginBottom:0,backgroundColor:'#fff'}}>
                    <Header style={{backgroundColor:'#009387'}}>
                        <Left>
                            <Button onPress={this.handleClose} transparent>
                                <Icon name="close" style={{color:'white',fontSize:12}}/>
                            </Button>
                        </Left>
                        <Body>
                            {/*<Title children={articleData.post_judul}></Title>*/}
                        </Body>
                        <Right>
                            <Button onPress={this.handleClose} transparent>
                                <Icon name="close" style={{color:'white',fontSize:12}}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>

                    </Content>
                </Container>
            </Modal>
        );
    }
}

export default ModalKomponen;
