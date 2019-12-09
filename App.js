import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import AudioTrack from './Components/AudioTrack';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canRecord: false,
    };
  }

  componentDidMount() {
    this.requestRecordingPermission();
  }

  requestRecordingPermission = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      canRecord: response.status === 'granted',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <AudioTrack canRecord={this.state.canRecord}/>
        <AudioTrack canRecord={this.state.canRecord} />
        <AudioTrack canRecord={this.state.canRecord} />
        <AudioTrack canRecord={this.state.canRecord} />
        
          
        <View style={{
          flexDirection: 'row'}}>
          <Button title="Play" />
          <Button title="Stop" />
          {/* Master Volume Slider */}
          <Slider /> 
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
