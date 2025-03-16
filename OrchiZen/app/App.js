import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useFocusEffect, useNavigation  } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import React, { useState } from 'react';
import { StyleSheet, Text, View ,Platform,Image } from 'react-native';

import axios from 'axios';
import useAuth from './firebase/useAuth';
import { Ionicons } from "@expo/vector-icons"; // For icons

import Login from './screens/Login';
import Signup from './screens/Signup'; 
import Home from './screens/Home';
import Watering from './screens/Watering';
import WateringForm from './screens/WateringForm';
import EmergencyWaterForm from './screens/EmergencyWaterForm';
import DiseaseHome from './screens/DiseaseHome';
import Fertilizer from './screens/Fertilizer';
import WateringHistoryList from './screens/WateringHistoryList';
import FindHome from './screens/FindHome';
import FindNewOrchids from './screens/FindNewOrchids';
import FindOrchHistory from './screens/FindOrchHistory';
import UvLightForm from './screens/UvLightForm';
import GrowLight from './screens/GrowLight';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            return (
              <Image
                source={
                  focused
                    ? require("./assets/images/homeActive.png") // Custom active icon
                    : require("./assets/images/home.png")       // Custom inactive icon
                }
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            );
          } 
          else if (route.name === "FindHome") {
            return (
              <Image
                source={
                  focused
                    ? require("./assets/images/FindActive.png") // Custom active icon
                    : require("./assets/images/Find.png")       // Custom inactive icon
                }
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            );
          } 
          else if (route.name === "Watering") {
            return (
              <Image
                source={
                  focused
                    ? require("./assets/images/wateringActive.png") // Custom active icon
                    : require("./assets/images/watering.png")       // Custom inactive icon
                }
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            );
          } 
          else if (route.name === "DiseaseHome") {
            return (
              <Image
                source={
                  focused
                    ? require("./assets/images/bugActive.png") // Custom active icon
                    : require("./assets/images/bug.png")       // Custom inactive icon
                }
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            );
          }else if (route.name === "Fertilizer") {
            return (
              <Image
                source={
                  focused
                    ? require("./assets/images/bucketActive.png") // Custom active icon
                    : require("./assets/images/bucket.png")       // Custom inactive icon
                }
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            );
          }
          else if (route.name === "Profile") {
            return (
              <Image
                source={
                  focused
                    ? require("./assets/images/profileActive.png") // Custom active icon
                    : require("./assets/images/profile.png")       // Custom inactive icon
                }
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "gray",
        headerShown: false, // Hide header for bottom tabs
      })}
    >
      <Tab.Screen name="Home"  component={Home} />
      <Tab.Screen name="FindHome" options={{ title: "Find" }} component={FindStack} />
      <Tab.Screen name="Watering"  component={WateringStack} />
      <Tab.Screen name="DiseaseHome" options={{ title: "Disease" }}  component={DiseaseStack} />
      <Tab.Screen name="Fertilizer"  component={Fertilizer} />
      <Tab.Screen name="Profile"  component={Profile} />
    </Tab.Navigator>
  );
};

const WateringStack = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      e.preventDefault(); // Prevent default navigation behavior
      navigation.reset({
        index: 0,
        routes: [{ name: "Watering" }],
      });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Watering"  component={Watering}  />
      <Stack.Screen name="WateringForm" component={WateringForm} />
      <Stack.Screen name="EmergencyWaterForm" component={EmergencyWaterForm} />
      <Stack.Screen name="WateringHistoryList" component={WateringHistoryList} />
    </Stack.Navigator>
  );
};
const FindStack = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      e.preventDefault(); // Prevent default navigation behavior
      navigation.reset({
        index: 0,
        routes: [{ name: "FindHome" }],
      });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FindHome" component={FindHome} />
      <Stack.Screen name="FindNewOrchids" component={FindNewOrchids} />
      <Stack.Screen name="FindOrchHistory" component={FindOrchHistory} />

    </Stack.Navigator>
  );
};

const DiseaseStack = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      e.preventDefault(); // Prevent default navigation behavior
      navigation.reset({
        index: 0,
        routes: [{ name: "DiseaseHome" }],
      });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiseaseHome" component={DiseaseHome} />
       <Stack.Screen name="UvLightForm" component={UvLightForm} />
      <Stack.Screen name="GrowLight" component={GrowLight} />

    </Stack.Navigator>
  );
};


export default function App() {
  const {user} = useAuth();
// if(user){
  return (
    //new creation
    <View 
      style={{
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      flex: 1,
    }}>
     
        <NavigationContainer>{user ? (
        
        <Stack.Navigator>          
        <Stack.Screen
              name="HomeTabs"
              component={BottomTabs}
              options={{
                title: "Home",
                headerStyle: { backgroundColor: "#ccc9e6" },
                headerShadowVisible: false,
                headerTitleAlign: "center",
                headerShown: false, // Hide Stack header
              }}
            />    
        </Stack.Navigator>
        
        ) : (
          <Stack.Navigator>
          {/* <Stack.Screen name="LandingPage" component={LandingPage}  
          options={{ title: "LandingPage",  headerStyle: { backgroundColor: "black" },  headerShadowVisible: false, headerTitleAlign: "center", headerShown: false,}} /> */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    />
  
      <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ title: "Signup",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    />
          
       </Stack.Navigator>
        ) }
      </NavigationContainer>
     

    </View>
  );

// }else{
//   return ( 
//     <View 
//       style={{
//       marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//       flex: 1,
//     }}>        
//         <NavigationContainer>
//         <Stack.Navigator>
//           {/* <Stack.Screen name="LandingPage" component={LandingPage}  
//           options={{ title: "LandingPage",  headerStyle: { backgroundColor: "black" },  headerShadowVisible: false, headerTitleAlign: "center", headerShown: false,}} /> */}
//           <Stack.Screen
//             name="Login"
//             component={Login}
//             options={{ title: "Login",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    />
  
//       <Stack.Screen
//                 name="Signup"
//                 component={Signup}
//                 options={{ title: "Signup",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    />
          
//        </Stack.Navigator>
//       </NavigationContainer>               
//     </View>
//     );
// }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 30,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  appTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  date: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555555",
  },
});
