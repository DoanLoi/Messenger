import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Container, Header, Left, Button,
  Thumbnail, Body, Right, Badge,
  Content, List, Card, H2, CardItem, Text,
  InputGroup, Input
}

  from 'native-base';
import { TouchableOpacity,Image} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MusicComponent from "./MusicComponent"
const width=Dimensions.get('window').width;
export default class TabMusic extends Component {
  constructor(props) {
    super(props);
    this.state={
      recommendMusic:[],
      rankMusic:[],
    }

  }

  fetchRankMusic(){
    const self=this;
    fetch("http://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1",{
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }})
    .then(function(response) {
     
            // Read the response as json.
      return response.json();
    })
    .then(function(responseAsJson) {
     self.setState({rankMusic:responseAsJson.data.song});
     
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  fetchRecommendMusic(){
    const self=this;
    fetch("http://mp3.zing.vn/xhr/recommend?type=audio&id=ZW67OIA0",{
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }})
    .then(function(response) {
     
            // Read the response as json.
      return response.json();
    })
    .then(function(responseAsJson) {
      
     self.setState({recommendMusic:responseAsJson.data.items});
     
    })
    .catch(function(error) {
      console.log(error);
    });
  }

 async componentDidMount(){
   this.fetchRecommendMusic();
   this.fetchRankMusic();
  
   
 }

  render() {
    const {fetchMusic,parent}=this.props;
    const {recommendMusic,rankMusic}=this.state;
    return (
      <Container showsVerticalScrollIndicator={false}>
        <Header style={{ backgroundColor: 'white', height: 80 }} >
          <Left>
            <Button transparent >
              <Thumbnail small source={{ uri: "https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/82824068_832056623905097_6562117601974026240_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=wW7C0l1q4_wAX9-2D_m&_nc_ht=scontent.fhph1-1.fna&oh=7eeba18c823fa2852f0927904ba7b9bf&oe=5F5B3D1A" }}></Thumbnail>
            </Button>

          </Left>
          <Body>
            <H2 style={{ fontWeight: 'bold' }}>Nghe nhạc</H2>
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
        <Content style={{marginHorizontal:20}}>
          <View>

            <InputGroup noBorder style={{ marginHorizontal: 25, marginTop: 20, backgroundColor: '#e3e1e1', borderRadius: 20, height: 40, paddingLeft: 20 }}>
              <Icon name="md-search" size={20}></Icon>
              <Input
                placeholder="Tìm kiếm"
              >
              </Input>
            </InputGroup>

          </View>
          <View style={{width:width-40,height:250,marginVertical:20}}>
            <Image style={{flex:1,borderRadius:20}} source={{uri:'https://alohastudio.vn/wp-content/uploads/2019/08/Kinh-nghi%E1%BB%87m-%C4%91i-ch%E1%BB%A5p-%E1%BA%A3nh-c%C6%B0%E1%BB%9Bi-9.jpg'}}></Image>
            
          </View>
          <View>
            <Text style={{fontWeight:'bold',fontSize:23}}>Có Thể Bạn Muốn Nghe</Text>
             <List
             style={{marginVertical:20}}
             dataArray={recommendMusic}
             horizontal={true}
             showsHorizontalScrollIndicator={false}
             renderItem={({item,index})=>{
               return(
                 <TouchableOpacity 
                 onPress={()=>{
          
                   fetchMusic(item.code,parent);
                   
                 }}
                 >
                <View  style={{height:160,width:140,marginRight:20}}>
                <Image style={{flex:1,borderRadius:10,marginBottom:6}} source={{uri:item.thumbnail}} />
                 <Text style={{marginLeft:2}} numberOfLines={1}>{item.name}</Text>
                
              </View>
              </TouchableOpacity>
               );
              
             }}

             keyExtractor={(item)=>item.name}
             >

             </List>
          </View>
          <View>
            <Text style={{fontWeight:'bold',fontSize:23}}>Ca Sĩ Bạn Có Thể Biết</Text>
            <View style={{flexDirection:'row',marginTop:20}}>
            <View  style={{height:width/2-40,width:width/2-30,marginRight:20}}>
                <Image style={{flex:1,borderRadius:10,marginBottom:6}} source={{uri:'https://previews.123rf.com/images/ardely/ardely1707/ardely170700022/83045118-vector-abstract-irregular-polygon-background-with-a-triangle-pattern-in-light-baby-pastel-colors.jpg'}} />
                <View style={styles.boxSinger}>
                   <Text style={{fontWeight:'bold',fontSize:20,color:'#434544'}}>Trưng Quân</Text>
                 </View>
              </View>
              <View  style={{height:width/2-40,width:width/2-30,marginRight:20}}>
                <Image style={{flex:1,borderRadius:10,marginBottom:6}} source={{uri:'https://3pageplus.com/wp-content/uploads/2019/03/change-background-color-on-wix.jpg'}} />
                <View style={styles.boxSinger}>
                   <Text style={{fontWeight:'bold',fontSize:20,color:'#434544'}}>Binz</Text>
                 </View>
                
             
                
              </View>
            
              
            </View>
            <View style={{flexDirection:'row',marginTop:10}}>
              <View  style={{height:width/2-40,width:width/2-30,marginRight:20}}>
                <Image style={{flex:1,borderRadius:10,marginBottom:6}} source={{uri:'https://cdn4.vectorstock.com/i/1000x1000/28/58/polygonal-square-background-colors-from-green-vector-12102858.jpg'}} />
                 <View style={styles.boxSinger}>
                   <Text style={{fontWeight:'bold',fontSize:20,color:'#434544'}}>Karik</Text>
                 </View>
                
              </View>
              <View  style={{height:width/2-40,width:width/2-30,marginRight:20}}>
                <Image style={{flex:1,borderRadius:10,marginBottom:6}} source={{uri:'https://cdn3.vectorstock.com/i/1000x1000/51/32/abstract-pink-flower-on-green-polygon-triangular-vector-11495132.jpg'}} />
                <View style={styles.boxSinger}>
                   <Text style={{fontWeight:'bold',fontSize:20,color:'#434544'}}>Lê Bảo Bình</Text>
                 </View>
              </View>
              </View>
          </View>
          <View>
            <Text style={{fontWeight:'bold',fontSize:23}}>Bảng Xếp Hạng</Text>
            <List
             style={{marginVertical:20}}
             dataArray={rankMusic}
             showsHorizontalScrollIndicator={false}
             renderItem={({item,index})=>{
               return(
                <TouchableOpacity 
                onPress={()=>{
                  fetchMusic(item.code,parent);
                }}
                >
                    <Card transparent style={{height:70}}>
                        <CardItem>

                       
                              <Text style={{marginRight:10,fontWeight:'bold',marginLeft:-10,textDecorationLine:'underline'}}>{index+1}</Text>
                             
                            <Thumbnail square source={{uri:item.thumbnail}}></Thumbnail> 
                            <Body style={{marginLeft:20}}>
                            <Text>{item.name}</Text>
                            <Text note>{"Hello"}</Text>
                            </Body>
                    
                   
                        </CardItem>
                    </Card>
                    </TouchableOpacity>
               );
              
             }}

             keyExtractor={(item)=>item.name}
             >

             </List>
            
          </View>
        </Content>
        
      </Container>
    )
  }
}
const styles=StyleSheet.create({
 boxSinger:{
   position:"absolute",
   top:0,
   left:0,
   bottom:0,
   right:0,
   alignItems:'center',
   justifyContent:'center'
 },
})