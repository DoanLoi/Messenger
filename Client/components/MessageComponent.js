import React, { Component } from "react"
import {
    Container, Content, Card, CardItem,
    Left, Thumbnail, Header, Button,
    Body, Title, Right,
    Text, H2, Badge,
    List, ListItem, View, Input, InputGroup
} from 'native-base'
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import {host,linkImage} from "../linkHost"
export default class MessageComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            userConversation:[],
        
        }
        this.fetchData=this.fetchData.bind(this);
    }
  
    fetchData=()=>{
        const self=this;
        fetch(host,{
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }})
        .then(function(response) {
          
          // Read the response as json.
          return response.json();
        })
        .then(function(responseAsJson) {
         self.setState({userConversation:responseAsJson.userConversations});
          console.log(self.state.userConversation);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    componentDidMount(){
        this.fetchData();
    }
  
    render() {
        const userOnl = [
            {
                image: 'https://1.bp.blogspot.com/-tishGiEqXCw/XqhWaDmUeoI/AAAAAAAAjp4/WJ9y5kbeK7kmu2h6KjZd_AzfTLrSznZ3QCLcBGAsYHQ/s1600/Anh-gai-xinh-toc-ngan%2B%25285%2529.jpg',
                name:'Huy'
            },
            {

                image: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t1.0-9/98204588_1392659477593387_4933685416030109696_n.jpg?_nc_cat=109&_nc_sid=174925&_nc_ohc=nVwatRegZcIAX9n_059&_nc_ht=scontent-hkg4-1.xx&oh=8353d3524e3c27b124327afeb6584d3b&oe=5F5C059A',
                name:'Thắng'
            }
        ]
     

        const {userConversation}=this.state;
  
 
        return (
            <Container>
              
                <Header style={{ backgroundColor: 'white', height: 80 }} >
                    <Left>
                        <Button transparent >
                            <Thumbnail small source={{ uri: "https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/82824068_832056623905097_6562117601974026240_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=wW7C0l1q4_wAX9-2D_m&_nc_ht=scontent.fhph1-1.fna&oh=7eeba18c823fa2852f0927904ba7b9bf&oe=5F5B3D1A" }}></Thumbnail>
                        </Button>

                    </Left>
                    <Body>
                        <H2 style={{ fontWeight: 'bold' }}>Chat</H2>
                    </Body>

                    <Right>
                        <Button transparent>
                            <Badge style={{ backgroundColor: '#e3e1e1', height: 28, width: 28 }}>
                                <Icon name='md-create' type="ionicon"
                                    size={20}
                                    color="black"
                                ></Icon>
                            </Badge>

                        </Button>
                        <Button transparent>
                            <Badge style={{ backgroundColor: '#e3e1e1', height: 30, width: 30 }}>
                                <Icon name='md-camera' type="ionicon"
                                    size={20}
                                    color="black"
                                ></Icon>
                            </Badge>

                        </Button>


                    </Right>
                </Header>
                <Content>
                    <View>

                    <InputGroup noBorder style={{marginHorizontal:25,marginTop:20,backgroundColor:'#e3e1e1',borderRadius:20,height:40,paddingLeft:20}}>
                    <Icon name="md-search" size={20}></Icon>
                    <Input
                        placeholder="Tìm kiếm"
                        >
                        </Input>
                    </InputGroup>
                       
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 0,
                            justifyContent: 'center'
                        }}
                    >
                     
                        <View style={{
                            flexDirection:'column',
                            width:100,
                            alignItems:'center',
                            justifyContent:'center'

                        }}>
                       
                            <View>
                            <Button style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#e3e1e1'}}>
                                    <Body>
                                        <Icon name="md-add" size={35} />
                                    </Body>
                                </Button>
                            </View>
                               
                                <Text style={{marginTop:11}}>Tin của bạn</Text>
                            
                        </View>





                        <List horizontal={true} transparent
                            dataArray={userOnl}
                            renderItem={({ item, index }) => {
                                return (
                                    <ListItem noBorder>
                                        <Body>
                                            <Button style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#e3e1e1' }}>
                                                <Body>
                                                    <Thumbnail source={{ uri:item.image }}></Thumbnail>

                                                </Body>

                                            </Button>
                                            <Text>{item.name}</Text>
                                        </Body>


                                    </ListItem>

                                );
                            }}
                        >

                        </List>


                    </View>
                    <View>
                        
                    <List
                        
                        dataArray={userConversation}
                        renderItem={({item,index})=>{
                            return(
                            <TouchableOpacity 
                            onPress={()=>{
                                this.props.navigation.navigate("userChat",{id:item._id,name:item.username,avatar:item.avatar})
                            }}
                            >
                                <Card transparent style={{height:70}}>
                                    <CardItem>

                                   
                               
                                        <Thumbnail source={{uri:linkImage+item.avatar}}></Thumbnail> 
                                        <Body style={{marginLeft:20}}>
                                        <Text>{item.username}</Text>
                                        <Text note>{"Hello"}</Text>
                                        </Body>
                                        <Text note>13:12</Text>
                                
                               
                                    </CardItem>
                                </Card>
                                </TouchableOpacity>
                            );
                        }}
                        >
                            
                        </List>
                    </View>


                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        padding: 20
    }

})