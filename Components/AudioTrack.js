import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';

export default class AudioTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      isPlaying: false

    };
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Button title="Rec" />
          {/* Playback Slider */}
          <Slider />
        </View>
        <View style={{
          flexDirection: 'row'
        }}>
          <Button title="Solo" />
          <Button title="Mute" />
          {/* Volume Slider */}
          <Slider />
          {/* Panning Slider */}
          <Slider />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
});