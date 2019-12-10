import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider } from 'react-native';
import * as Permissions from 'expo-permissions';
import AudioTrack from './Components/AudioTrack';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canRecord: false,
      masterPlay: false,
      shouldMute: [false, false, false, false]
    };
    this.resetMasterPlay = this.resetMasterPlay.bind(this);
    this.resetShouldMute = this.resetShouldMute.bind(this);
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

  resetShouldMute(id){
    const temp = [];
    for(let i=0; i<this.state.shouldMute.length; i++){
      id.includes(i) ? temp[i] = false : temp[i] = true;
    }
    this.setState({shouldMute: temp});
  }

  render() {
    return (
      <View style={styles.container}>
        <AudioTrack id='0' canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay} shouldMute={this.state.shouldMute[0]} resetShouldMute={this.resetShouldMute}/>
        <AudioTrack id='1' canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay} shouldMute={this.state.shouldMute[1]} resetShouldMute={this.resetShouldMute}/>
        <AudioTrack id='2' canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay} shouldMute={this.state.shouldMute[2]} resetShouldMute={this.resetShouldMute}/>
        <AudioTrack id='3' canRecord={this.state.canRecord} masterPlay={this.state.masterPlay} resetMasterPlay={this.resetMasterPlay} shouldMute={this.state.shouldMute[3]} resetShouldMute={this.resetShouldMute}/> 
          
        <View style={{
          flexDirection: 'row', padding: 20, marginTop: 20, justifyContent: 'center', backgroundColor: '#333'}}>
          <View style={{paddingRight: 10}}>
            <Button title="Play" onPress={()=> this.setState({ masterPlay: true })}/>
          </View>
          <Button title="Stop" />
          {/* Master Volume Slider */}
          <Slider value={1} style={{ width: DEVICE_WIDTH * 0.4 }}/> 
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
