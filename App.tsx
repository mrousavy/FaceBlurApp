import React, {useEffect} from 'react';
import {Linking, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {hasPermission, requestPermission} = useCameraPermission();
  const position: CameraPosition = 'front';
  const device = useCameraDevice(position);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return (
    <View style={styles.container}>
      {hasPermission ? (
        device != null ? (
          <Camera style={styles.camera} isActive={true} device={device} />
        ) : (
          <Text style={styles.text}>
            Your phone does not have a {position} Camera.
          </Text>
        )
      ) : (
        <Text style={styles.text} numberOfLines={5}>
          FaceBlurApp needs Camera permission.{' '}
          <Text style={styles.link} onPress={Linking.openSettings}>
            Grant
          </Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  text: {
    maxWidth: '60%',
    fontWeight: 'bold',
    fontSize: 15,
  },
  link: {
    color: 'rgb(50, 50, 255)',
  },
});

export default App;
