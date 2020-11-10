import React, { Component } from "react"
import {
    Container, Content, Card, CardItem,
    Left, Thumbnail, Header, Button,
    Body, Title, Right,
    Text, H2, Badge,
    List, ListItem, View, Input, InputGroup,
    Tabs,Tab
} from 'native-base'
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import { Ionicons } from '@expo/vector-icons'
import {host,linkImage} from "../linkHost"
export default class ListFriend extends Component {
    constructor(props){
        super(props);
        this.state={
            friends:[]
        }
      

    }
 
    fetchData=()=>{
        const self=this;
        fetch(host+"/friends",{
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }})
        .then(function(response) {
          
          // Read the response as json.
          return response.json();
        })
        .then(function(responseAsJson) {
         self.setState({friends:responseAsJson.friends});
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    componentDidMount(){
    
        this.fetchData();
    }

    render() {
       const {friends}=this.state;
       const {navigation}=this.props;
        return (
            <View>
                    <View>
                    
                        <List
                            
                            dataArray={friends}
                            renderItem={({item,index})=>{
                                return(
                                    <Card transparent style={{height:85}}>
                                        <CardItem>
    
                                       
                                       
                                            <Thumbnail source={{uri:linkImage+item.avatar}}></Thumbnail>
                                            <Body style={{marginLeft:20}}>
                                            <Text style={{fontWeight:'bold'}}>{item.username}</Text>
                                            <View style={{flexDirection:'row',marginVertical:10}}>
                                            <Button primary style={{marginRight:10,borderRadius:8}}
                                            
                                            onPress={()=>{
                                              navigation.navigate('userChat',{id:item._id,name:item.username,avatar:item.avatar})
                                            }}
                                            >
                                                <Text>Nhắn tin</Text>
                                            </Button>
                                            <Button danger style={{borderRadius:8}}>
                                                <Text>Xóa bạn</Text>
                                            </Button>
                                            </View>
                                          
                                          
                                        
                                            </Body>
                                         
                                         
                                      
                                    
                                   
                                        </CardItem>
                                    </Card>
    
                                );
                            }}
                            >
                                
                            </List>
                        </View>
    
            </View>
        );

    }
}