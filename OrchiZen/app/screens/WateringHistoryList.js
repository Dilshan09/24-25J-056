import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Button,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList ,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth,db } from '../firebase/firebase-config'; 
import { C3 } from "./ApiData";
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WateringHistoryList() {

  const [daysData, setDaysData] = useState([]);
  const [avgResultsData, setAvgResultData] = useState('');
    const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [uid,setUid] = useState();
  const [loading, setLoading] = useState(true);
  const auths = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("AUTH USER", authUser.uid);
      setUid(authUser.uid)
      setUser(authUser);
    });
  
    fetch(`${C3}/api/wateringHistory`)
      .then(response => response.json())
      .then(data => {
        setDaysData(data.wateringHistory);
        setLoading(true);
        setAvgResultData(data.avgResults);
      })
      .catch(error => console.error('Error fetching data:', error));
      console.log("data log", daysData);

  }, []);


  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} 
        onPress={() => navigation.navigate('Home')}
        >
           <Image source={require("../assets/images/back.png")} style={styles.backImage} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
                <Text style={styles.headerText}>Watering History</Text>
      <Image
        source={require("../assets/images/document.png")}
        style={styles.headerIcon}
      />
       </View>
      </View>
    );
  };


  return (
    <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}  >
        <Header />

        <ScrollView contentContainerStyle={styles.container}>
      {
            
            daysData.map((item) => (
              <View key={item.flowerName} style={styles.recordContainer}>
                {/* <Text style={styles.recordText}>
                  {new Date(item.createdDate).toISOString().split('T')[0].replace(/-/g, '.')}
                </Text> */}
                

                <View style={styles.viewButton} >
                <Text style={styles.recordText1}>Time              :</Text>
                <Text style={styles.recordText2}>{item.timestamp}</Text>
                </View>
                <View style={styles.viewButton} > 
                <Text style={styles.recordText1}>Flower           :</Text>
                <Text style={styles.recordText2}>{item.flowerName}</Text>
                </View>
                <View style={styles.viewButton} >
                <Text style={styles.recordText1}>Humidity       :</Text>
                <Text style={styles.recordText2}>{item.humidity}</Text>
                </View>
                <View style={styles.viewButton} >
                <Text style={styles.recordText1}>Tempreture  :</Text>
                <Text style={styles.recordText2}>{item.temperature}</Text>
                </View>
                <View style={styles.viewButton} >
                <Text style={styles.recordText1}>Light              :</Text>
                <Text style={styles.recordText2}>{item.light}</Text>
                </View>



   
              </View>
      ))}
    </ScrollView>

        </ScrollView>



    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dfe6e3',
    borderWidth:2,
  },
  container: {
    // flex: 1,
    // flexGrow: 1,
    // borderWidth:2,
    alignItems: 'center',
  },
  scrollContainer: {
    // flexGrow: 1,
    // justifyContent: 'space-between',
    // borderWidth:2,
    // height: SCREEN_HEIGHT * 1,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#096c3a',
    // borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomEndRadius:20,
    borderBottomStartRadius:20,
    height: SCREEN_HEIGHT * 0.25, // 30% of the screen height
    // paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent:"flex-end",
    // borderWidth:1,

  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // borderWidth:1,
    width:"93%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    // borderWidth:1,
  },
  headerIcon: {
    width: 63,
    height: 63,
    // borderWidth:1,
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as needed
    left: 29, // Adjust as needed
    zIndex: 10,
    // borderWidth:1,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  headCardContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      padding: 16,
      marginBottom:20,
      zIndex: 4
      
    },
  noDataIcon: {
    width: 120,
    height: 120,
    marginLeft:"3%"
  },
  PastRecordbutton: {
      backgroundColor: "#21130d",
      borderRadius: 30,
      paddingVertical: 5,
      alignItems: "center",
      // marginLeft:70,
      width:"40%",
      marginTop: 30,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
    },
    savedItemsContainer: {
      padding: 16,
    },
    itemCard: {
      padding: 16,
      marginBottom: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    itemText: {
      fontSize: 14,
      color: "#333",
      marginBottom: 4,
    },
    noDataText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#666",
    },


    
    recordContainer: {
      backgroundColor: "#ffffff",
      padding: 20,
      marginBottom: 8,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      width:"90%",
      // borderWidth:5,
    },
    recordText: {
      fontSize: 16,
      color: "#333333",
      marginBottom: 4,
      fontWeight: "bold",
      width:"auto"
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    recordText1: {
      fontSize: 16,
      fontWeight:"bold",
      color: "#333333",
      marginBottom: 4,
      // borderWidth:2,
      width:110
    },
    recordText2: {
      fontSize: 16,
      color: "#333333",
      marginBottom: 4,
      // borderWidth:2,
      width:230
    },
    
    viewButton: {
      // backgroundColor: "#096c3a",
      flexDirection: 'row',
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
      // borderWidth:1,
    },
    resultbuttonText: {
      // color: "#ffffff",
      fontSize: 14,
      // borderWidth:1,
      width:"90"
      // fontWeight: "bold",
    },
    backImage: {
      width: 30,
      height: 30,
      borderRadius: 10,
      marginRight: 10,
    },

});