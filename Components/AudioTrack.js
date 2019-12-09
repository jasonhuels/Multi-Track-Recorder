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
      isPlaying: false,
      isPlaybackAllowed: false,
      muted: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,

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
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      this.recording = recording;
      await this.recording.startAsync();
      // You are now recording!
    } catch (error) {
      // An error occurred!
    }
  };

  async stopRecording() {
    Alert.alert("stopped");
    try {
      await this.recording.stopAndUnloadAsync();
      
    } catch (error) {
      console.log(error);
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
  }

  onPlayPressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        if (this.sound != null) this.sound.pauseAsync();
      } else {
        this.playbackAudioTrack();
      }
    }
  };

  async playbackAudioTrack() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
    );
    this.sound = sound;
    this.sound.playAsync();
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Button title="Rec" style={this.state.isRecording ? {backgroundColor: 'red'} : {backgroundColor: 'blue'}} onPress={this.onRecordPressed} />
          {/* Playback Slider */}
          <Text>{this.state.isRecording ? 'true' : 'false'}</Text>
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