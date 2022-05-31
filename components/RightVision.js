import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ActivityIndicator, Button} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import {AntDesign, Entypo, Ionicons} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {WebView} from 'react-native-webview';
import { screenWidth } from '../constants/Dimensions';


const RightVision = props => {
    const [showReload, setShowReload] = useState(false)
    const [webViewKey, setWebViewKey] = useState(1)
    const [loadingActivity, setLoadingActivity] = useState(false)
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

    
      <View style={{width: "100%", height:"100%", flexDirection: "row", alignItems: "flex-end"}}>
      
        <View style={{width: "20%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: Colors.fallWhite, shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,

      elevation: 12,}}>
          <View style={{height: "6%", width: "70%", backgroundColor: "green", alignItems: "center", justifyContent: "center", borderRadius: 30, marginBottom: 5}}>
            <Text style={{fontSize: 22, color: Colors.fallWhite, fontWeight: "900"}}>Faster</Text>
          </View>
          {Indicator("caretup", 90, "green", props.speedDifference >  5 ? 1 : 0.2)}
          {Indicator("caretup", 80, "green", props.speedDifference >  4 ? 1 : 0.2)}
          {Indicator("caretup", 70, "green", props.speedDifference >  3 ? 1 : 0.2)}
          {Indicator("caretup", 60, "green", props.speedDifference >  2 ? 1 : 0.2)}
          {Indicator("caretup", 50, "green", props.speedDifference >  1 ? 1 : 0.2)}
          
          <View style={styles.startButton}>
            <TouchableOpacity onPress={() => props.setIpModalVisible(true)}>
              <View>
                <Text style={{fontSize: 18, fontWeight: "bold"}}>{props.speedDifference} km/h</Text>
              </View>
            </TouchableOpacity>
          </View>
     
          {Indicator("caretdown", 50, "red", props.speedDifference < - 1 ? 1 : 0.3)}
          {Indicator("caretdown", 60, "red", props.speedDifference < - 2 ? 1 : 0.3)}
          {Indicator("caretdown", 70, "red", props.speedDifference < - 3 ? 1 : 0.3)}
          {Indicator("caretdown", 80, "red", props.speedDifference < - 4 ? 1 : 0.3)}
          {Indicator("caretdown", 90, "red", props.speedDifference < - 5 ? 1 : 0.3)}
          <View style={{height: "6%", width: "70%", backgroundColor: "red", alignItems: "center", justifyContent: "center", borderRadius: 30, marginTop: 5}}>
            <Text style={{fontSize: 22, color: Colors.fallWhite, fontWeight: "900"}}>Slower</Text>
          </View>
          
        </View>
      
        <View style={styles.cameraView}>
                 
                  <TouchableOpacity style={{width: "100%", height: "100%", position: "absolute", zIndex: 3}} onPress={() => console.log("farvel")}>
                              <Entypo style={{position: "absolute", top: 30, right: 50}} size={screenWidth > 400 ? 30 : 24} name="video-camera" color={props.rosConnected ? "green" : "grey"} /> 
                  </TouchableOpacity>
                
                  <View style={{position: "absolute", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", zIndex: 3}}>
                    <ActivityIndicator animating={loadingActivity} size={"large"} color={"red"} />
                  </View>
                  <WebView 

                        key={webViewKey}
                        onError={(syntheticEvent) => {
                          setShowReload(true)
                          console.warn('WebView error: ', syntheticEvent.nativeEvent);
                        }}
                        onLoadProgress={({ nativeEvent }) => {
                          setLoadingActivity(nativeEvent.loading)
                        }}
                      renderError={(errorDomain, errorCode, errorDesc) =>{ 
      
                        return( 
                        <View style={styles.errorBox}>
                          <Text style={styles.errorHighlightedText}>Connectivity issues</Text>
                          <Text style={styles.errorText}>{errorDesc}</Text>
                        </View>
                        )
                      }}
                      onLoadEnd={() => setLoadingActivity(false)}
                      style={{height: "100%", width: "95%", left: "2.5%", borderRadius: 5}} 
                      scalesPageToFit={true}
                      scrollEnabled={false}
                      allowsBackForwardNavigationGestures={true}
                      containerStyle={{height: "100%", width: "100%", paddingLeft: -20,  borderRadius: 5}}
                      source={{uri:'http://192.168.45.100:8080/stream?topic=/image_rect_color&type=mjpeg&width=640&height=360'}}/>

        </View>
      
        <View style={{width: "80%", height: "69%", alignItems: "center"}}>
            {showReload ?
            <TouchableOpacity style={{position: "absolute", top: "-15%"}} onPress={() => {
              const test = webViewKey
              setWebViewKey(test + 1)
              setShowReload(false)
              }}>
              <Ionicons name="ios-reload-outline" size={44} color="blue" />
            </TouchableOpacity> : null
              }
            <Image source={require("../images/KartoffelVogn/kartoffelvogn_hitch-1.png")} resizeMode="stretch" style={{height: props.distanceToTractor, width: "30%"}}/>
            <Image source={require("../images/KartoffelVogn/kartoffelvogn_Vogn.png")}  resizeMode="stretch" style={{height: props.cartLength, width: "70%"}}/>
            <View style={{position: 'absolute', height: props.elevatorWidth, right: "-10%", justifyContent: "flex-start", alignItems: "flex-start", top: props.positionZ}}>
              <LottieView ref={ref} source={require('../animation/Lottie/påfyldSnegl1.json')} resizeMode="cover" autoPlay={false} loop style={{height: "100%", maxWidth: 300, minWidth: 300, top: 0, opacity: props.elevatorOpacity, flexGrow: 1, aspectRatio: 380 / 130}}/>
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

    },

    cameraView: {
      width: "80%", 
      height: "29%",
      position: "absolute",
      top: "1%",
      left: "20%",
      borderRadius: 5
    }, 
    errorBox: {
      position: "absolute", 
      justifyContent: "center", 
      alignItems: "center", 
      width: "100%", 
      height: "100%"
    }, 
    errorHighlightedText: {
        fontSize: 25,
        color: "black",
        fontWeight: "500"
    }, 
    errorText: {
      color: "grey",
      fontSize: 20
    }

  });

export default RightVision;