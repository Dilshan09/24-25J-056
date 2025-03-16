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
    ImageBackground,
    TouchableOpacity,
    TextInput,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { auth } from '../firebase/firebase-config';
  import {getAuth, signOut  } from 'firebase/auth';
  import { Picker } from '@react-native-picker/picker';
  import DateTimePicker from "@react-native-community/datetimepicker";
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { C3 } from "./ApiData";
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const orchid_types = ["Dendrobium", "Vanda", "Phalaenopsis"];

export default function EmergencyWaterForm() {

    const [selectedBehavior, setSelectedBehavior] = useState('');
    // const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
  



    const [selectedTest, setSelectedTest] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const test_mange = ["Test 1", "Test 2", "Test 3", "Test 4"];

    const [selectedFlower, setSelectedFlower] = useState('green orchid');
    const [amount, setAmount] = useState();
    const navigation = useNavigation();

    const handleStart = async () => {
      // Simulate sending data to the backend
      console.log('Selected Flower:', selectedFlower);
      console.log('Amount:', amount);
      // You can replace this with an actual API call
      if (!selectedFlower || !amount) {
        alert("Please select a flower and enter the water amount!");
        return;
      }
  
      try {
        setLoading(true);
  
        const response = await fetch(`${C3}/emergency-water`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flower: selectedFlower,
            amount: amount,
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert(`Success: ${result.message}`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send data to backend!");
      } finally {
        setLoading(false);
      }
    };

    const Header = () => {
      return (
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} 
          onPress={() => navigation.navigate('Watering')}
          >
            <Image source={require("../assets/images/back.png")} style={styles.backImage} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
                  <Text style={styles.headerText}>Emergency Watering Schedule...</Text>
        <Image
          source={require("../assets/images/alert.png")}
          style={styles.headerIcon}
        />
         </View>
        </View>
      );
    };


    const Card = ({ children }) => {
      return <View style={styles.cardContainer}>{children}</View>;
    };

    // const handleBehaviorChange = (itemValue) => {
    //     console.log("Behavoiur selected",itemValue);
    //     setSelectedBehavior(itemValue);

    //   };


    // const handleTestChange = (itemValue) => {
    //     console.log("Test selected",itemValue);
    //     setSelectedTest(itemValue);
    //   };


      const sendDataToBackend = async () => {
        if (!selectedFlower || !amount) {
          alert("Please select a flower and enter the water amount!");
          return;
        }
    
        try {
          setLoading(true);
    
          const response = await fetch(`${C3}/emergency-water`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              flower: selectedFlower,
              amount: amount,
            }),
          });
    
          const result = await response.json();
    
          if (response.ok) {
            alert(`Success: ${result.message}`);
          } else {
            alert(`Error: ${result.error}`);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to send data to backend!");
        } finally {
          setLoading(false);
        }
      };


  return (

    <View>
       
        <ScrollView
         contentContainerStyle={styles.scrollContainer}
          >
          <Header />
          <View style={styles.cardContainer}>
          <Image
                source={require("../assets/images/orchWall.jpg")}
                style={styles.cardImage}
              />
            <Picker
                selectedValue={selectedFlower}
                onValueChange={(itemValue) => setSelectedFlower(itemValue)}
                style={styles.picker}
              >
                  <Picker.Item label="Dendrobium" value="Dendrobium" />
                  <Picker.Item label="Vanda" value="Vanda" />
                  <Picker.Item label="Phalaenopsis" value="Phalaenopsis" />
              </Picker>
              <View style={styles.greenCard}>
                <Text style={styles.greenCardText}>
                  Enter water amount in milliliters and click start to watering.
                </Text>
              </View>
              {/* <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              /> */}

                <View style={styles.datePickerContainer}>
                                <Text style={styles.label}>Amount:</Text>
                              
                                <TextInput
                                    style={styles.input}
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                    // editable={!isUploading}
                                  />
                            </View> 


              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
          
            {/* <Text>Card Content</Text> */}
          </View>
        </ScrollView>

    </View>


  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dfe6e3',
    // borderWidth:2,
  },
  container: {
    flex: 1,
    flexGrow: 1,
    // borderWidth:2,
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
    width: 100,
    height: 73,
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
  cardContainer: {
    backgroundColor: '#fff',
    padding: 26,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 26,
    // borderWidth:3
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  greenCard: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  greenCardText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#096c3a',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    width:"60%",
    marginHorizontal:"20%"
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

datePickerContainer: {
  margin : "auto", 
  width: "80%",
  // borderWidth:2,
  marginBottom: 20,
  flexDirection :"row",        
},
label: {
  // fontSize: 16,
  // marginBottom: 5,
  color: "#333",
  // borderWidth:1,
  width: "30%", 
  marginTop:7,
  
},
input: {
  height: 40,
  width:"60%",
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  paddingHorizontal: 10,
},
backImage: {
  width: 30,
  height: 30,
  borderRadius: 10,
  marginRight: 10,
},
});


