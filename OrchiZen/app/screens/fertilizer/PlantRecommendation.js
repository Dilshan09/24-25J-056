import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import FERTILIZER_API from "../../service/API";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PlantRecommendation({ route }) {
  const { orchid } = route.params;

  const navigation = useNavigation();

  const openURL = (url) => {
    // Open the URL in the default web browser
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  // Request permissions for accessing the image library
  useEffect(() => {
    console.log("iiiiiiiii", orchid.plant_features.leaves);
  }, []);

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
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.imgContainer}>
                <Image
                  source={{
                    uri: `${FERTILIZER_API}${orchid.plant_features.img_url}`,
                  }}
                  style={styles.resultPreview}
                />
              </View>

              <View style={styles.imgContainer}>
                {orchid && (
                  <View style={styles.Resultcard}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Flowers: </Text>
                      <Text style={styles.input}>
                        {orchid.plant_features.flowers?.toString()}
                      </Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Leaves: </Text>
                      <Text style={styles.input}>
                        {orchid.plant_features.leaves?.toString()}
                      </Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Roots: </Text>
                      <Text style={styles.input}>
                        {orchid.plant_features.roots}
                      </Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.resTxt}>Stem: </Text>
                      <Text style={styles.input}>
                        {orchid.plant_features.stems?.toString()}
                      </Text>
                    </View>
                  </View>
                )}

                {orchid && (
                  <View style={styles.Resultcard}>
                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Age Gap: </Text>
                      <Text style={styles.ansTxt}>{orchid.growth_stage} </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Rec. Fertilizer: </Text>
                      <Text style={styles.ansTxt}>
                        {orchid.fertilizer_recommendation.name}
                      </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>How to Apply: </Text>
                      <Text style={styles.ansTxt}>
                        {orchid.fertilizer_recommendation.application_frequency}
                      </Text>
                    </View>

                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Source: </Text>
                      <Text
                        style={styles.linkTxt}
                        onPress={() =>
                          openURL(orchid.fertilizer_recommendation.source)
                        }
                      >
                        {orchid.fertilizer_recommendation.source}
                      </Text>
                    </View>
                    <View style={styles.resContainer}>
                      <Text style={styles.resTxt}>Notes: </Text>
                      <Text style={styles.ansTxt}>
                        {orchid.fertilizer_recommendation.notes}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
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
