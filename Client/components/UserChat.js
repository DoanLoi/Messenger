import React, { Component } from "react"
import {
    Container, Content, Card, CardItem, Left,
    Thumbnail, Header, Button, Body, H4, Text,
    Right, Badge, Footer, InputGroup,
    Input,
    List
} from 'native-base'
import { FlatList, KeyboardAvoidingView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { TouchableOpacity, StyleSheet, View, Image, Dimensions, Platform } from "react-native"
import { host, linkImage } from "../linkHost"
import {socket} from "../socket"
const height = Dimensions.get('window').height;

export default class UserChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allChat: [],
            _id: this.props.route.params.id,
            isSend: false,
            messageVal: "",
            refresh: 0,
            heightBody: height - 130,
            currentId:''
        }
       
        this.fetchData = this.fetchData.bind(this);
        socket.on("response-chat-text-emoji",(data)=>{
            let all = this.state.allChat;


            all.push(data.message);

            this.setState({ allChat: all });
            
        })

    }
    
    _refresh() {
        this.setState({ refresh: this.state.refresh + 1 })
    }
    _sendMessage() {
  
        const dataText = {
            uid: this.state._id,
            messageVal: this.state.messageVal
        }
     
        this.setState({ messageVal: "" })
        const self = this;
        fetch(host + '/message/add-new-text-emoji', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataText)
        })
            .then((res) => res.json())
            .then(resJson => {
                let all = this.state.allChat;


                all.push(resJson.message);

                this.setState({ allChat: all });
                socket.emit("chat-text-emoji",{message:resJson.message,contactId:this.state._id});


            })

    }
    fetchData = (id) => {
        const self = this;
        const url = host + "/chat/" + id;
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {

                // Read the response as json.
                return response.json();
            })
            .then(function (responseAsJson) {
                
                self.setState({ allChat: responseAsJson.message,currentId:responseAsJson.user });


            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.fetchData(this.state._id);


    }

    render() {
        const { params } = this.props.route;
        const { allChat, isSend, heightBody,currentId,_id } = this.state;

        const avatar = 'https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/82824068_832056623905097_6562117601974026240_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=wW7C0l1q4_wAX9-2D_m&_nc_ht=scontent.fhph1-1.fna&oh=7eeba18c823fa2852f0927904ba7b9bf&oe=5F5B3D1A';

        return (



            <Container>
                <Header style={{ backgroundColor: 'white', height: 80 }} >
                    <Left style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Button transparent
                            onPress={() => {
                                this.props.navigation.navigate('homeChat')
                            }}
                        >
                            <Icon name='md-arrow-round-back' size={30} color="red"></Icon>
                        </Button>
                        <Button transparent >
                            <Thumbnail small source={{ uri: linkImage + params.avatar }}></Thumbnail>
                        </Button>
                        <Text style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 18 }}>{params.name}</Text>

                    </Left>


                    <Right>
                        <Button transparent
                        onPress={()=>{
                            let data={
                                id:_id,
                                name:params.name
                            }
                            this.props.navigation.navigate('roomChat',data)
                        }}
                        >
                            <Icon name="md-videocam" size={30} color="red"></Icon>
                        </Button>

                        <Button transparent>
                            <Icon name="md-information-circle" size={30} color="red"></Icon>
                        </Button>


                    </Right>
                </Header>
                <Content>
                    <View style={{ marginVertical: 15, height: heightBody }}>

                        <FlatList

                            ref={ref => { this.scrollView = ref }}
                            onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
                            data={this.state.allChat}
                            extraData={this.state}

                            initialNumToRender={allChat.length - 1}
                            keyExtractor={(item) => item._id}

                            renderItem={({ item, index }) => {



                                if (item.messageType === 'text' && item.senderId !=currentId ) {
                                    return (
                                        <Card style={styles.cardYou} transparent>
                                            <Thumbnail small source={{ uri: linkImage + params.avatar }}
                                                style={{ marginRight: 20 }}

                                            ></Thumbnail>

                                            <Text style={styles.textYou}>{item.text}</Text>
                                        </Card>


                                    );

                                }
                                if (item.messageType === 'text' && item.senderId == currentId) {
                                    return (
                                        <Card style={styles.cardMe} transparent>


                                            <Text style={styles.textMe}>{item.text}</Text>
                                        </Card>


                                    );

                                }



                                if (item.type === 'image' && !item.ofMe) {
                                    return (
                                        <Card style={styles.cardYou} transparent>
                                            <Thumbnail small source={{ uri: 'https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/82824068_832056623905097_6562117601974026240_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=wW7C0l1q4_wAX9-2D_m&_nc_ht=scontent.fhph1-1.fna&oh=7eeba18c823fa2852f0927904ba7b9bf&oe=5F5B3D1A' }}
                                                style={{ marginRight: 20 }}

                                            ></Thumbnail>

                                            <Image source={{ uri: 'https://i.pinimg.com/736x/52/ed/71/52ed71b9f0db74a4a278bf1fba608e8b.jpg' }} style={{ width: 150, height: 150 }} />
                                        </Card>


                                    );

                                }
                                if (item.type === 'image' && item.ofMe) {
                                    return (
                                        <Card style={styles.cardMe} transparent>


                                            <Image source={{ uri: 'https://i.pinimg.com/736x/52/ed/71/52ed71b9f0db74a4a278bf1fba608e8b.jpg' }} style={{ width: 150, height: 150 }} />
                                        </Card>


                                    );

                                }



                            }}
                        >

                        </FlatList>
                    </View>

                </Content>
                <Footer style={{ backgroundColor: 'white', height: 50 }}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Button transparent style={styles.butonFooter}>
                            <Icon name='md-camera' color="red" size={30}></Icon>

                        </Button>
                        <Button transparent style={styles.butonFooter}>
                            <Icon name='md-image' color="red" size={30}></Icon>

                        </Button >
                        <Button transparent style={styles.butonFooter}>
                            <Icon name='md-mic' color="red" size={30}></Icon>

                        </Button>
                      




                    </Left>
                    <Body>
                        <InputGroup
                            style={{
                                width: 200,
                                marginLeft: 20,
                                backgroundColor: '#d9d9d9',
                                padding: 10,
                                borderRadius: 20,
                                height: 40
                            }}>
                          
                                <Input

                                    placeholder="Aa"
                                    onFocus={() => {
                                        this.setState({ isSend: true, heightBody: height - 430 });
                                        setTimeout(()=>{  this.scrollView.scrollToEnd({ animated: true });},1)
                                    }}
                                    onBlur={() => {
                                        this.setState({ isSend: false, heightBody: height - 130 })
                                    }}
                                   
                                    onChangeText={(text) => {
                                        this.setState({ messageVal: text })
                                        this.scrollView.scrollToEnd({ animated: true });
                                        
                                    }}
                                    value={this.state.messageVal}
                                />
                          

                            <Icon name="md-happy" color="red" size={30}></Icon>

                        </InputGroup>
                        {!isSend ?
                            <Button transparent style={{ paddingLeft: 10 }}
                              
                            >
                                <Icon name="md-heart" color="red" size={35} ></Icon>
                            </Button> :
                            <Button transparent style={{ paddingLeft: 10 }}
                                onPress={() => {
                                    this._sendMessage();


                                }}
                            >
                                <Icon name="md-send" color="red" size={35} ></Icon>
                            </Button>}
                    </Body>
                    <Right>

                    </Right>
                </Footer>

            </Container>



        );
    }
}
const styles = StyleSheet.create({
    butonFooter: {
        marginLeft: 20
    },
    cardMe: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',

    },
    cardYou: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10
    },
    textMe: {
        backgroundColor: 'red',
        padding: 10,
        marginRight: 20,
        borderRadius: 20,
        color: 'white'
    },
    textYou: {
        backgroundColor: '#ededed',
        padding: 10,
        marginRight: 20,
        borderRadius: 20,
        color: 'black'
    }
})