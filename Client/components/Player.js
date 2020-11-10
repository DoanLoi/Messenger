import React,{Component} from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather as Icon } from "@expo/vector-icons";
import Slider from "react-native-slider";
import Moment from "moment";
import { Audio } from 'expo-av';
import {host, linkImage} from "./../linkHost"
import { string } from "react-native-redash";
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    margin: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    padding: 16
  },
  title: {
    color: "white",
    textAlign:'center',
    padding: 16,
    width:width-130
  },
  cover: {
    marginVertical: 26,
    width: width - 100,
    height: width - 100,
    borderRadius:(width-32)/2
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  song: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
   
  },
  artist: {
    color: "white",
    
  },
  slider: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: width - 32,
    borderRadius: 2,
    height: 4,
    marginVertical: 16
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF",
},
thumb: {
    width: 15,
    height: 15,
    backgroundColor: "#3D425C"
},
});


export default class Player extends Component{
  constructor(props){
    super(props);
    this.state={
        trackLength: 300,
        positionTrack:0,
        durationTime:0,
        timeElapsed: "0:00",
        timeRemaining: "5:00",
        code: this.props.code,
        music:"",
        imageLink:'https://lh3.googleusercontent.com/YxPaSbwThpWlm2XPCdRmwtw_H02uqV-O8OhOwtSHheH3BehgXSBfq8AkmHXt-XYGhyQO',
        isPlay:true,
        hasMusic:false
    }
    this.sound="";
  }
  changeTime = seconds => {
    this.setState({ timeElapsed: Moment.utc(seconds * 1000).format("m:ss") });
    this.setState({ timeRemaining: Moment.utc((this.state.trackLength - seconds) * 1000).format("m:ss") });
    this.sound.pauseAsync();
    this.sound.playFromPositionAsync(seconds*1000);
};
  convertTime=seconds =>{
    return  Moment.utc(seconds).format("m:ss") 
  }
async prepareMusic(id){
  Audio.setAudioModeAsync({
    allowsRecordingIOS:false,
    interruptionModeIOS:Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS:true,
    interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
    shouldDuckAndroid:true,
    staysActiveInBackground:true,
  })
  this.sound=new Audio.Sound();
  

  await this.sound.loadAsync({uri:`http://api.mp3.zing.vn/api/streaming/audio/${id}/320`}, { shouldPlay: true });
  let info=await this.sound.getStatusAsync();
  this.setState({timeRemaining:this.convertTime(info.durationMillis),durationTime:info.durationMillis});
  this.durationCounter();
  

 }

 playSound(parent){

  parent.sound.playAsync();
  parent.setState({isPlay:true});
  
 }
 stopSound(parent){
  parent.sound.pauseAsync();
  parent.setState({isPlay:false});
}
fetchMusic(code){
  const self=this;

  fetch("http://mp3.zing.vn/xhr/media/get-source?type=audio&key="+code,{
      method:"GET",
      headers:{
          'Content-Type':'application/json'
      }})
  .then(function(response) {
   
          // Read the response as json.
    return response.json();
  })
  .then(function(responseAsJson) {
    let img=responseAsJson.data.album.thumbnail_medium;
   self.setState({music:responseAsJson.data,imageLink:img});
   self.prepareMusic(responseAsJson.data.id);
  //  self.setState({imageLink:responseAsJson.data.album})
   
  //  console.log(typeof responseAsJson.data.album.thumbnail_medium);

   
   
  })
  .catch(function(error) {
    console.log(error);
  });
}


timer = null;

durationCounter = () => {
    if(typeof this.sound != 'string')
    {
      this.timer = setInterval(async () => {
        const info = await this.sound.getStatusAsync();
         this.setState({
           timeElapsed: this.convertTime(info.positionMillis),
           timeRemaining:this.convertTime(info.durationMillis-info.positionMillis),
           positionTrack:(info.positionMillis/info.durationMillis)*this.state.trackLength
         });

        //  if(info.positionMillis===info.durationMillis){
        //    this.setState({isPlay:false});
        //  }
       }, 10);
    }
   
  
 
};

componentDidUpdate(prevProps){
  if (prevProps.code !== this.props.code) {
    this.timer && clearInterval(this.timer);
       try {
         this.sound.unloadAsync();
         this.sound=null;
         this.fetchMusic(this.props.code);
        
       } catch (error) {
        this.fetchMusic(this.props.code);
      
       }
       
       
  }
}
componentDidMount(){
  
  this.fetchMusic(this.state.code);
  

 
 

}

  render(){
      const {isPlay,imageLink,music}=this.state;

    return (
      <SafeAreaView style={styles.root}>
        <LinearGradient
          colors={["#0b3057", "#051c30"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <RectButton style={styles.button} onPress={()=>{

            
            this.props.onPress(this);
            }} >
              <Icon name="chevron-down" color="white" size={24} />
            </RectButton>
              <Text style={styles.title}>{music.name}</Text>
            <RectButton style={styles.button} onPress={this.props.onPress} >
              <Icon name="more-horizontal" color="white" size={24} />
            </RectButton>
          </View>
          <Image source={{uri:imageLink}} style={styles.cover} />
          <View style={styles.metadata}>
            <View style={{width:width-100}}>
              <Text style={styles.song} numberOfLines={1}>{music.name}</Text>
              <Text style={styles.artist}>{music.performer}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.hello()}><AntDesign name="heart" size={24} color="#55b661" /></TouchableOpacity>
            
          </View>
          <View style={{ margin: 32 }}>
                    <Slider
                        minimumValue={0}
                        maximumValue={this.state.trackLength}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="#93A8B3"
                        onValueChange={seconds => this.changeTime(seconds)}
                        value={this.state.positionTrack}
                      
                    ></Slider>
                    <View style={{ marginTop: -12, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{color:'white'}}>{this.state.timeElapsed}</Text>
                        <Text style={{color:'white'}}>{this.state.timeRemaining}</Text>
                    </View>
                </View>
          <View style={styles.controls}>
            <Icon name="shuffle" color="rgba(255, 255, 255, 0.5)" size={24} />
            <AntDesign name="stepbackward" color="white" size={32} />
            {isPlay?<TouchableOpacity
              onPress={()=>this.stopSound(this)}
            >
              <AntDesign name="pause" color="white" size={48} />
            </TouchableOpacity>:
            <TouchableOpacity
            onPress={()=>this.playSound(this)}
          >
            <AntDesign name="play" color="white" size={48} />
          </TouchableOpacity>}
           
            <AntDesign name="stepforward" color="white" size={32} />
            <Icon name="repeat" color="rgba(255, 255, 255, 0.5)" size={24} />
          </View>
        </View>
      </SafeAreaView>
    );

  }

} 
 