import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider, Alert } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class AudioTrack extends React.Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.recording = null;

    this.state = {
      isRecording: false,
      isPlaying: false,
      isLoading: false,
      shouldPlay: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
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
    this.setState({
      isLoading: true,
    });
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      this.recording = recording;
      await this.recording.startAsync();
      // You are now recording!
    } catch (error) {
      // An error occurred!
    }
    this.setState({
      isLoading: false,
    });
  };

  async stopRecording() {
    this.setState({
      isLoading: true,
    });
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
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this.updateScreenForSoundStatus
    );
    this.sound = sound;
    this.sound.playAsync();
    this.setState({
      isLoading: false,
    });
  }

  updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  onPlayPressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.playbackAudioTrack();
      }
    }
  };

  async playbackAudioTrack() {
    Alert.alert(this.sound);
    this.sound.playAsync();
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Button title="Rec" color={this.state.isRecording ? 'red' : 'blue'} onPress={this.onRecordPressed} />
          {/* Playback Slider */}

          <Slider />

          <Button title="Play" onPress={this.onPlayPressed}/>
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
    flex: 0,
    backgroundColor: '#616161',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    height: 100,
    width: DEVICE_WIDTH*0.75,
    padding: 10,
    margin: 10
  },
});