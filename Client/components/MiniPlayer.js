import React,{Component} from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272829",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16
  },
  text: {
    color: "white"
  }
});



export default class MiniPlayer extends Component{
  constructor(props){
    super(props);
    this.state={
      isPlay:true
    }
  }
  componentDidUpdate(){
  this.parent=this.props.parent;
 
  }
render(){
 
  
  const {isPlay}=this.state;
   
  return (
  
      <View style={styles.container}>
        
        <Icon name="heart" color="white" size={24} />
        <TouchableOpacity
        onPress={this.props.onPress}
        >        
        <Text style={styles.text}>Metronomy - The Bay</Text>
        </TouchableOpacity>
        {isPlay?
        <TouchableOpacity
        onPress={()=>{
          if(this.parent!='loi'){
            this.parent.stopSound(this.parent);
            this.setState({isPlay:false})
          }
        }}
        >
        <Icon name="pause-circle" color="white" size={24} />
        </TouchableOpacity>
        :
        <TouchableOpacity
        onPress={()=>{
          if(this.parent!='loi'){
            this.parent.playSound(this.parent);
            this.setState({isPlay:true})
          }
        }}
        >
        <Icon name="play-circle" color="white" size={24} />
        </TouchableOpacity>
        
        }
      </View>
  
  );
}
} 
  