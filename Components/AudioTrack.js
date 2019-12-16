import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider, Alert } from 'react-native';
import { Audio } from 'expo-av';
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class AudioTrack extends React.Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.recording = null;

    this.state = {
      masterPlay: this.props.masterPlay,
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
      uri: null
    };
    this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY));
    this.recordingSettings.android['extension'] = '.wav';
  }
  // Use this to update state when props change
  componentDidUpdate() {
    if(this.sound != null && !this.state.isLoading){
      if(this.props.masterPlay) {
        this.sound.playAsync();
        this.stopMasterPlay()
      }
      if (!this.state.muted && this.props.shouldMute){
        this.sound.setIsMutedAsync(!this.state.muted);
      } 
      if(this.props.stopAll) {
        this.sound.stopAsync();
        this.resetStopAll();
      }
    }
  }

  stopMasterPlay(){
    this.props.resetMasterPlay(false);
  }

  startMasterPlay() {
    this.props.resetMasterPlay(true);
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
    this.startMasterPlay();
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
  
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(this.recordingSettings);
      recording.setOnRecordingStatusUpdate(this.updateScreenForRecordingStatus);
      this.recording = recording;
      await this.recording.startAsync();
      // You are now recording!
    } catch (error) {
      console.log(error);
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
    // const info = await FileSystem.getInfoAsync(this.recording.getURI());
    // console.log(`FILE INFO: ${JSON.stringify(info)}`);
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
    this.setState({
      isLoading: false,
    });
  }

  updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this.stopRecording();
      }
    }
  };

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
        uri: status.uri
      });
    } else {
      // try{
      //   this.setState({
      //     soundDuration: null,
      //     soundPosition: null,
      //     isPlaybackAllowed: false,
      //   });
      // } catch(err) {
      //   console.log(err);
      // }
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
        this.sound.playAsync();
      }
    }
  };

  onSoloPressed = () => {
    this.resetShouldMute();
  }

  resetShouldMute(){
    this.props.resetShouldMute(this.props.id);
  }

  resetStopAll() {
    this.props.resetStopAll();
  }

  setShouldMuteToFalse() {
    this.props.setShouldMuteToFalse(this.props.id);
  }

  onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
      if(this.props.shouldMute) {
        this.setShouldMuteToFalse(this.props.id);
      }
    }
  };

  onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };
  
  render(){
    if (this.sound != null && this.state.soundPosition >= this.state.soundDuration )
    { this.sound.stopAsync();}


    return(
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Button title="Rec" color={this.state.isRecording ? 'red' : 'blue'} onPress={this.onRecordPressed} />
          {/* Playback Slider */}
          <Slider disabled='true' style={{width: DEVICE_WIDTH*0.5}}/>
          <Button title="Play" onPress={this.onPlayPressed}/>
        </View>
        <View style={{
          flexDirection: 'row'
        }}>
          <View style={{padding: 5}}>
            <Button title="Solo" onPress={this.onSoloPressed}/>
          </View>
          <View style={{ padding: 5 }}>
            <Button title="Mute" color={this.state.muted ? 'red' : 'blue'} onPress={this.onMutePressed}/>
          </View>
          {/* Volume Slider */}
          <Slider value={1} onValueChange={this.onVolumeSliderValueChange} style={{width: DEVICE_WIDTH*0.25} }/>
          {/* Panning Slider */}
          {/* <Slider style={{ width: DEVICE_WIDTH * 0.25 }}/> */}
          <Text>{this.state.soundPosition}</Text>
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
    height: DEVICE_HEIGHT*0.15,
    width: DEVICE_WIDTH*0.85,
    padding: 10,
    margin: 10
  },
});