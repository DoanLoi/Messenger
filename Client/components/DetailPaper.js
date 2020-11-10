import React,{Component} from "react"
import {Container,Content,Card,CardItem,Left,Thumbnail,
        Header,Right,Body,Button,Text} from 'native-base' 
import Icon from "react-native-vector-icons/Ionicons"
import {WebView} from "react-native-webview"
 export default class DetailPaper extends Component{
  constructor(props){
    super(props);
   
  }
  render(){
    const { params } = this.props.route;
    return (
      <Container>
         <Header style={{ backgroundColor: 'white', height: 50 }} >
                    <Left style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Button transparent
                            onPress={() => {
                                this.props.navigation.navigate('listArticle')
                            }}
                        >
                            <Icon name='md-arrow-round-back' size={30} ></Icon>
                        </Button>
                       
                       
                    </Left>
                          <Body >
                            <Text style={{fontSize:20,fontWeight:'bold'}}>
                            {params.name}
                            </Text>
                          </Body>

                    <Right>
                        <Button transparent>
                            <Icon name="md-more" size={30} ></Icon>
                        </Button>

                       


                    </Right>
                </Header>
      <WebView
      source={{
        uri: params.url
      }}
      style={{ marginTop: 20 }}
    />

        </Container>

     
     )
  }
}