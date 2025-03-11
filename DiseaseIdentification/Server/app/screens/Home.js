import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    Modal,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    TextInput,
  } from "react-native";
  // import React, { useState, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { auth } from '../firebase/firebase-config';
  import {getAuth, signOut  } from 'firebase/auth';
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  export default function Home() {
    const navigation = useNavigation();

    const auths = getAuth();
    
    // const [showDropdown, setShowDropdown] = useState(false);
  
    // const toggleDropdown = () => {
    //   setShowDropdown(!showDropdown);
    // };
  
    const handleLogoutClick = () => {
      // Handle the logout functionality
      // Add your logout logic here
    };

    const Header = () => {
      const today = new Date();

      // Format the date
      const day = today.getDate();
      const month = today.toLocaleString("default", { month: "short" });
      const year = today.getFullYear();
    
      // Add suffix to the day
      const getDayWithSuffix = (day) => {
        if (day % 10 === 1 && day !== 11) return `${day}st`;
        if (day % 10 === 2 && day !== 12) return `${day}nd`;
        if (day % 10 === 3 && day !== 13) return `${day}rd`;
        return `${day}th`;
      };
      const formattedDate = `${getDayWithSuffix(day)} ${month} ${year}`;
      return (
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} 
          onPress={() => navigation.navigate('Watering')}
          >
            {/* <Text style={styles.backText}>{"< Back"}</Text> */}
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.subHeaderContent} >
                <Text style={styles.headerText}>OrchiZen</Text>
                 <Text style={styles.backText}>{formattedDate}</Text>
            </View>            
              
             <Image  source={require("../assets/images/homeLogo.png")}   style={styles.headerIcon} />
         </View>
          
        </View>
      );
    };

    const HeadCard = () => {
      return (
        <View style={styles.headCardContainer}>
            <View style={styles.cardsContainer}>

            <View style={styles.greenCardContainer}>
                <View style={styles.greenCardContent}>
                <Text style={styles.greenCardHeaderText}>Best Orchids Care ...</Text>   
                <Image source={require("../assets/images/pot.png")}  style={styles.greenCardHeaderIcon} />             
            </View>           
            </View>       

            </View>
        </View>
      );
    };

      
    return (
      <View>
      <ScrollView >

      
      {/* Header Section */}
      {/* <View style={styles.header}>
        
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.title}>OrchiZenx</Text>
              <Text style={styles.date}>10th Dec 2024</Text>
            </View>
            <Image
      source={require("../assets/images/homeLogo.png")} // Replace with your image path
      style={styles.headerImage}
    />
          </View>
      </View> */}
      <Header/>
      <HeadCard />
      <View style={styles.container}>


      {/* Explore Orchid Types Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Explore Orchid Types</Text>
      </TouchableOpacity>

      {/* Orchid Types List */}
      <ScrollView>
        {orchidData.map((orchid, index) => (
          <View key={index} style={styles.card}>
            <Image source={orchid.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{orchid.name}</Text>
              <Text style={styles.cardDescription}>{orchid.description}</Text>
              <TouchableOpacity>
                <Text style={styles.cardLink}>See More &gt;&gt;</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
    </ScrollView>
    </View>
      
    )
  }
  const orchidData = [
    {
      name: "Dendrobium",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    //   image: require("./assets/dendrobium.png"), // Replace with your orchid images
    },
    {
      name: "Vanda",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    //   image: require("./assets/vanda.png"), // Replace with your orchid images
    },
    {
      name: "Phalaenopsis",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    //   image: require("./assets/phalaenopsis.png"), // Replace with your orchid images
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
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
      zIndex: 5,
  
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // borderWidth:1,
      width:"93%",
      height:"45%",
    },
    subHeaderContent: {
      // borderWidth:1,
    },
    headerText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      flex: 1,
      // borderWidth:1,
    },
    headerIcon: {
      width: "60",
      height: "60",
      // borderWidth:1
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
      fontWeight: '400',
      // marginLeft:20,
      // alignSelf :"flex-start",
      // borderWidth:1,
    },
    headCardContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      padding: 16,
      marginBottom:30,
      zIndex: 4,
      marginTop:-30,
      
    },
    cardsContainer: {
      padding: 9,

      // borderRadius: 8,
      alignItems: 'center',
      marginBottom: 14,
      marginTop:14,

      // height: SCREEN_HEIGHT * 0.25, // 30% of the screen height
      // paddingHorizontal: 16,
      // paddingTop: 16,
      // justifyContent:"flex-end",
      // borderWidth:3,
  
    },

  greenCardContainer: {
      padding: 16,
      backgroundColor: '#096c3a',
      // borderRadius: 8,
      alignItems: 'center',
      // marginBottom: 16,
      borderRadius: 20,
      width:"100%",
      // borderBottomEndRadius:40,
      // borderBottomStartRadius:40,
      // height: SCREEN_HEIGHT * 0.1, // 30% of the screen height
      paddingHorizontal: 27,
      // paddingTop: 16,
      // justifyContent:"flex-end",
      // borderWidth:3,
  
    },
    greenCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      // borderWidth:3,
    },
    greenCardHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      padding:3,
      // borderWidth:1,
      width:"89%"
      
    },
    greenCardHeaderIcon: {
      width: 55,
      height: 55,
      // marginHorizontal:5,
      // borderWidth:1,
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
      borderRadius: 10,
      paddingVertical: 6,
      alignItems: "center",
      marginBottom: 20,
      marginTop:-56,
      zIndex: 4,
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
      width: 70,
      height: 70,
      borderRadius: 10,
      marginRight: 10,
    },
    cardContent: {
      flex: 1,
      justifyContent: "center",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2E7D32",
    },
    cardDescription: {
      fontSize: 14,
      color: "#555",
      marginVertical: 5,
    },
    cardLink: {
      fontSize: 14,
      color: "#1E88E5",
      fontWeight: "bold",
    },
  });