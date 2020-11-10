import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Container, Header, Left, Button,
  Thumbnail, Body, Right, Badge,
  Content, List, Card, H2, CardItem, Text,
  InputGroup,Input
}

  from 'native-base';
import { TouchableOpacity} from "react-native"
import {WebView} from 'react-native-webview'
import Icon from "react-native-vector-icons/Ionicons"
import {host} from "../linkHost"



export default class PaperComponent extends Component {
  constructor(props){
    super(props);
    this.state={
      listArticle:[]
    }
  }
  fetchData=()=>{
    const self=this;
    fetch(host+'/article',{
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }})
    .then(function(response) {
      
      // Read the response as json.
      return response.json();
    })
    .then(function(responseAsJson) {
      console.log(responseAsJson);
     self.setState({listArticle:responseAsJson.listArticle});
      console.log(self.state.listArticle);
    })
    .catch(function(error) {
      console.log(error);
    });
}
componentDidMount(){
    this.fetchData();
}
  render() {
   const {listArticle}=this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: 'white', height: 80 }} >
          <Left>
            <Button transparent >
              <Thumbnail small source={{ uri: "https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/82824068_832056623905097_6562117601974026240_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=wW7C0l1q4_wAX9-2D_m&_nc_ht=scontent.fhph1-1.fna&oh=7eeba18c823fa2852f0927904ba7b9bf&oe=5F5B3D1A" }}></Thumbnail>
            </Button>

          </Left>
          <Body>
            <H2 style={{ fontWeight: 'bold' }}>Đọc báo</H2>
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

            <InputGroup noBorder style={{ marginHorizontal: 25, marginTop: 20, backgroundColor: '#e3e1e1', borderRadius: 20, height: 40, paddingLeft: 20 }}>
              <Icon name="md-search" size={20}></Icon>
              <Input
                placeholder="Tìm kiếm"
              >
              </Input>
            </InputGroup>

          </View>
          <List

            dataArray={listArticle}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                   this.props.navigation.navigate("detailPaper",{url:item.url,name:"24h"})
                  }}
                >
                  <Card transparent style={{ height: 110 }}>
                    <CardItem>



                      <Thumbnail square style={{height:80,width:90}}  source={{ uri: item.urlImg }}></Thumbnail>
                      <Body style={{ marginLeft: 20,borderColor:"#c9c9c5",borderBottomWidth:1 ,paddingBottom:20}}>
                        <Text style={{fontWeight:'900',fontSize:18}}>{item.title}</Text>
                        <Text note>{"25 phút"}</Text>
                      </Body>
                     

                    </CardItem>
                  </Card>
                </TouchableOpacity>
              );
            }}
          >

          </List>
        </Content>
      </Container>
    );
  }
}
var width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white'
  }
})