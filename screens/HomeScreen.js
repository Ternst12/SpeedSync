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

    const [ipAddress, setIpAddress] = useState("192.168.45.100:9090")
    const [ipModalVisible, setIpModalVisible] = useState(false)
    const [distanceToTractor, setDistanceToTractor] = useState("20%")
    const [cartLength, setCartLength] = useState("80%")
    const [speedDifference, setSpeedDifference] = useState(0)
    const [leftVision, setLeftVision] = useState(false)
    const [positionZ, setPositionZ] = useState("0%")
    const [wifiConnected, setWifiConnected] = useState(false)
    const [rosConnected, setRosConnected] = useState(false)
    const [cartName, setCartName] = useState("Default")
    const [playAnimation, setPlayAnimation] = useState(false)
    const [elevatorOpacity, setElevatorOpacity] = useState(0)
    const [selectedElevatorWidth, setSelectedElevatorWidth] = useState(1.2)

  
  var opacity = 0
  
  
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

  var ros = new ROSLIB.Ros();


  useEffect(() => {
      if (selectedCart) {
      console.log("SelectedCart = ", selectedCart)
      var CartTotalLength = parseFloat(selectedCart.length) + parseFloat(selectedCart.distance)
      console.log("CartTotalLength = ", CartTotalLength)
      console.log("length = " + selectedCart.length + " distance = " + selectedCart.distance)
      setDistanceToTractor(parseFloat((selectedCart.distance / CartTotalLength) * 100) + "%")
      setCartLength(parseFloat((selectedCart.length / CartTotalLength) * 100) + "%")
      setSelectedElevatorWidth((parseFloat(selectedCart.width / CartTotalLength) * 100 ) + "%")
      setCartName(selectedCart.name)
      }
      componentDidMount() 
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
      getData()
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
      setRosConnected(false)
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
        headerShown: false,
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
              <LeftVision setIpModalVisible={setIpModalVisible} elevatorOpacity={elevatorOpacity} positionZ={positionZ} speedDifference={speedDifference} rosConnected={rosConnected} image={image} cartLength={cartLength} distanceToTractor={distanceToTractor} elevatorWidth={selectedElevatorWidth} />
              : 
              <RightVision setIpModalVisible={setIpModalVisible} elevatorOpacity={elevatorOpacity} positionZ={positionZ} speedDifference={speedDifference}  rosConnected={rosConnected} image={image} cartLength={cartLength} distanceToTractor={distanceToTractor} elevatorWidth={selectedElevatorWidth} />
            }
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