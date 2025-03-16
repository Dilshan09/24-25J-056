import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import FERTILIZER_API from "../../service/API";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CapturePlant() {
  const [file1, setImage1] = useState(null);
  const [file2, setImage2] = useState(null);
  const [file3, setImage3] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [isFetchGrowth, setIsFetchGrowth] = useState(false);
  const [errMsg, setErrMsg] = useState(false);

  const navigation = useNavigation();

  const [editableResult, setEditableResult] = useState({
    flower: 0,
    leaf: 0,
    root: 0,
    stem: 0,
  });

  const handleChange = (key, value) => {
    setEditableResult((prev) => ({
      ...prev,
      [key]: value.replace(/[^0-9]/g, ""), // Allow only numbers
    }));
  };

  const openURL = (url) => {
    // Open the URL in the default web browser
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  // Request permissions for accessing the image library
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
  }, []);

  // Function to pick an image
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected media types
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Corrected result format
    }
    if (file1 && file2 && file3) {
      setErrMsg(false);
    }
  };

  const clear = async () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setResult1(null);
    setResult2(null);
    setIsFetchGrowth(false);
    setErrMsg(false);
  };

  const uploadImages = async () => {
    if (!file1) {
      setErrMsg(true);
      return;
    }
    if (!file2) {
      setErrMsg(true);
      return;
    }
    if (!file3) {
      setErrMsg(true);
      return;
    }
    setErrMsg(false);
    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("file1", {
        uri: file1, // Replace with actual URI
        name: "file1.jpg",
        type: "image/jpeg",
      });

      formData.append("file2", {
        uri: file2, // Replace with actual URI
        name: "file2.jpg",
        type: "image/jpeg",
      });

      formData.append("file3", {
        uri: file3, // Replace with actual URI
        name: "file3.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(FERTILIZER_API + "/features", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data : ", data);

        setResult1(data);
        setEditableResult(data.class_counts);
        console.log("Image URL:", FERTILIZER_API + data.result_image_url);
        alert("Images uploaded successfully!");
      } else {
        alert("Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchRecommendation = async () => {
    setIsUploading(true);
    setIsFetchGrowth(false);
    console.log("call fetchRecommendation");

    const features = {
      number_of_flowers: parseInt(editableResult.flower),
      number_of_leaves: parseInt(editableResult.leaf),
      area_of_roots: parseInt(editableResult.root),
      number_of_stems: parseInt(editableResult.stem),
      img_url: result1.result_image_url,
    };

    try {
      const response = await fetch(FERTILIZER_API + "/plant-growth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const result = await response.json();
      console.log("Growth data : ", result);
      setResult2(result);
      setIsFetchGrowth(true);
      // Display prediction result
      // Alert.alert(
      //   "Prediction Result",
      //   `Growth Stage: ${result.growth_stage}\nFertilizer: ${result.fertilizer_recommendation.name}\nApplication: ${result.fertilizer_recommendation.application_frequency}`,
      //   [{ text: "OK" }]
      // );
    } catch (error) {
      console.error("Error calling API:", error);
      Alert.alert("Error", "There was an issue with the prediction.");
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
              {errMsg && (
                <Text style={{ color: "red" }}> Please select all images</Text>
              )}
              {!result1 && (
                <View style={styles.row}>
                  {/* Image Picker 1 */}
                  <TouchableOpacity
                    onPress={() => pickImage(setImage1)}
                    disabled={isUploading}
                  >
                    {file1 ? (
                      <Image
                        source={{ uri: file1 }}
                        style={styles.imagePreview}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/imagePlaceholder.png")}
                        style={[
                          styles.imagePreview,
                          errMsg && { borderWidth: 1, borderColor: "red" },
                        ]}
                      />
                    )}
                  </TouchableOpacity>

                  {/* Image Picker 2 */}
                  <TouchableOpacity
                    onPress={() => pickImage(setImage2)}
                    disabled={isUploading}
                  >
                    {file2 ? (
                      <Image
                        source={{ uri: file2 }}
                        style={styles.imagePreview}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/imagePlaceholder.png")}
                        style={[
                          styles.imagePreview,
                          errMsg && { borderWidth: 1, borderColor: "red" },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Image Picker 3 */}
              {!result1 && (
                <View style={styles.w50}>
                  <TouchableOpacity
                    onPress={() => pickImage(setImage3)}
                    disabled={isUploading}
                  >
                    {file3 ? (
                      <Image
                        source={{ uri: file3 }}
                        style={styles.imagePreview}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/imagePlaceholder.png")}
                        style={[
                          styles.imagePreview,
                          errMsg && { borderWidth: 1, borderColor: "red" },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
              {result1 && (
                <View style={styles.imgContainer}>
                  <Image
                    source={{
                      uri: `${FERTILIZER_API}${result1.result_image_url}`,
                    }}
                    style={styles.resultPreview}
                  />
                </View>
              )}

              <View style={styles.imgContainer}>
                {result1 && (
                  <View style={styles.Resultcard}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Flowers: </Text>
                      <TextInput
                        style={styles.input}
                        value={editableResult.flower?.toString()}
                        onChangeText={(value) => handleChange("flower", value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Leaves: </Text>
                      <TextInput
                        style={styles.input}
                        value={editableResult.leaf?.toString()}
                        onChangeText={(value) => handleChange("leaf", value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Roots: </Text>
                      <TextInput
                        style={styles.input}
                        value={editableResult.root?.toString()}
                        onChangeText={(value) => handleChange("root", value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Stem: </Text>
                      <TextInput
                        style={styles.input}
                        value={editableResult.stem?.toString()}
                        onChangeText={(value) => handleChange("stem", value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                )}

                {result2 && (
                  <View style={styles.Resultcard}>
                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Age Gap: </Text>
                      <Text style={styles.ansTxt}>{result2.growth_stage} </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Rec. Fertilizer: </Text>
                      <Text style={styles.ansTxt}>
                        {result2.fertilizer_recommendation.name}
                      </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>How to Apply: </Text>
                      <Text style={styles.ansTxt}>
                        {
                          result2.fertilizer_recommendation
                            .application_frequency
                        }
                      </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Dosage: </Text>
                      <Text style={styles.ansTxt}>
                        {result2.fertilizer_recommendation.dosage}
                      </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Source: </Text>
                      <Text
                        style={styles.linkTxt}
                        onPress={() =>
                          openURL(result2.fertilizer_recommendation.source)
                        }
                      >
                        {result2.fertilizer_recommendation.source}
                      </Text>
                    </View>
                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Notes: </Text>
                      <Text style={styles.ansTxt}>
                        {result2.fertilizer_recommendation.notes}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {!result1 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={uploadImages}
                  disabled={isUploading}
                >
                  <Text style={styles.buttonText}>
                    {isUploading ? "Uploading..." : "Upload Images"}
                  </Text>
                </TouchableOpacity>
              )}

              {result1 && !isFetchGrowth && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={fetchRecommendation}
                  disabled={isUploading}
                >
                  <Text style={styles.buttonText}>
                    {isUploading ? "Confirming Data..." : "Confirm Data"}
                  </Text>
                </TouchableOpacity>
              )}

              {result1 && (
                <TouchableOpacity
                  style={styles.discard}
                  onPress={clear}
                  disabled={isUploading}
                >
                  <Text style={styles.buttonText}>Discased</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  headCardContainer: {
    flex: 1,
    padding: 16,
    zIndex: 4,
    marginTop: -40,
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
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  resTxt: {
    color: "#16B364",
    fontSize: 16,
    fontWeight: 500,
  },
  ansTxt: {
    color: "#1E1E1E",
    fontSize: 14,
    marginBottom: 10,
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
    // borderWidth:1,
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
  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    width: "55%",
  },
  discard: {
    backgroundColor: "#000000",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "50%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkTxt: {
    fontSize: 14,
    color: "blue", // Makes the link look clickable
    textDecorationLine: "underline", // Underlines the text to indicate it's a link
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  Resultcard: {
    padding: 10,
    backgroundColor: "#E4EAEE",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 250,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  resContainer: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#16B364",
    padding: 5,
    width: 50,
    textAlign: "center",
    borderRadius: 5,
    color: "black",
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
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    width: "100%",
  },
  imageButton: {
    padding: 5,
    width: 160,
    fontWeight: "600",
    fontSize: 20,
  },
  imagePreview: {
    width: 130,
    height: 130,
    borderRadius: 20,
    marginVertical: 10,
  },

  resultPreview: {
    width: 250,
    height: 350,
    borderRadius: 10,
    marginVertical: 10,
  },

  w50: {
    width: "50%",
  },
  backImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
});
