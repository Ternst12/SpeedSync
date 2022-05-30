import { View, Text, StyleSheet, Dimensions, Image, Alert, TouchableOpacity } from "react-native"
import { Dispatch } from "react"
import Colors from "../constants/Colors"
import * as CartsActions from "../store/actions/CartsActions"

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)


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
            <TouchableOpacity onPress={setCartToEdit( itemData.item.id, 
                item.name, 
                item.imageUri, 
                item.distance, 
                item.length, 
                item.width)}>
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
  }
})

export default CarouselCardItem