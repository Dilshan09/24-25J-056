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
    ImageBackground,
    Dimensions,
  } from "react-native";
  import * as ImagePicker from 'expo-image-picker';
  import React, { useState, useEffect } from "react";
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Fertilizer() {

  const [file1, setImage1] = useState(null);
  const [file2, setImage2] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result1, setResult1] = useState(null);
    const [result2, setResult2] = useState(null);
 // Function to pick an image
 const pickImage = async (setImage) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],// Use ImagePicker.MediaType.Images instead
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};
const nuller = async () =>{
  setImage1(null);
  setImage2(null);
  setResult1(null);
  setResult2(null);

}

const uploadImages = async () => {
  if (!file1 || !file2) {
    alert("Please select both images before uploading!");
    return;
  }

  setIsUploading(true);

  try {
    const formData1 = new FormData();
    const formData2 = new FormData();

    formData1.append("file1", {
      uri: file1,
      name: "file1.jpg",
      type: "image/jpeg",
    });

    formData2.append("file2", {
      uri: file2,
      name: "file2.jpg",
      type: "image/jpeg",
    });

    // Upload first image
    const response1 = await fetch("http://192.168.79.46:8082/orchizenfer1", {
      method: "POST",
      body: formData1,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Upload second image
    const response2 = await fetch("http://192.168.79.46:8082/orchizenfer2", {
      method: "POST",
      body: formData2,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response1.ok && response2.ok
      ) {
        const data1 = await response1.json(); 
        const data2 = await response2.json(); 
        setResult1(data1);
        setResult2(data2);

        // console.log("Data1",result1.results.header.Flowers); 
        // console.log("Data2",data2); 

      alert("Images uploaded successfully!");
    } else {
      console.log(response1);
      alert("Failed to upload images. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setIsUploading(false);
  }
};

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} 
      onPress={() => navigation.navigate('DiseaseHome')}
      >
         <Image source={require("../assets/images/back.png")} style={styles.backImage} />
      </TouchableOpacity>
      <View style={styles.headerContent}>
              <Text style={styles.headerText}>Treat orchids with grow lights...</Text>
    <Image
      source={require("../assets/images/injection.png")}
      style={styles.headerIcon}
    />
     </View>
    </View>
  );
};



  return (
    <ScrollView>
    <View>
    <Header/>

<View style={styles.container}>

<View  style={styles.card}>   
    
  <View style={styles.cardContent}>
 
    <View style={styles.row}> 
       {/* Image Picker 1 */}
       <TouchableOpacity onPress={() => pickImage(setImage1)} disabled={isUploading}>
          {file1 ? (
              <Image source={{ uri: file1 }} style={styles.imagePreview} />
            ) : (
              <Image source={require("../assets/images/imagePlaceholder.png")} style={styles.imagePreview} />
            )}
            </TouchableOpacity>
          {/* <View style={styles.row}>
          <TouchableOpacity onPress={() => pickImage(setImage1)} disabled={isUploading}>
                  <Image source={{ uri: file1 }} style={styles.imagePreview}/>
                    </TouchableOpacity>
                    
                    {file1 && <Image source={{ uri: file1 }} style={styles.imagePreview} />}
          </View> */}


          {/* Image Picker 2 */}
          <TouchableOpacity onPress={() => pickImage(setImage2)} disabled={isUploading}>
          {file2 ? (
              <Image source={{ uri: file2 }} style={styles.imagePreview} />
            ) : (
              <Image source={require("../assets/images/imagePlaceholder.png")} style={styles.imagePreview} />
            )}
            </TouchableOpacity>



{/* 
          <TouchableOpacity onPress={() => pickImage(setImage2)} disabled={isUploading}>
            <Text style={styles.imageButton}>Select Image 2</Text>
          </TouchableOpacity>
          {file2 && <Image source={{ uri: file2 }} style={styles.imagePreview} />} */}

    </View>


  
  <View >
    {result1 &&(
          <View style={styles.Resultcard}>
          <Text style={styles.resultTitle}>Result from Api 1:</Text>
          <Text>Flowers: {result1.results.header.Flowers}</Text>
          <Text>Leaves: {result1.results.header.leaves}</Text>
          <Text>Roots: {result1.results.header.Roots}</Text>
        </View>
    )}
    {
    result2 &&(
      <View style={styles.Resultcard}>
      <Text style={styles.resultTitle}>Result from Api 2:</Text>
      <Text>Flowers: {result2.results.header.Flowers}</Text>
      <Text>Leaves: {result2.results.header.leaves}</Text>
      <Text>Roots: {result2.results.header.Roots}</Text>
    </View>
)

    }
  </View>

   
      <TouchableOpacity style={styles.button} onPress={uploadImages} disabled={isUploading}>
      <Text style={styles.buttonText}>{isUploading ? "Uploading..." : "Upload Images"}</Text>
    </TouchableOpacity>

    {/* <TouchableOpacity style={styles.button} onPress={nuller} disabled={isUploading}>
      <Text style={styles.buttonText}>null</Text>
    </TouchableOpacity>
    */}
  </View>

 

</View>

</View>


</View>
</ScrollView>     
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
      borderRadius: 30,
      paddingVertical: 10,
      alignItems: "center",
      marginTop:20,
      marginBottom: 20,
      marginLeft:"23%",
      width:"50%"
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
    Resultcard: {
      // flexDirection: "row",
      backgroundColor: "#e4eaee",
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
      //new
        row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    width:"100%",
  },
    imageButton:{
  padding:5,
  width:160, fontWeight:"600", fontSize:20
},
  imagePreview: {
  width: 130,
  height: 130,
  borderRadius: 10,
  marginVertical: 10,
},
  resultTitle: { 
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
 },
 backImage: {
  width: 30,
  height: 30,
  borderRadius: 10,
  marginRight: 10,
},
  });
