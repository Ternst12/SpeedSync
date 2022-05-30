import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import LottieView from 'lottie-react-native';

const ModalContent1 = (playAnimation, labelText, setModalVisible, title, leftButton, rightButton, index, setIndex, setLeftVision, secondLabel, thirdLabel, getData) => {

  
  return (
    <View style={styles.modalContainer}>
      <View>
        <Text style={styles.titleLabel}>{title}</Text>
      </View>
      {leftButton == "" ? 
      <View style={styles.animationAndLabelContainer}>
        <View style={styles.shadowAnimation}>
          <View style={styles.animationBox}>
            <LottieView source={require("../animation/Lottie/2360-tractor.json")} autoPlay loop resizeMode="cover" style={{width: 500, flexGrow: 1, alignSelf: "center", aspectRatio: 400 / 200}}/>
          </View>
        </View>
        <View style={styles.labelBox}>  
          <Text style={styles.labelTextStyle}>{labelText}</Text>
        </View>
      </View> 
      : 
      <View></View>
      }
      
      {index != 2 ? 
      <View style={{position: "absolute", bottom: 20, width: "90%"}}>
        <TouchableOpacity style={styles.buttonBoxLeft} onPress={leftButton == "Left" ? () => {setLeftVision(true); setIndex(index + 1)}: () => {setIndex(0); setModalVisible(false)}}>
          <Text style={styles.buttonText}>{leftButton}</Text>   
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBoxRight} onPress={leftButton == "Left" ? () => {setLeftVision(false); setIndex(index + 1)}: () => {setIndex(index + 1)}}>
          <Text style={styles.buttonText}>{rightButton}</Text>   
        </TouchableOpacity>
      </View> : 
      
      <View><Text></Text></View>}
    </View>
  )

}


const StartingSyncModal = props => {

  const nullFunction = () => {
    return null;
  }

  const ModalArray = [
    ModalContent1(props.playAnimation, props.labelText, props.setModalVisible, "Are you ready to start the operation?", "No", "Yes", props.index, props.setIndex, nullFunction, props.getData),
    ModalContent1(props.playAnimation, props.labelText, props.setModalVisible, "On which side of the cart is the elevator?", "Left", "Right", props.index, props.setIndex, props.setLeftVision, props.getData),
    ModalContent1(props.playAnimation, props.labelText, props.setModalVisible, "Starting the synchronization process ...", "", "", props.index, props.setIndex, nullFunction, props.getData)
  ]

    return(
    <View style={styles.modalContainer}>
      <TouchableOpacity style={{position: "absolute", top: 15, right: 15}} onPress={() => {props.setIndex(0); props.setModalVisible(false)}}>
        <MaterialIcons name="cancel" size={30} color="black" />
      </TouchableOpacity>
      {ModalArray[props.index]}
      
    </View>
    )

}
const styles = StyleSheet.create({
  
    modalContainer: {
      height: Dimensions.get("screen").height * 0.4,
      width: Dimensions.get("screen").width * 0.6,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center", 
      backgroundColor: Colors.fallWhite
    },
    titleLabel : {
      fontSize: 24,
      color: Colors.fallOragne
    },

    buttonBoxLeft: {
      position: "absolute", 
      bottom: 45, 
      left: 50, 
      width: 60, 
      height: 60, 
      borderRadius: 30, 
      backgroundColor: Colors.fallOragne,
      justifyContent: "center",
      alignItems: "center"
    },

    buttonBoxRight: {
      position: "absolute", 
      bottom: 45, 
      right: 50, 
      width: 60, 
      height: 60, 
      borderRadius: 30, 
      backgroundColor: Colors.fallGreen, 
      justifyContent: "center",
      alignItems: "center"
    },

    buttonText: {
      fontSize: 20,
      color: Colors.fallWhite,
      fontWeight: "700"
    },
    
    animationAndLabelContainer: {
      width: "100%",
      height: "80%",
      marginTop: 20,
      alignItems: "center"
    },

    shadowAnimation: {
      height: "80%",
      width: "90%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,

      elevation: 12,
    },

    animationBox: {
      height: "100%",
      width: "100%",
      borderRadius: 120,
      overflow: "hidden",
      
    },
    labelBox: {
      height: "20%",
      width: "50%",
      borderColor: "blue",
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center"
    },
    labelTextStyle: {
      fontSize: 22,
      color: "grey"
    }

  });

export default StartingSyncModal;