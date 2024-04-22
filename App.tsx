import React, {useEffect} from 'react';
import {Linking, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {useCameraPermission} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return (
    <View style={styles.container}>
      {!hasPermission && (
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
