import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    Keyboard,
    ImageBackground
  } from "react-native";
  import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from '../firebase/firebase-config';
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
  } from "firebase/auth";
  import { useNavigation } from "@react-navigation/native";

  const Signup = () => {
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const auth = getAuth();

    const [user, setUser] = useState({
      username: "",
      email: "",
      password: "",
      firstName: '',
      mobile: '',
      address: '',
    });
    const [isChecked, setChecked] = useState(false);

    const handleSubmit = async ()=>{
        if(email && password && address && firstName && mobile){
          try {
            const userCredential = await createUserWithEmailAndPassword(auth,email, password);
            
            const userData = {
              uid:userCredential.user.uid,
              email:email,
              displayName: displayName,
              address: address,
              firstName: firstName,
              mobile: mobile
          };
          console.log("DATABSE",db);
          console.log("user data",user);

          // await firestore.collection('Registerd_User').doc(userCredential.user.uid).set(userData);
          const registerCollectionRef = collection(db,'Registerd_User');
          await setDoc(doc(registerCollectionRef,userCredential.user.uid),userData);

            console.log('User created successfully!');
                  ToastAndroid.show(
                    user.username + " User Created Succesfully!",
                    ToastAndroid.SHORT
                  );
   
           console.log("Data stored successfully in Firestore!");
          } catch (error) {
            console.log("Error storing data in Firestore:",error.message);
          }
        }
    }
  
    const handleChangeText = (user, value) => {
      setUser((prevState) => ({ ...prevState, [user]: value }));
    };
  

  return (
    <ScrollView style={styles.main_container}>
       <View style={styles.sub_container} >
    <View style={{ marginBottom: 50 }}>
    
        <Text style={styles.header_text}>Sign In..</Text>
        <Text style={styles.sub_header_text}>Let's sign yo in to Orchizen</Text>
          
          {/* <ImageBackground style={{height:200, width:200, left:80,top:20}} source={require("../assets/mother.png")}></ImageBackground> */}
          </View>
          <View style={styles.cardh}>
          <Text style={styles.input_lable}>First Name</Text>
          <TextInput
            style={styles.input_text}
          
            value={firstName}
            onChangeText={value=>setFirstName(value)}
          ></TextInput>

          <Text style={styles.input_lable}>Mobile</Text>
          <TextInput
            style={styles.input_text}
          
            value={mobile}
            keyboardType="numeric"
            onChangeText={value=>setMobile(value)}
          ></TextInput>

          <Text style={styles.input_lable}>Address</Text>
          <TextInput
            style={styles.input_text}
          
            value={address}
            onChangeText={value=>setAddress(value)}
          ></TextInput>
        
          <Text style={styles.input_lable}>Email</Text>
          <TextInput
            style={styles.input_text}
            keyboardType="email-address"
          
            value={email}
            onChangeText={value=>setEmail(value)}
          //   onChangeText={(val) => handleChangeText("email", val)}
          ></TextInput>
          <Text style={styles.input_lable}>Password</Text>
          <TextInput
            style={styles.input_text}
            secureTextEntry={true}
          
            value={password}
            onChangeText={value=>setPassword(value)}
          //   onChangeText={(val) => handleChangeText("password", val)}
          ></TextInput>


          <TouchableOpacity onPress={handleSubmit}>
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
            Already have an account?
          </Text>
        

          <TouchableOpacity
           onPress={() => navigation.navigate("Login")}
           >
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.6,
                fontSize: 15,
                color: "#23ac78",
              }}
            >
             Sign In
            </Text>
            
          </TouchableOpacity>
        </View>

          {/* <TouchableOpacity
            style={{
              alignContent: "center",
              marginTop: 20,
              backgroundColor: "#0D47A1",
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 7,
            }}
            // onPress={() => signin()}
            onPress={handleSubmit}
            underlayColor="#0084fffa"
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
              SIGN UP
            </Text>
          </TouchableOpacity> */}
          </View>
          </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
  main_container: {
    // height:"auto",
    // flex: 2,
    // top: 20,
    // padding: 15,
    backgroundColor:"white",
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
    backgroundColor:"#d4d4d4",
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
    // fontSize: 16,
  },
  cardh: {
    overflow: "hidden",    
    justifyContent: 'center',
    width: "100%", 
    marginBottom:50,
    // backgroundColor: '#e1e4ed', 
    padding: 16,
    borderRadius:25,
  
  },
  button: {
    marginTop:50,
    backgroundColor: '#4CAF50', // Adjust background color
    borderRadius: 25, // Adjust curvature
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white', // Adjust text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup
