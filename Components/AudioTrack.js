import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider, Alert } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';

export default class AudioTrack extends React.Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.recording = null;

    this.state = {
      isRecording: false,
      isPlaying: false

    };
  }

  onRecordPressed = () => {
    if(this.state.isRecording) {
      this.setState({
        isRecording: false
      });
      this.stopRecording();
    } else {
      this.setState({
        isRecording: true
      });
      this.startRecording();
    }
  };

  async startRecording() {
    Alert.alert("started");
    this.recording = new Audio.Recording();
    try {
      await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await this.recording.startAsync();
      // You are now recording!
    } catch (error) {
      // An error occurred!
    }
  };

  async stopRecording() {
    Alert.alert("stopped");
    await this.recording.stopAsync();
  }

  onPlayPressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        // Pause
      } else {
        //Play
      }
    }
  };

  render(){
    return(
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Button title="Rec" style={this.state.isRecording ? {backgroundColor: 'red'} : {backgroundColor: 'blue'}} onPress={this.onRecordPressed} />
          {/* Playback Slider */}
          <Slider />
          <Button title="Play" />
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
    height: 10,
  },
});