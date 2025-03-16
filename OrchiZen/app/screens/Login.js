import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    ToastAndroid
  } from "react-native";
  import {auth} from '../firebase/firebase-config';
  import { useNavigation } from "@react-navigation/native";
  // import { signInWithEmailAndPassword,getAuth,signInWithCredential,GoogleAuthProvider  } from 'firebase/auth';
  import * as WebBrowser from "expo-web-browser";
  import * as Google from "expo-auth-session/providers/google";
// import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

  WebBrowser.maybeCompleteAuthSession();
  
  // ✅ Configure Google Sign-In
// useEffect(() => {
//   GoogleSignin.configure({
//     webClientId: "350660592403-gnds3l3um5gip6lk9vj95i5atggrcvu3.apps.googleusercontent.com", // Make sure this is the Web Client ID from Firebase
//   });
// }, []);

  export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //seperate
    const [request, response, promptAsync] = Google.useAuthRequest({
      // clientId: "350660592403-gnds3l3um5gip6lk9vj95i5atggrcvu3.apps.googleusercontent.com",
      // redirectUri: "https://auth.expo.io/@prestongg99/Orch_mobile",
      // iosClientId: "YOUR_IOS_CLIENT_ID",
      androidClientId: "350660592403-gnds3l3um5gip6lk9vj95i5atggrcvu3.apps.googleusercontent.com",
    });

    //seperate
    useEffect(() => {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            console.log("User signed in:", userCredential.user);
          })
          .catch((error) => console.error("Sign-in error:", error));
      }
    }, [response]);

    // seperate
    // const signIn = async () => {

    //   GoogleSignin.configure({
    //     webClientId: '350660592403-gnds3l3um5gip6lk9vj95i5atggrcvu3.apps.googleusercontent.com',
    //   });

    //   try {
    //     await GoogleSignin.hasPlayServices();
    //     const response = await GoogleSignin.signIn();
    //     // if (isSuccessResponse(response)) {
    //     //   setState({ userInfo: response.data });
    //     // } else {
    //     //   // sign in was cancelled by user
    //     // }
    //   } catch (error) {
    //     if (isErrorWithCode(error)) {
    //       switch (error.code) {
    //         case statusCodes.IN_PROGRESS:
    //           ToastAndroid.show('Login successful', ToastAndroid.SHORT);
    //           // operation (eg. sign in) already in progress
    //           break;
    //         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //           // Android only, play services not available or outdated
    //           break;
    //         default:
    //         // some other error happened
    //       }
    //     } else {
    //       // an error that's not related to google sign in occurred
    //     }
    //   }
    // };

     // ✅ Google Sign-In Function
  // const signInWithGoogle = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);

  //     // 🔥 Sign in to Firebase with Google credentials
  //     await signInWithCredential(auth, googleCredential);
  //     ToastAndroid.show("Login successful", ToastAndroid.SHORT);
  //   } catch (error) {
  //     console.log("Google Sign-In Error:", error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       ToastAndroid.show("Google sign-in cancelled", ToastAndroid.SHORT);
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       ToastAndroid.show("Google sign-in in progress", ToastAndroid.SHORT);
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       ToastAndroid.show("Google Play Services not available", ToastAndroid.SHORT);
  //     } else {
  //       ToastAndroid.show("Google sign-in failed", ToastAndroid.SHORT);
  //     }
  //   }
  // };

    const handleSubmit = async ()=>{
      console.log("clicked");
      if(email && password){
        try {
          await signInWithEmailAndPassword(auth, email, password);
          ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        } catch (error) {
          console.log(error.message);
          ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
        }
      }
    }

  return (
    <ScrollView style={styles.main_container}>
    <View style={styles.sub_container} >
      <View style={{ marginBottom: 50 }}>
   

   <Text style={styles.header_text}>Sign In..</Text>
   <Text style={styles.sub_header_text}>Let's sign yo in to Orchizen</Text>
  
   {/* <ImageBackground style={{height:200, width:200, left:80,top:20}} source={require("../assets/box.png")}></ImageBackground> */}
 </View>
 
 
      <View style={styles.cardh}>
      <TouchableOpacity title="Sign in with Google" disabled={!request} onPress={() => promptAsync()} >
        <Text>Google</Text>
      </TouchableOpacity>

      {/* <GoogleSigninButton onPress={signInWithGoogle}/> */}

        <Text style={styles.input_lable}>Email</Text>
        <TextInput
          style={styles.input_text}
          keyboardType="email-address"
          placeholder="Enter email"
          value={email}
          onChangeText={value=>setEmail(value)}
        ></TextInput>
        <Text style={styles.input_lable}>Password</Text>
        <TextInput
          style={styles.input_text}
          secureTextEntry={true}
          placeholder="Enter password"
          value={password}
          onChangeText={value=>setPassword(value)}
        ></TextInput>

        <TouchableOpacity
         onPress={handleSubmit}
         >
             <View style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
             </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 0,
          }}
        >
          <Text
            style={{
              color: "#23ac78",
              fontSize: 15,
              textAlign: "center",
              marginRight: 7,
            }}
          >
            Don't have an account?
          </Text>
        

          <TouchableOpacity
           onPress={() => navigation.navigate("Signup")}
           >
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.6,
                fontSize: 15,
                color: "#23ac78",
              }}
            >
             Sign Up
            </Text>
            
          </TouchableOpacity>
        </View>
      </View>
    </View>

  
</ScrollView>
  )
}

const styles = StyleSheet.create({
  
    main_container: {
      // flex: 1,
      // top: 50,
      // margin: 15,
      backgroundColor:"white",
      // borderWidth:2,
    },      
    sub_container: {
      flex: 1,
      top: 50,
      margin: 15,
      // borderWidth:2,
    },

    header_text: {
      fontSize: 30,
      fontWeight: "700",
      color: "#23ac78",
      marginLeft:"5%",
      // borderWidth:1,
    },
    sub_header_text: {
      // fontSize: 30,
      fontWeight: "700",
      color: "#848484",
      marginLeft:"5%",
      // borderWidth:1,
    },
    input_text: {
      fontSize: 17,
      // borderColor: "#67afff",
      backgroundColor:"#ededed",
      // borderWidth: 1.5,
      borderRadius: 10,
      // padding: 10,
      paddingLeft: 10,
      // marginVertical: 5,
    },
    input_lable: {
      color: "#23ac78",
      marginVertical: 5,
      fontWeight: "bold",
      // fontSize: 1,
      // borderWidth:1,
    },
    cardh: {
      overflow: "hidden",    
      justifyContent: 'center',
      width: "100%", // Set your desired width
  
      // backgroundColor: '#e1e4ed', // Set your desired background color
      padding: 16,
      borderRadius:25,
    
    },
    button: {
      marginTop:120,
      backgroundColor: '#4CAF50', // Adjust background color
      borderRadius: 25, // Adjust curvature
      // paddingHorizontal: 20,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white', // Adjust text color
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
