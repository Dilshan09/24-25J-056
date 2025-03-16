import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = (width / 16) * 9; // Maintain 16:9 aspect ratio

const YouTubePlayer = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.videoWrapper, { width, height: VIDEO_HEIGHT }]}>
        <WebView
          source={{ uri: "https://www.youtube.com/watch?v=N4rcyn7DODA" }}
          allowsFullscreenVideo={true}
          style={styles.video}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "black",
    width: 300,
  },
  video: {
    width: 300,
    height: "100%",
  },
});

export default YouTubePlayer;
