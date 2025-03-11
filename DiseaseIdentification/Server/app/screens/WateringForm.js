import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    Modal,
    Button,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    ImageBackground,
    TextInput,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { auth } from '../firebase/firebase-config';
  import {getAuth, signOut  } from 'firebase/auth';
  import { Picker } from '@react-native-picker/picker';
  import DateTimePicker from "@react-native-community/datetimepicker";
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  import { C3 } from "./ApiData";
  
  const orchid_types = ["Dendrobium", "Vanda", "Phalaenopsis"];

  const test_mange = [
    'Full Blood Count (FBC) (Optional)',
    'Full Blood Count (FBC) (Optional)',
    'Full Blood Count (FBC) (Optional)',
    'Full Blood Count (FBC) (Optional)',
    'Full Blood Count (FBC) (Optional)',
  ];

export default function WateringForm() {
    const [selectedBehavior, setSelectedBehavior] = useState('');
    const [selectedTest, setSelectedTest] = useState('');
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
  
    const test_mange = ["Test 1", "Test 2", "Test 3", "Test 4"];

    const handleSubmit = async () => {
      if (!selectedBehavior) {
        alert("Please select a flower");
        return;
      }
  
      const payload = {
        flower: selectedBehavior,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };
  
      try {
        const response = await fetch(`${C3}/schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert("Schedule submitted successfully!");
          console.log("Response:", result);
        } else {
          alert("Failed to submit schedule");
          console.error("Error:", result);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the schedule");
      }
    };

    const handleBehaviorChange = (itemValue) => {
        console.log("Behavoiur selected",itemValue);
        setSelectedBehavior(itemValue);

      };

    const handleTestChange = (itemValue) => {
        console.log("Test selected",itemValue);
        setSelectedTest(itemValue);
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
                    <Text style={styles.headerText}>Treat orchids with grow lights...</Text>
          <Image
            source={require("../assets/images/watering-can.png")}
            style={styles.headerIcon}
          />
           </View>
          </View>
        );
      };

  return (
    <View>
              {/* Header Section */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>Watering form</Text>
        <Text style={styles.date}>10th Dec 2024</Text>
      </View> */}
      <Header/>

      <View style={styles.container}>

      <View  style={styles.card}>            
            <View style={styles.cardContent}>
            <Image source={require("../assets/images/orchWall.jpg")} style={styles.cardImage} />
             

              <View style={styles.flowerContainer}>
              {/* <Text style={styles.label}>Flower:</Text> */}
              <Picker style={styles.dropdown}
                      selectedValue={selectedBehavior}
                      onValueChange={handleBehaviorChange}
                      mode="dropdown" >
                <Picker.Item style={{fontSize: 10}} label="Select a Flower" value="" />
                                  {orchid_types.map((behavior, index) => (
                                     <Picker.Item style={{fontSize: 10}} key={index} label={behavior} value={behavior} /> ))}
                            
               </Picker>  
               </View>     


                                {/* Start Date Picker */}
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>Start Date:</Text>
                        <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowStartPicker(true)}
                        >
                        <Text style={styles.dateText}>
                            {startDate.toDateString()}
                        </Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                            setShowStartPicker(false);
                            if (selectedDate) {
                                setStartDate(selectedDate);
                            }
                            }}
                        />
                        )}
                    </View> 

                    {/* End Date Picker */}
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>End Date:</Text>
                        <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowEndPicker(true)}
                        >
                        <Text style={styles.dateText}>
                            {endDate.toDateString()}
                        </Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                            setShowEndPicker(false);
                            if (selectedDate) {
                                setEndDate(selectedDate);
                            }
                            }}
                        />
                        )}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Scheduls</Text>
              </TouchableOpacity>

            </View>

           
            
    </View>

      </View>


    </View>
  )
}

const styles = StyleSheet.create({
    container: {
    //   flex: 1,
    //   backgroundColor: "#F5F5F5",
      padding: 20,
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
    title: {
      fontSize: 24,
      top:100,
      marginRight:"60%",
      fontWeight: "bold",
      color: "#F5F5F5",
    },
    date: {
        top:100,
        marginRight:"58%",
      fontSize: 16,
      color: "#FFFFFF",
    },
    careSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
    },
    careText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#2E7D32",
    },
    careImage: {
      width: 50,
      height: 50,
    },
    button: {
      backgroundColor: "#2E7D32",
      paddingVertical: 10,
      borderRadius:20,
      marginLeft:"25%",
      width:"50%",
      alignItems: "center",
      marginBottom: 20,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    card: {
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    cardImage: {
      width: "80%",
      height: "40%",
      alignSelf :"center",
      borderRadius: 10,
      marginRight: 10,
    },
    cardContent: {
      flex: 1,
      padding:7,
      justifyContent: "center",
    },
    subCardContent: {
      flexDirection: "row",

      alignItems: "center",
            // borderWidth:2,
      // justifyContent: "center",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2E7D32",
    },
    cardLink: {
      fontSize: 14,
      color: "#1E88E5",
      fontWeight: "bold",
    },
    cardDescription: {
      flex: 1, // Allow the Text to take remaining space
      fontSize: 14,
      color: "#555",
      marginTop: 5,
      flexWrap: "wrap", // Ensure text wraps within container
    },
    datePickerContainer: {
        width: "99%",
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
        
      },
      dateButton: {
        // padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        backgroundColor: "#fff",
        alignItems: "center",
        // borderWidth:2,
        width: "50%"
      },
      flowerContainer: {
        // width: "99%",
        // borderWidth:2,
        marginBottom: 20,
        position:"relative",
        flexDirection :"row",
        
      },
      dropdown: {
        position:"relative",

        borderColor: "#ddd",
        // borderRadius: 5,
        backgroundColor: "#fff",
        // alignItems: "center",
        borderWidth:2,
        width: "70%",
        alignSelf: 'center', // Centers the item horizontally within its parent
        marginHorizontal: 'auto'
      },
      dateText: {
        fontSize: 16,
        color: "#333",
      },
      backImage: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 10,
      },
  });
