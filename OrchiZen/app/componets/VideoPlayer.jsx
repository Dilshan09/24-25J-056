import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const VIDEO1 = "https://www.w3schools.com/html/mov_bbb.mp4"; // ✅ Direct MP4 works

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={{ uri: VIDEO1 }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
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
    width: 300,
    height: 180,
    borderRadius: 10, // ✅ Rounded corners
    overflow: "hidden", // ✅ Needed for borderRadius
    backgroundColor: "black", // Prevents flickering on Android
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default VideoPlayer;
