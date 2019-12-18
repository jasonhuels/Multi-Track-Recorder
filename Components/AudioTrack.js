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
      uri: null,
      loop: false
    };
    this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
    this.recordingSettings.android['extension'] = '.wav';
    this.recordingSettings.android['sampleRate'] = 5500;
    this.recordingSettings.android['bitRate'] = 11000;
    this.onPressLoopButton = this.onPressLoopButton.bind(this);
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

  componentWillUnmount() {
    this.sound.stopAsync();
    this.sound = null;
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
      this.stopMasterPlay();
      this.startMasterPlay();
      this.startRecording();
    }
  };

  onStopPressed = () => {
    if (this.state.isRecording) {
      this.setState({
        isRecording: false
      });
      this.stopRecording();
    } else if(this.sound != null){
      this.sound.stopAsync();
    }
  };

  async startRecording() {
    this.setState({
      isLoading: true,
    });
    
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
        isLooping: this.state.loop,
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

  onPressLoopButton() {
    if(this.sound != null) {
      // this seems counterintuitive but its the only way it works 
      this.sound.setIsLoopingAsync(!this.state.loop);
      this.setState({ loop: !this.state.loop });
    }
  }

  trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (err) {
        console.log(err)
      }
    }
  };

  onRateSliderSlidingComplete = async value => {
    this.trySetRate(value, this.state.shouldCorrectPitch);
  };
  
  render(){
    if (this.sound != null && this.state.soundPosition >= this.state.soundDuration )
    { this.sound.stopAsync();}

    return(
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'
        }}>
          <View style={styles.button}>
            <Button title="Rec" color={this.state.isRecording ? 'red' : 'blue'} onPress={this.onRecordPressed} />
          </View> 
          {/* Playback Slider */}
          <Slider
            style={{ width: DEVICE_WIDTH * 0.3 }}
            value={this.state.rate}
            onSlidingComplete={this.onRateSliderSlidingComplete}
            disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
          />
          <View style={styles.button}>
            <Button title="Play" onPress={this.onPlayPressed}/>
          </View>
          <View style={styles.button}>
            <Button title="Stop" onPress={this.onStopPressed} />
          </View>
        </View>
        <View style={{
          flexDirection: 'row'
        }}>
          <View style={styles.button}>
            <Button title="Solo" onPress={this.onSoloPressed}/>
          </View>
          <View style={styles.button}>
            <Button title="Mute" color={this.state.muted ? 'red' : 'blue'} onPress={this.onMutePressed}/>
          </View>
          {/* Volume Slider */}
          <Slider value={1} onValueChange={this.onVolumeSliderValueChange} style={{width: DEVICE_WIDTH*0.25} }/>
          <View style={styles.button}>
            <Button title="Loop" color={this.state.loop ? 'green' : '#525252'} onPress={this.onPressLoopButton}/>
          </View>
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
  button: {
    padding: 5,
    borderRadius: 10
  }
});