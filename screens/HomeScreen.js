import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import { useState, useLayoutEffect, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from "react-native-modal";
import {FontAwesome5} from "@expo/vector-icons"
import ROSLIB from 'roslib';
import Colors from '../constants/Colors';
import RightVision from '../components/RightVision';
import LeftVision from '../components/LeftVision';
import StartingSyncModal from '../components/StartingSyncModal';
import {LinearGradient} from "expo-linear-gradient"
import { parseDocument } from 'htmlparser2';




const HomeScreen = props => {


    const image = require("../images/CartCreations/kartoffelvogn.png");
    
    const selectedCart = useSelector(state => state.carts.selectedCart)

    const [ipAddress, setIpAddress] = useState("10.43.2.202:9090")
    const [ipModalVisible, setIpModalVisible] = useState(false)
    const [distanceToTractor, setDistanceToTractor] = useState("20%")
    const [cartLength, setCartLength] = useState("80%")

    const [speedDifference, setSpeedDifference] = useState(0)
    const [leftVision, setLeftVision] = useState(false)
    const [positionZ, setPositionZ] = useState("0%")
    const [modalVisible, setModalVisible] = useState(false)
    const [wifiConnected, setWifiConnected] = useState(false)
    const [rosConnected, setRosConnected] = useState(false)
    const [cartName, setCartName] = useState("Default")
    const [index, setIndex] = useState(0)
    const [playAnimation, setPlayAnimation] = useState(false)
    const [labelText, setLabelText] = useState("Setting the Camera ...")
    const [elevatorOpacity, setElevatorOpacity] = useState(0)
    const [selectedElevatorWidth, setSelectedElevatorWidth] = useState(1.2)
    const [noMarker, setNoMarker] = useState(true)


    const getDataTimer = () => {
      const test1 = setTimeout(() => {setLabelText("Getting the position data ..."); clearTimeout(test1); elevatorOpacityChange()}, 2000)
      const test2 = setTimeout(() => {setLabelText("Calibrate velocity ..."); getData(); clearTimeout(test2)}, 4500)
      const test3 = setTimeout(() => {setModalVisible(false); setIndex(0); setPlayAnimation(false); clearTimeout(test3) }, 6000)
    }
  
  var opacity = 0
  var test = 0 
  
  const elevatorOpacityChange = () => {
    setInterval(() => {
      if(opacity <= 1.0){
        opacity += 0.08
        setElevatorOpacity(opacity); 
      } else if(opacity > 1.0) {
        clearInterval()
      }
    }, 300) 
  }

  var test1 = null

  useEffect(() => {
    setInterval(() => {
      if(test != test1) {
      test1 = test
      setNoMarker(false)
      } else {
        setNoMarker(false)
      }
    }, 1000)
  }, [])

    useEffect(() => {
    if(index == 2) {
      setPlayAnimation(true)
    }
    }, [index])

    useEffect(() => {
      console.log("ws://" + ipAddress)
    }, [ipAddress])

    useEffect(() => {
      if(index == 2) {
        getDataTimer()
      }
    }, [playAnimation])

  var ros = new ROSLIB.Ros();


  useEffect(() => {
      if (selectedCart) {
      console.log("SelectedCart = ", selectedCart)
      var CartTotalLength = parseInt(selectedCart.length) + parseInt(selectedCart.distance)
      console.log("CartTotalLength = ", CartTotalLength)
      console.log("length = " + selectedCart.length + " distance = " + selectedCart.distance)
      setDistanceToTractor(parseFloat((selectedCart.distance / CartTotalLength) * 100) + "%")
      setCartLength(parseFloat((selectedCart.length / CartTotalLength) * 100) + "%")
      setSelectedElevatorWidth((parseFloat(selectedCart.width / CartTotalLength) * 100 ) + "%")
      setCartName(selectedCart.name)
      }
     // getData();  
  }, [selectedCart])

  const wagon_pose_sub = new ROSLIB.Topic({
    ros : ros,
    name : '/marker_distance',
    messageType : 'geometry_msgs/PointStamped'
  });

  const wagon_speedDifference_sub = new ROSLIB.Topic({
    ros : ros,
    name : '/marker_velocity',
    messageType : 'geometry_msgs/PointStamped'
  });

  const componentDidMount = () => {
    try{
        ros.connect("ws://" + ipAddress)
    } catch(error) {
      console.log("Problemer med forbindelsen = ", error)
    }
    ros.on('connection', function() {
      setWifiConnected(true)
      console.log("It Works :-)")
    });  
    ros.on('error', function(error) {
      setWifiConnected(false)
      console.log("en fejl", error)
      setTimeout(() => {
        try{
          ros.connect("ws://" + ipAddress)
        } catch(error) {
          console.log("Problemer med forbindelsen = ", error)
        }

      }, 3000)
    });
    ros.on('close', function() {
      console.log("its closed")
      setWifiConnected(false)
      setTimeout(() => {
        try{
          ros.connect("ws://" + ipAddress)
        } catch(error) {
          console.log("Problemer med forbindelsen = ", error)
        }
      }, 3000)
  
  });
  };

  const getData = () => {
    componentDidMount()
    var CartTotalLength = null
    if(selectedCart) {
      CartTotalLength = selectedCart.length + selectedCart.distance
    } else {
      CartTotalLength = distanceToTractor + cartLength
    }
    wagon_pose_sub.subscribe(function(m) {
      setRosConnected(true)
      const auger_pose = m.point
      const dataZ = auger_pose.z 
      
      setPositionZ(parseInt((dataZ / CartTotalLength) * 100 - 0.5) + "%")
    });
    wagon_pose_sub.on("error", function(error) {
      console.log("det lykkes ikke at få positions data ", error)
    })
    getSpeedDifference();
  }

  const getSpeedDifference = () => {
    wagon_speedDifference_sub.subscribe(function(m) {
      test = m.header.stamp.secs
      elevatorOpacityChange()
      setPlayAnimation(true)
      setRosConnected(true)
      const speedDiff_data = m.point
      const speedDifferenceValue = speedDiff_data.z
      setSpeedDifference(speedDifferenceValue)
    });
  }


  useLayoutEffect(() => {
    props.navigation.setOptions({ 
        headerTitle: props => <Text>Speed Sync</Text>,
        headerTitleAlign: "center",
        headerRight: () => (
            <View style={{marginRight: 30}}>
                <Text style={styles.cartName}>{cartName}</Text> 
            </View>),
        headerLeft: () => (
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity style={{marginLeft: 30, alignItems:"center"}} onPress={() => setIpModalVisible(true)}>
                    <FontAwesome5 size={20} name="wifi" color={wifiConnected ? "blue" : "grey"}/> 
                    <Text >Wifi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 20, alignItems:"center"}} onPress={getData}>
                    <FontAwesome5 size={20} name="tractor" color={rosConnected ? "blue" : "grey"}/> 
                    <Text>Ros</Text>
                </TouchableOpacity>
            </View>
            )
            
        })
    })

  
    return (

    
      <View style={styles.container}>
         <LinearGradient 
          style={{width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center',}} 
          colors={[Colors.fallWhite, Colors.fallGrey]} >
            {leftVision ?
              <LeftVision elevatorOpacity={elevatorOpacity} positionZ={positionZ} speedDifference={speedDifference} setModalVisible={setModalVisible} rosConnected={rosConnected} image={image} cartLength={cartLength} distanceToTractor={distanceToTractor} elevatorWidth={selectedElevatorWidth} noMarker={noMarker}/>
              : 
              <RightVision elevatorOpacity={elevatorOpacity} positionZ={positionZ} speedDifference={speedDifference} setModalVisible={setModalVisible} rosConnected={rosConnected} image={image} cartLength={cartLength} distanceToTractor={distanceToTractor} elevatorWidth={selectedElevatorWidth} noMarker={noMarker}/>
            }
            <Modal isVisible={modalVisible} style={{alignItems: "center"}}>
              <StartingSyncModal labelText={labelText} playAnimation={playAnimation} setModalVisible={setModalVisible} index={index} setIndex={setIndex} setLeftVision={setLeftVision} getData={getData}/>
            </Modal>
            <Modal style={{alignItems: "center"}} isVisible={ipModalVisible}>
              <View style={{backgroundColor: Colors.fallGrey, width: Dimensions.get("screen"). width * 0.40, height: Dimensions.get("screen"). height * 0.20, justifyContent: "center", alignItems: "center"}}>
                <TextInput value={ipAddress} onSubmitEditing={() => {setIpModalVisible(false), componentDidMount()}} onChangeText={(text) => {setIpAddress(text)}} style={{width: "80%", height: "20%", backgroundColor: Colors.fallWhite, paddingLeft: 10}} />
              </View>
            </Modal>
        </LinearGradient>
      </View>
    
    )
}

const styles = StyleSheet.create({
    container: {
      height: "100%",
      flexDirection: "row",  
    },

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

export default HomeScreen;