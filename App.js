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
      masterPlay: false,
    };
    this.resetMasterPlay = this.resetMasterPlay.bind(this);
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
  
  resetMasterPlay(trueOrFalse){
    this.setState({ masterPlay: trueOrFalse });
  }

  render() {
    return (
      <View style={styles.container}>
        <AudioTrack canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay}/>
        <AudioTrack canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay}/>
        <AudioTrack canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay}/>
        <AudioTrack canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay}/>      
          
        <View style={{
          flexDirection: 'row', padding: 20, marginTop: 20, justifyContent: 'center', backgroundColor: '#333'}}>
          <View style={{paddingRight: 10}}>
            <Button title="Play" onPress={()=> this.setState({ masterPlay: true })}/>
          </View>
          <Button title="Stop" />
          {/* Master Volume Slider */}
          <Slider style={{ width: DEVICE_WIDTH * 0.4 }}/> 
          <Button title="Menu" />
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
