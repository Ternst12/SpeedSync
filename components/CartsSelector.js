import React, {useState, useLayoutEffect, useEffect, useCallback} from "react";
import {View, Button, Text, StyleSheet, Image, Alert, TextInput, Dimensions, TouchableOpacity} from "react-native"
import { useDispatch } from 'react-redux';
import * as CartsActions from "../store/actions/CartsActions"
import {Ionicons} from "@expo/vector-icons"
import CreateCartPages from "./CreateCartPages";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";

const marginOfIcons = Dimensions.get("screen").width * 0.04

const CartSelector = props => {

    const dispatch = useDispatch();

    const [imageTaken, setImageTaken] = useState(props.image)
    const [navn, setNavn] = useState(props.cartName)
    const [bredde, setBredde] = useState(props.cartWidth)
    const [distance, setDistance] = useState(props.cartDistance)
    const [længde, setLængde] = useState(props.cartLength)
    const [index, setIndex] = useState(0)

 
    useEffect(()=> {
     setImageTaken(props.image)
     setNavn(props.cartName)
     setBredde(props.cartWidth)
     setDistance(props.cartDistance)
     setLængde(props.cartLength)   
    }, [props.image, props.cartName, props.cartWidth, props.cartDistance, props.cartLength])

    const saveCart = useCallback(async(navn, imageUri, distance, bredde, længde) => {
        try {
        await dispatch(CartsActions.addCart(navn, imageUri, distance, bredde, længde));
        setNavn("Wagen Name")
        setBredde("")
        setImageTaken("")
        setLængde("")
        setDistance("")
        } catch (e) {

        }  
    })

    useLayoutEffect(() => {
        props.navigation.setOptions({ 
            headerTitle: props => <Text style={{color: Colors.fallOragne, fontSize: 24}}>Wagen Übersicht</Text>,
            headerTitleAlign: "center",
            headerRight: () => (
                <TouchableOpacity style={{marginRight: 30}} onPress={() => {props.setModalVisible(true)}}>
                    <Ionicons name={"add-circle"} size={40} color={Colors.fallGreen}/>
                </TouchableOpacity>
            ),  
            })
        })
    

    return (
        <View>
        <View style={styles.CartSelector}>
            <View style={styles.imageField}>
                {props.editMode ?
                <TouchableOpacity style={styles.nameBox} onPress={() => {setIndex(0), props.setModalVisible(true)}}>
                    <Text style={styles.name}>{navn}</Text>
                </TouchableOpacity> :
                <View style={styles.nameBox}>
                    <Text style={styles.name}>{navn}</Text>
                </View>
                }
                {props.editMode ?
                <TouchableOpacity onPress={() => {setIndex(1), props.setModalVisible(true)}}>
                    <View style={styles.ImagePreview}>
                        {imageTaken ? <Image style={styles.image} source={{uri: imageTaken }}/> :
                        <Text style={styles.label}>Choose Image </Text>}
                    </View>
                </TouchableOpacity> :
                <View style={styles.ImagePreview}>
                    {imageTaken ? <Image style={styles.image} source={{uri: imageTaken }}/> :
                    <Text style={styles.label}>Choose Image </Text>}
                </View>
                }
            </View>
            <View style={styles.Illustration}>
                <View style={styles.DistanceValueBox}>
                    <Text style={{color: "orange", fontSize: 25, fontWeight: "600"}}>{distance}</Text>
                </View>
                {props.editMode ?
                <TouchableOpacity style={styles.WidthArrow} onPress={() => {setIndex(2), props.setModalVisible(true)}}>
                       <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/HeightArrow.png")}/>
                </TouchableOpacity>:
                <View style={styles.WidthArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}}  source={require("../images/CartCreations/HeightArrow.png")}/>
                </View>
                }
                <Image source={require("../images/KartoffelVogn/kartoffelvogn_elevator.png")} resizeMode="stretch" style={{width: "15%", height: "15%", position: "absolute", top: "80%", right: "42%"}} />
                <View style={styles.WidthValueBox}>
                    <Text style={{color: "blue", fontSize: 25, fontWeight: "600"}}>{bredde}</Text>
                </View>
                {props.editMode ?
                <TouchableOpacity style={styles.DistanceArrow} onPress={() => {setIndex(3), props.setModalVisible(true)}}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%", transform: [{rotate: "90deg"}]}} source={require("../images/CartCreations/HeightArrow.png")}/>
                </TouchableOpacity> :
                <View style={styles.DistanceArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%", transform: [{rotate: "90deg"}]}}  source={require("../images/CartCreations/HeightArrow.png")}/>
                </View> 
                }
                <View style={styles.LengthValueBox}>
                    <Text style={{color: "green", fontSize: 25, fontWeight: "600"}}>{længde}</Text>
                </View>
                {props.editMode ?
                <TouchableOpacity style={styles.LengthArrow} onPress={() => {setIndex(4), props.setModalVisible(true)}}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%", transform: [{rotate: "90deg"}]}} source={require("../images/CartCreations/HeightArrow.png")}/>
                </TouchableOpacity>:
                <View style={styles.LengthArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%", transform: [{rotate: "90deg"}]}} source={require("../images/CartCreations/HeightArrow.png")}/>
                </View>
                }
                <View style={styles.CartIlustratorField}>
                    <View style={styles.CartImageContainer}>                  
                        <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/FendtTractor.Wagon3.png")} />
                    </View>
                </View>   
            </View>
        </View>

        <Modal isVisible={props.modalVisible} style={{alignItems: "center", }}>
          <View style={styles.modal}>
            <View style={{width: "100%", height: "100%"}}>
                
                <CreateCartPages 
                toogle={props.toogle}
                nameValue={navn}
                setNameValue={setNavn}
                imageValue={imageTaken}
                setImageValue={setImageTaken}
                distanceValue={distance} 
                setDistanceValue={setDistance} 
                setLengthValue={setLængde}
                lengthValue={længde}
                setWidthValue={setBredde}
                widthValue={bredde}
                setModalVisible={props.setModalVisible} 
                index={index}
                setIndex={setIndex}
                saveCart={saveCart}
                editMode={props.editMode}
                />
 
            </View> 
          </View>
          
        </Modal>


        </View>
    );
}

const styles = StyleSheet.create ({

  
    CartSelector: {
        paddingVertical: 10,
        height: "100%",
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
       
    },

    nameBox : {
        position: "absolute",
        top: Dimensions.get("screen").height * 0.02,
        zIndex: 5
    },

    name: {
        fontSize: 22,
        color: Colors.fallOragne
    },

    ImagePreview: {
        width: Dimensions.get("screen").width * 0.25,
        height: Dimensions.get("screen").width * 0.25,
        marginBottom: 0,
        borderRadius: Dimensions.get("screen").width * 0.15,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "grey",
        borderWidth: 2,
        overflow: "hidden"
    },

    imageField : {
        width: "30%",
        height: "100%",
        borderRightColor: "grey",
        borderRightWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    label: {
        color: Colors.fallGreen,
        fontSize: 22,
        fontWeight: "bold"

    },
    image: {
        width: "100%",
        height: "100%",
    },

    Illustration: {
        width: "100%",
        height: "100%"
    },

    WidthArrow: {
        position: "absolute",
        left: "60%",
        top: "77.5%",
        width: "2%",
        height: "20%",
        zIndex: 5
        
    },

    DistanceValueBox: {
        position: "absolute",
        left: "30.5%",
        top: "70%",
    },

    DistanceArrow: {
        position: "absolute",
        left: "30%",
        top: "58%",
        width: "3%",
        height: "22%",
        zIndex: 5
    },

    WidthValueBox: {
        position: "absolute",
        left: "63%",
        top: "83.5%",
    },

    LengthArrow: {
        position: "absolute",
        left: "48%",
        top: "2%",
        width: "3%",
        height: "50%",
        zIndex: 5
    },

    LengthValueBox: {
        position: "absolute",
        left: "49%",
        top: "15%",
    },

    CartIlustratorField: {
        width: "70%",
        height: "100%",
        justifyContent: "center",
    },

    CartImageContainer: {
        marginLeft: "5%",
        width: "85%",
        height: "85%"
    },

    modal: {
        height: Dimensions.get("screen").height * 0.3,
        width: Dimensions.get("screen").width * 0.6,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
      },
      modalText: {
        fontSize: 20,
        color: "grey"
      }

});

export default CartSelector;