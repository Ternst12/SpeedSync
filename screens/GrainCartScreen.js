import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CartSelector from '../components/CartsSelector';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import CartItem from '../components/CartItem';
import Carousel from 'react-native-snap-carousel';

import * as CartsActions from "../store/actions/CartsActions"
import Colors from '../constants/Colors';

var bs = React.createRef();
var fall = new Animated.Value(1);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)


const GrainCartScreen = props => {

  const carts = useSelector(state => state.carts.carts)
  const [nameEdit, setNameEdit] = useState("Wagen Name");
  const [selectedImage, setSelectedImage] = useState("");
  const [distanceEdit, setDistanceEdit] = useState("");
  const [widthEdit, setWidthEdit] = useState("");
  const [lenghtEdit, setLengthEdit] = useState("");
  const [refreshing, setRefreshing] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [createCartModal, setCreateCartModal] = useState(false)
  const [showOwnCarts, setShowOwnCarts] = useState(false)

  const isCarousel = React.useRef(null)

  const CarouselCardItem = ({ item, index}) => {


    return (
      <View style={styles.container} key={index}>
          <View style={{height: "15%", borderRadius: 40, backgroundColor: Colors.fallOragne, alignSelf: "center", justifyContent: "center", paddingHorizontal: 20, maxHeight: 80}}>
              <Text style={styles.title}>{item.name}</Text>
          </View>
          <View style={{height: "12%", flexDirection: "row", justifyContent: "center", marginTop: 20, maxHeight: 50}}>
              <View style={styles.valueBox}>
                  <Text style={styles.values}>D: {item.distance}</Text>
              </View>
              <View style={styles.valueBox}>
                  <Text style={styles.values}>L: {item.length}</Text>
              </View>
              <View style={styles.valueBox}>
                  <Text style={styles.values}>W: {item.width}</Text>
              </View>
          </View>
          <View style={{width: "100%", height: "30%", justifyContent: "center", alignItems: "center", borderRadius: 55}}>
              <TouchableOpacity onPress={() => {setCartToEdit( item.id, 
                  item.name, 
                  item.imageUri, 
                  item.distance, 
                  item.length, 
                  item.width)}}>
                  <Image
                      source={{uri: item.imageUri}}
                      style={styles.image}
                      resizeMode="stretch"
                  />
              </TouchableOpacity>
          </View>
      </View>
    )
  }


  const onRefresh = React.useCallback(() => {
    dispatch(CartsActions.loadCarts())
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  

  useEffect(() =>{
    dispatch(CartsActions.loadCarts())
  }, [dispatch]);

  const setCartToEdit = (id, name, imageUri, distance, length, width) => {
    console.log("that was a long press");      
    Alert.alert(
              "You have choosen a Cart",
              "how will you proceed?",
              [
                {
                  text: "Start the operation",
                  onPress: () => {
                    dispatch(CartsActions.SelectCart(id, name, imageUri, distance, width, length))
                    props.navigation.navigate("HomeScreen")
                    setEditMode(false)
                    setNameEdit("")
                    setDistanceEdit("")
                    setLengthEdit("")
                    setWidthEdit("")
                    setSelectedImage("")
                  }
                },
                {
                  text: "Edit",
                  onPress: () => {
                    setSelectedImage(imageUri); 
                    setNameEdit(name); 
                    setDistanceEdit(distance);
                    setWidthEdit(width);
                    setLengthEdit(length);
                    setEditMode(true)
                  },
                  style: "OK"
                },
                { text: "Delete", onPress: () => dispatch(CartsActions.DeleteCart(id))}
              ]
            );
    }


  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>You havent created a cart yet</Text>
        <Text style={styles.panelSubtitle}>{"Wir brauchen ein par informationen über denn Wagen, denn Sie benutzen möchten.\nPlease have the dimensions of the trolley's height, length and width ready."}</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Why do you need the information ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {bs.current.snapTo(1); setCreateCartModal(true)}}>
        <Text style={styles.panelButtonTitle}>Create your cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {bs.current.snapTo(1); props.navigation.navigate("Home")}}>
        <Text style={styles.panelButtonTitle}>Do it Later</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const dispatch = useDispatch();

  const image = require("../images/CartCreations/BarnInside.png")

  return (

    <View style={{flex: 1}}>
      <BottomSheet
        ref={bs}
        snapPoints={[630, -5]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 0,
          flex: 1, 
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
        <View style={styles.form}>
          <View style={{height: "100%", width: "98%", justifyContent: "center"}}>
            <CartSelector 
            editMode={editMode}
            cartName={nameEdit}
            cartDistance={distanceEdit}
            cartWidth={widthEdit}
            cartLength={lenghtEdit}
            modalVisible={createCartModal} 
            setModalVisible={setCreateCartModal} 
            image={selectedImage} 
            navigation={props.navigation} 
            toogle={() => bs.current.snapTo(0)}/>
          </View>
          
        </View>
       {showOwnCarts ?  
       <View style={{width: "100%", height: "55%"}}>
        <View style={styles.refreshMessage}>
            <Text style={styles.refreshMessageText}>Bei fehlenden Daten einfach die Liste nach unten ziehen</Text>
          </View>
          <FlatList 
          data={carts} 
          extraData={carts}
          keyExtractor={item => item.id}
          numColumns={1}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={itemData => (
            <CartItem 
            onSelect={() => {
              setCartToEdit(
                itemData.item.id, 
                itemData.item.name, 
                itemData.item.imageUri, 
                itemData.item.distance, 
                itemData.item.length, 
                itemData.item.width
                )
            }}
            name={itemData.item.name} 
            distance={itemData.item.distance}
            length={itemData.item.length}
            width={itemData.item.width}
            image={itemData.item.imageUri} 
            Delete={() => dispatch(CartsActions.DeleteCart(itemData.item.id))}
          
          />
          )}    
          />
        </View> : 
        <View style={{width: "100%", height: "60%",}}>
          <ImageBackground source={image} resizeMode="stretch" style={{width:"100%", height:"100%", opacity: 0.7}}>
          </ImageBackground>
          <View style={{width: "100%", position: "absolute", top: "20%", alignItems: "center"}}>
            <Carousel
              inactiveSlideOpacity={0.0}
              inactiveSlideScale={0}
              layout="default"
              layoutCardOffset={9}
              ref={isCarousel}
              data={carts}
              renderItem={CarouselCardItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              inactiveSlideShift={0}
              useScrollView={true}
             
            />
          </View>
      </View>
      }
      </Animated.View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    height: 700,
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH * 0.8,
    height: "100%",
    marginTop: 30,
    borderRadius: 10
  },
  title: {
    color: Colors.fallWhite,
    fontSize: 28,
    fontWeight: "bold",

  },
  valueBox: {
    height: "100%", 
    borderRadius: 40, 
    backgroundColor: Colors.fallGreen, 
    alignSelf: "flex-start", 
    justifyContent: "center", 
    paddingHorizontal: 20,
    marginHorizontal: 60
   
  },
  values: {
      fontSize: 20,
      color: Colors.fallWhite
  },

  form: {
    alignItems: "center",
    height: "40%",
    width: "100%",
    backgroundColor: "white",
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  },

  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '90%',
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#333333',
    shadowOffset: {width: -0, height: 6},
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 30,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -0.5, height: -0.5},
    shadowRadius: 0,
    shadowOpacity: 0.1,
    elevation: 30,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "90%",
    marginHorizontal: Dimensions.get("screen").width * 0.05
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 18,
    textAlign: "center",
    color: 'gray',
    height: 60,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  refreshMessage: {
    height: "5%",
    justifyContent: "center",
    alignItems: "center"
  },
  refreshMessageText: {
    color: Colors.fallOragne,
    fontSize: 18
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
});

export default GrainCartScreen;
