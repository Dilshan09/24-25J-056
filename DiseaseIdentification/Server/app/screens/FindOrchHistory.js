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
    FlatList,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { auth } from '../firebase/firebase-config';
  import {getAuth, signOut  } from 'firebase/auth';
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FindOrchHistory = ({route}) => {
    const [daysData, setDaysData] = useState([]);
    const [avgResultsData, setAvgResultData] = useState('');
    const {selectedItem} = route.params;
    const navigation = useNavigation();
    // const { clz, confidence, classs } = selectedItem.results;

    console.log("SCSxxx",selectedItem);
    // setAvgResultData(selectedItem.avgResults)
    // const dataArray = selectedItem.results.control;
    useEffect(() => {
        setAvgResultData(selectedItem.avgResults),
        setDaysData(selectedItem.days)
    
      }, []);



    
      const Header = () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} 
            onPress={() => navigation.navigate('FindHome')}
            >
               <Image source={require("../assets/images/back.png")} style={styles.backImage} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
                    <Text style={styles.headerText}>Treat orchids with grow lights...</Text>
          <Image
            source={require("../assets/images/eco-light.png")}
            style={styles.headerIcon}
          />
           </View>
          </View>
        );
      };

      const HeadCard = () => {
        return (
          <View style={styles.headCardContainer}>
            <View style={styles.headCardContent}>

            {/* <TouchableOpacity style={styles.PastRecordbutton} onPress={() => navigation.navigate('WateringHistoryList')}>
                <Text style={styles.buttonText}>Find New +</Text>
              </TouchableOpacity> */}

           </View>
          </View>
        );
      };

      const renderItem = ({ item }) => (
        <DayCard
          day={item.day}
          Humidity2={item.Humidity2}
          Humidity1={item.Humidity1}

          Temp1={item.Temp1}
          Temp2={item.Temp2}

          Light1={item.Light1}
          Light2={item.Light2}
          date={item.date}
          description={item.description}
          onFindNew={() => handleFindNew(item.day)}
        />
      );

      const DayCard = ({ day, date, Humidity1, Humidity2, Temp1, Temp2, Light1, Light2, onFindNew }) => (
        <View style={styles.DaycardContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <View style={styles.dayText}> 
          
          <Text style={styles.label}>Date:</Text>        
             <TextInput style={styles.input} placeholder="Amount"  keyboardType="numeric"  value={date} />
          </View>

          <View style={styles.ValueBox}>
          <Text style={styles.Numberlabel}>01         02</Text>   
          <View style={styles.ValConatiner}> 
            <Text style={styles.Humiditylabel}>Humidity :</Text>        
              <TextInput style={styles.Humidityinput} placeholder="--"   value={Humidity1} />
              <TextInput style={styles.Humidityinput} placeholder="--"   value={Humidity2} />
          </View>
          <View style={styles.ValConatiner}> 
            <Text style={styles.Templabel}>Temp :</Text>        
              <TextInput style={styles.Humidityinput} placeholder="--"   value={Temp1} />
              <TextInput style={styles.Humidityinput} placeholder="--"   value={Temp2} />
          </View>
          <View style={styles.ValConatiner}> 
            <Text style={styles.Lightlabel}>Light :</Text>        
              <TextInput style={styles.Humidityinput} placeholder="--"   value={Light1} />
              <TextInput style={styles.Humidityinput} placeholder="--"   value={Light2} />
          </View>
          </View>
        </View>
      );

      const Footer = ({avgResultsData,saveToFirebase }) => (

        
        <View style={styles.footerContainer}>
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>Additional Information</Text>
            <View style={styles.footerDataContainer}>           
              <Text style={styles.footerLabel}>Average Humidity :</Text>
              <Text style={styles.footerResult}>  {avgResultsData.average_humidity}</Text>
          </View>

          <View style={styles.footerDataContainer}>           
              <Text style={styles.footerLabel}>Average Temp.      :</Text>
              <Text style={styles.footerResult}>  {avgResultsData.average_Temp}</Text>
          </View>

          <View style={styles.footerDataContainer}>           
              <Text style={styles.footerLabel}>Average Light        :</Text>
              <Text style={styles.footerResult}>  {avgResultsData.average_Light}</Text>
          </View>

          <Text style={styles.recommendLabel}>We recommend   </Text>
          <Text style={styles.recommendResult}>{avgResultsData.recommend}</Text>

          </View>
        </View>
      );
  
  return (
    <View>
    <FlatList
          ListHeaderComponent={
            <>
              <Header />
              <HeadCard />
            </>
          }
      data={daysData}
      renderItem={renderItem}
      keyExtractor={(item) => item.day}
      contentContainerStyle={styles.listContainer}
      ListFooterComponent={
      <Footer  avgResultsData={avgResultsData} />
    }
    />
</View>
  )
}

export default FindOrchHistory

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
        marginBottom: -10,
        borderBottomEndRadius:40,
        borderBottomStartRadius:40,
        height: SCREEN_HEIGHT * 0.25, // 30% of the screen height
        paddingHorizontal: 16,
        paddingTop: 16,
        justifyContent:"flex-end",
        zIndex: 5,
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
          fontSize: 16,
          fontWeight: "bold",
        },
  
  
  
        listContainer: {
          // padding: 16,
        },
        DaycardContainer: {
          // borderWidth:2,
          borderColor:"red",
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          width:"86%",
          marginLeft:"7%",
                  // paddingHorizontal: 10,
        },
        label: {
          // fontSize: 16,
          // marginBottom: 5,
          color: "#333",
          // borderWidth:1,
          width: "14%", 
          // marginTop:7,
        },
        input: {
          padding: 0, 
          height: "100%",
          width:"30%",
          backgroundColor: '#e3e3e3',
          // borderWidth: 1,
          borderRadius:5,
          // marginBottom: 10,
          // paddingHorizontal: 10,
        },
        dayText: {
          // borderWidth:2,
          borderColor:"green",
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 4,
          flexDirection: 'row',
        },
        dateText: {
          // borderWidth:2,
          borderColor:"green",
          fontSize: 16,
          color: '#666',
          marginBottom: 8,
        },
        
        ValueBox: {        
          padding:6,
          // borderWidth:2,
          // flexGrow: 1,
          // borderColor:"green",
          // fontSize: 20,
          // width:"99%",
          // fontWeight: 'bold',
          // marginBottom: 4,
          alignItems: 'center',
          // flexDirection: 'row',
          display: "flex",
          // marginHorizontal:"20%",
          justifyContent: "space-between",
          // justifyContent: 'space-between',
        },
  
        ValConatiner: {        
          // borderWidth:2,
          // borderColor:"green",
          fontSize: 20,
          width:"60%",
          fontWeight: 'bold',
          marginBottom: 16,
          // alignItems: 'center',
          flexDirection: 'row',
          display: "flex",
          // marginHorizontal:"20%",
          justifyContent: "space-between",
          // justifyContent: 'space-between',
        },
        Humiditylabel: {
          // fontSize: 16,
          // marginBottom: 5,
          color: "#333",
          
          // borderWidth:1,
          // width: "14%", 
          // marginTop:7,
        },
        Numberlabel: {
          fontWeight: 'bold',
          marginLeft:"29%",
          marginBottom: 11,
          // fontSize: 16,
          // marginBottom: 5,
          color: "#333",
          // borderWidth:1,
          // width: "30%", 
          // marginTop:7,
        },
        Lightlabel: {
          color: "#333",
          // borderWidth:1,
          width: "39%", 
        },
        Templabel: {
          color: "#333",
          // borderWidth:1,
          width: "39%", 
        },
        Humidityinput: {
          padding: 0, 
          borderRadius:4,
          // height: "100%",
          // width:"30%",
          backgroundColor: '#e3e3e3',
          // borderWidth: 1,
          // marginBottom: 10,
          paddingHorizontal: 10,
        },
  
        descriptionText: {
          fontSize: 14,
          color: '#333',
          marginBottom: 12,
        },
        button: {
          backgroundColor: '#007bff',
          paddingVertical: 10,
          borderRadius: 4,
          alignItems: 'center',
        },
        // FooterbuttonText: {
        //   color: '#fff',
        //   fontSize: 16,
        //   fontWeight: 'bold',
        // },
        ResultcardContainer: {
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
  
        footerContainer: {
          padding: 16,
          alignItems: 'center',
          // borderWidth:1,
        },
        footerCard: {
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          alignItems: 'center',
          width:"90%"
          
        },
        footerText: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
          // borderWidth:2,
        },
        footerButton: {
          backgroundColor: "#21130d",
          borderRadius: 30,
          paddingVertical: 5,
          alignItems: "center",
          // marginLeft:70,
          width:"50%",
          marginTop: 30,
        },
        footerDataContainer: {
          // borderWidth:2,
          borderColor:"green",
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 4,
          flexDirection: 'row',
          width:"80%",
          // justifyContent: 'space-between',
        },
        footerLabel: {
          // fontSize: 16,
          // marginBottom: 5,
          color: "#333",
          // borderWidth:1,
          // width: "14%", 
          // marginTop:7,
        },
        footerResult: {
          // fontSize: 16,
          // marginBottom: 5,
          color: "#333",
          // borderWidth:1,
          // width: "14%", 
          // marginTop:7,
        },
        recommendLabel: {
          color: "#333",
          // width:"100%",
          marginTop:20,
          fontWeight:"bold",
          // borderWidth:1,
        },
        recommendResult: {
          color: "#14b464",
          fontWeight:"bold",
          // borderWidth:1,
          marginTop:5,
          fontSize: 20,
        },
        backImage: {
          width: 30,
          height: 30,
          borderRadius: 10,
          marginRight: 10,
        },
  
  
  });

  
  