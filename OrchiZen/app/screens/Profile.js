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
  const { currentUser } = getAuth(); 
  import { useNavigation } from "@react-navigation/native";
  import { getAuth, signOut, onAuthStateChanged   } from "firebase/auth";
  import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    getDoc,
  } from "firebase/firestore";
  import {auth, db } from '../firebase/firebase-config'; 
  import React, { useState, useEffect } from "react";
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Profile() {
    const [newAddress, setNewAddress] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [mobile, setMobile] = useState('');    
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
      // Listen for auth state changes
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user); // Update the current user reactively
        } else {
          setCurrentUser(null); // Clear current user on logout
        }
      });
  
      return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
          console.log("CURRENT USER",currentUser);
          if (currentUser) {
            try {
              const userDocRef = doc(db, 'Registerd_User', currentUser.uid); // Updated reference creation
              const userDocSnap = await getDoc(userDocRef); // Updated data fetching using getDoc
              console.log("docsnap",userDocSnap.data());
    
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setUserData(userData);
                setNewFirstName(userData.firstName);
                setMobile(userData.mobile);
                setNewAddress(userData.address);
                setEmail(userData.email);
                
              } else {
                console.log('User data not found');
              }
             console.log("dat", userData);
            } catch (error) {
              console.error('Error fetching user datax:', error);
            }finally {
              setLoading(false); // Set loading state to false after fetching data
            }
          }
        };
    
        fetchUserData();
      }, [currentUser]);

      
      const handleSignOut = async () => {
        try {
          const auth = getAuth();
          await signOut(auth);
          console.log("User signed out");
          // navigation.navigate("Login"); // Redirect to the Login screen
        } catch (error) {
          console.error("Sign-out error:", error.message);
        }
      };
    


      const Header = () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} 
            onPress={() => navigation.navigate('Home')}
            >
               <Image source={require("../assets/images/back.png")} style={styles.backImage} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
                    <Text style={styles.headerText}>Your Profile</Text>
          <Image
            source={require("../assets/images/user.png")}
            style={styles.headerIcon}
          />
           </View>
          </View>
        );
      };


    return (
        <View>
        <View>        
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Header />
            <View style={styles.cardsContainer}>
{/*   
            <View style={styles.greenCardContainer}>
                <View style={styles.greenCardContent}>
                <Image source={require("../assets/images/notification.png")}  style={styles.greenCardHeaderIcon} />
                    <Text style={styles.greenCardHeaderText}>Your Profile Details.</Text>                
            </View>           
            </View>       
   */}
            </View>
  
            <View style={styles.cardContainer}>

            <View style={styles.Resultcard}>
                <Text style={styles.label1}>Name</Text>
                <Text style={styles.label2}>{newFirstName}</Text>
            </View>
            </View>
              
            <View style={styles.cardContainer}>

            <View style={styles.Resultcard}>
                <Text style={styles.label1}>Email </Text>
                <Text style={styles.label2}>{email}</Text>
            </View>
            </View>
              
            <View style={styles.cardContainer}>

            <View style={styles.Resultcard}>
                <Text style={styles.label1}>Mobile</Text>
                <Text style={styles.label2}> {mobile}</Text>
            </View>
            </View>
              
            <View style={styles.cardContainer}>

            <View style={styles.Resultcard}>
                <Text style={styles.label1}>Lives in</Text>
                <Text style={styles.label2}>{newAddress}</Text>
            </View>
            
            </View>
            <TouchableOpacity style={styles.startButton} onPress={handleSignOut}>
                  <Text style={styles.startButtonText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
        </View>
  
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
      flex: 1,
      flexGrow: 1,
      borderWidth:2,
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
  
    cardsContainer: {
        padding: 10,
  
        // borderRadius: 8,
        alignItems: 'center',
        // marginBottom: 16,
  
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
        width:"95%",
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
        fontSize: 13,
        // fontWeight: 'bold',
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
  
  
    cardContainer: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      marginHorizontal: 26,
      marginBottom:9,
    //   marginTop:17,
    //   borderWidth:3
    },
  
    imagePreview: {
        width: '100%',
        height: 300,
        borderRadius: 8,
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
  
    startButton: {
      backgroundColor: 'black',
      paddingVertical: 4,
      borderRadius: 30,
      alignItems: 'center',
      width:"60%",
      marginBottom:20,
    marginTop:10,
      marginHorizontal:"20%"
    },
    startButtonText: {
      color: '#fff',
      fontSize: 16,
    //   fontWeight: 'bold',
    },
  
  label1: {
    fontSize: 15,
    fontWeight:"bold",
    // marginBottom: 5,
    color: "#16b464",
    // borderWidth:1,
    // width: "43%", 
  
  },
  label2: {
    fontSize: 15,
    fontWeight:"bold",
    color: "#333",
    // borderWidth:1,
    // width: "37%", 
  
  },
  card: {
    flexDirection: "row",
    // backgroundColor: "#e4eaee",
    // borderRadius: 10,
    // padding: 10,
    marginBottom: 3,
  },
  backImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },

  
  });