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
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import VideoPlayer from "../../componets/VideoPlayer";
import YouTubePlayer from "../../componets/YouTubePlayer";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MainFertilizer() {
  const [file1, setImage1] = useState(null);
  const [file2, setImage2] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  // Function to pick an image

  const navigation = useNavigation();
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Use ImagePicker.MediaType.Images instead
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const nuller = async () => {
    setImage1(null);
    setImage2(null);
    setResult1(null);
    setResult2(null);
  };

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

      if (response1.ok && response2.ok) {
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Fertilizer Recommendations...</Text>
          <Image
            source={require("../../assets/images/injection.png")}
            style={styles.headerIcon}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <View>
        <Header />

        <View style={styles.headCardContainer}>
          <View style={styles.cardsContainer}>
            <View style={styles.greenCardContainer}>
              <View style={styles.greenCardContent}>
                <Image
                  source={require("../../assets/images/fertilizer/bell.png")}
                  style={styles.greenCardHeaderIcon}
                />
                <Text style={styles.greenCardHeaderText}>
                  Please watch the guide line video below to have an better idea
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {/* Play Video */}
              {/* <View style={styles.row}>
                <VideoPlayer />
              </View> */}

              <View style={styles.row}>
                <YouTubePlayer />
              </View>
              <TouchableOpacity
                style={styles.recordBtn}
                onPress={() => navigation.navigate("CapturePlant")}
                disabled={isUploading}
              >
                <Text style={styles.buttonText}>New Recommendations </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recordBtn}
                onPress={() => navigation.navigate("FertilizingRecords")}
                disabled={isUploading}
              >
                <Text style={styles.buttonText}>Records </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    //   flex: 1,
    //   backgroundColor: "#F5F5F5",
    padding: 20,
  },
  headCardContainer: {
    flex: 1,
    padding: 16,
    zIndex: 4,
    marginTop: -30,
  },
  cardsContainer: {
    padding: 9,
    alignItems: "center",
    marginTop: 14,
  },
  greenCardContainer: {
    padding: 16,
    backgroundColor: "#096c3a",
    alignItems: "center",
    borderRadius: 20,
    width: "100%",
    paddingHorizontal: 27,
  },
  greenCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greenCardHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    padding: 3,
    width: "84%",
    marginLeft: "3%",
  },
  greenCardHeaderIcon: {
    width: 45,
    height: 45,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#096c3a",
    alignItems: "center",
    marginBottom: 16,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    height: SCREEN_HEIGHT * 0.23,
    paddingTop: 16,
    justifyContent: "flex-end",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // borderWidth:1,
    width: "92%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    // borderWidth:1,
  },
  headerIcon: {
    width: 63,
    height: 63,
    // borderWidth:1,
  },
  backButton: {
    position: "absolute",
    top: 50, // Adjust as needed
    left: 29, // Adjust as needed
    zIndex: 10,
    // borderWidth:1,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  recordBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
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
    alignSelf: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    padding: 7,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  row: {
    marginTop: 10,
    width: "100%",
  },
  backImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
});
