import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FERTILIZER_API from "../../service/API";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FertilizingRecords() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [orchidData, setOrchidData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (val) => {
    setSearchText(val);
    console.log(val);

    const filteredData = orchidData.filter(
      (item) =>
        item.growth_stage?.toLowerCase().includes(val.toLowerCase()) ||
        item.fertilizer_recommendation?.name
          ?.toLowerCase()
          .includes(val.toLowerCase()) ||
        item.fertilizer_recommendation?.amount?.includes(val)
    );
    setData(filteredData);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(FERTILIZER_API + "/plant-growths");
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Error fetching plant growth records:", error);
      return [];
    }
  };

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      console.log(result);
      console.log(
        "Image URL:",
        `${FERTILIZER_API}${result[0]?.plant_features?.img_url}`
      );
      setData(result);
      setOrchidData(result);
      setLoading(false);
    };

    getData();
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
          <View style={styles.headerTextContent}>
            <Text style={styles.headerText}>Fertilizing</Text>
            <Text style={styles.headerText}>records history...</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../assets/images/fertilizer/clock.png")}
              style={styles.headerIcon}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Image
              source={require("../../assets/images/fertilizer/search.png")}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchBar}
              placeholder="Search"
              value={searchText}
              onChangeText={(value) => handleSearch(value)}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#16B364" />
          ) : (
            <ScrollView>
              {data.map((orchid, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("PlantRecommendation", {
                      orchid: orchid,
                    })
                  }
                >
                  <Image
                    source={{
                      uri: `${FERTILIZER_API}${orchid?.plant_features?.img_url}`,
                    }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>
                      {orchid?.growth_stage
                        ? orchid.growth_stage.split("(")[0]
                        : "Unknown"}
                    </Text>
                    <Text style={styles.cardDescription}>
                      {orchid?.fertilizer_recommendation?.name ||
                        "No recommendation"}
                    </Text>
                    <Text style={styles.cardDescription}>
                      {orchid?.fertilizer_recommendation?.dosage}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F0F0",
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },

  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#B1B0B0", // Optional: Change color if needed
  },

  searchBar: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#B1B0B0",
    fontWeight: "bold",
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#096c3a",
    alignItems: "center",
    marginBottom: 8,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    height: SCREEN_HEIGHT * 0.24,
    paddingTop: 16,
    justifyContent: "flex-end",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "92%",
  },
  headerTextContent: {
    width: "80%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    width: 60,
    height: 70,
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
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
    marginBottom: 20,
    marginTop: -56,
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
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
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
  backImage: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
});
