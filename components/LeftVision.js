import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import {AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';



const LeftVision = props => {

    const ref = useRef()

    const Indicator = (Name, size, color, opacity) => {
      return (
        <View style={{marginHorizontal: 2}}>
          <AntDesign name={Name} size={size} color={color} style={{opacity: opacity}} />
        </View>
      )
    }
    
    useEffect(() => {
        if(props.rosConnected){
            ref.current?.play()
        }
    }, [props.rosConnected])

    return (

    
      <View style={{width: "100%", height:"100%", flexDirection: "row", alignItems: "center"}}>
      
        <View style={{width: "80%", height: "95%", alignItems: "center"}}>
          
          <Image source={require("../images/KartoffelVogn/kartoffelvogn_hitch-1.png")} resizeMode="stretch" style={{height: props.distanceToTractor, width: "30%"}}/>
          <Image source={require("../images/KartoffelVogn/kartoffelvogn_Vogn.png")}  resizeMode="stretch" style={{height: props.cartLength, width: "70%"}}/>
          <View style={{position: 'absolute', height: props.elevatorWidth, right: "-12%", justifyContent: "flex-start", alignItems: "flex-start", top: props.positionZ, borderColor: "red", borderWidth: 2}}>
            <LottieView ref={ref} source={require('../animation/Lottie/påfyldSnegl1.json')} resizeMode="cover" autoPlay={false} loop style={{height: "100%", maxWidth: 300, top: 0, opacity: props.elevatorOpacity, flexGrow: 1, aspectRatio: 380 / 130}}/>
          </View>
          </View>
          <View style={{width: "20%", height: "100%", backgroundColor: Colors.fallWhite, justifyContent: "center", alignItems: "center"}}>
            <View style={{height: "6%", width: "70%", backgroundColor: "green", alignItems: "center", justifyContent: "center", borderRadius: 30, marginBottom: 5}}>
              <Text style={{fontSize: 22, color: Colors.fallWhite, fontWeight: "900"}}>Faster</Text>
            </View>
            {Indicator("caretup", 100, "green", props.speedDifference < - 5 ? 1 : 0.2)}
            {Indicator("caretup", 90, "green", props.speedDifference < - 4 ? 1 : 0.2)}
            {Indicator("caretup", 80, "green", props.speedDifference < - 3 ? 1 : 0.2)}
            {Indicator("caretup", 70, "green", props.speedDifference < - 2 ? 1 : 0.2)}
            {Indicator("caretup", 60, "green", props.speedDifference < - 1 ? 1 : 0.2)}
            <TouchableOpacity onPress={() => props.setModalVisible(true)}>
              <View style={styles.startButton}>
              {!props.rosConnected ? <Text style={styles.startButtonText}>Start</Text> :
                <View>
                  <Text>{props.positionZ}</Text>
                  <Text>{props.speedDifference} km/h</Text>
                </View>
                }
              </View>
            </TouchableOpacity>
            {Indicator("caretdown", 60, "red", props.speedDifference > 1 ? 1 : 0.3)}
            {Indicator("caretdown", 70, "red", props.speedDifference > 2 ? 1 : 0.3)}
            {Indicator("caretdown", 80, "red", props.speedDifference > 3 ? 1 : 0.3)}
            {Indicator("caretdown", 90, "red", props.speedDifference > 4 ? 1 : 0.3)}
            {Indicator("caretdown", 100, "red", props.speedDifference > 5 ? 1 : 0.3)}
            <View style={{height: "6%", width: "70%", backgroundColor: "red", alignItems: "center", justifyContent: "center", borderRadius: 30, marginTop: 5}}>
              <Text style={{fontSize: 22, color: Colors.fallWhite, fontWeight: "900"}}>Slower</Text>
            </View>
            
        </View>

      </View>
    
    )
}

const styles = StyleSheet.create({
   

    cartName: {
      fontSize: 22,
      fontWeight: "500",
      color: Colors.fallOragne
    },

    startButton : {
      height: 100,
      width: 100,
      borderRadius: 50, 
      borderColor: Colors.fallGreen,
      borderWidth: 1,
      backgroundColor: Colors.fallGrey,
      justifyContent: "center",
      alignItems: "center"
      
    },

    startButtonText: {
      fontSize: 24,
      color: Colors.fallOragne,
      fontWeight: "700"

    }

  });

export default LeftVision;