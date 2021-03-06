import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider } from 'react-native';
import * as Permissions from 'expo-permissions';
import AudioTrack from './Components/AudioTrack';
import MenuModal from './Components/MenuModal';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numTracks: 4,
      canRecord: false,
      accessFiles: false,
      masterPlay: false,
      shouldMute: [false, false, false, false],
      stopAll: false,
      menuOpen: false,
      savedTracks: []
    };
    this.resetMasterPlay = this.resetMasterPlay.bind(this);
    this.resetShouldMute = this.resetShouldMute.bind(this);
    this.setShouldMuteToFalse = this.setShouldMuteToFalse.bind(this);
    this.resetStopAll = this.resetStopAll.bind(this);
    this.resetMenuOpen = this.resetMenuOpen.bind(this);
    this.getTracksForSaving = this.getTracksForSaving.bind(this);
  }

  componentDidMount() {
    this.requestRecordingPermission();
    this.requestCameraPermission();
  }

  requestRecordingPermission = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      canRecord: response.status === 'granted',
    });
  };
  
  requestCameraPermission = async () => {
    const response = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      accessFiles: response.status === 'granted',
    });
  };

  resetMasterPlay(trueOrFalse){
    this.setState({ masterPlay: trueOrFalse });
  }
  resetStopAll() {
    this.setState({ stopAll: false });
  }

  resetShouldMute(id){
    const temp = [];
    for(let i=0; i<this.state.shouldMute.length; i++){
      id.toString().includes(i) ? temp[i] = false : temp[i] = true;
    }
    this.setState({shouldMute: temp});
  }

  setShouldMuteToFalse(id){
    const temp = [];
    for (let i = 0; i < this.state.shouldMute.length; i++) {
      id.toString().includes(i) ? temp[i] = false : temp[i] = this.state.shouldMute[i];
    }
    this.setState({ shouldMute: temp });
  }

  resetMenuOpen(trueOrFalse){
    this.setState({ menuOpen: trueOrFalse})
  }

  getTracksForSaving(id, track){
    let temp = this.state.savedTracks;
    temp[id] = track;
    this.setState({ savedTracks: temp});
  }

  render() {
    const tracks = [];
    for(let i=0; i<this.state.numTracks; i++) {
      tracks[i] = <AudioTrack  key={i} id={i}
        canRecord={this.state.canRecord}
        masterPlay={this.state.masterPlay}
        resetMasterPlay={this.resetMasterPlay}
        shouldMute={this.state.shouldMute[i]}
        resetShouldMute={this.resetShouldMute}
        setShouldMuteToFalse={this.setShouldMuteToFalse}
        stopAll={this.state.stopAll} 
        resetStopAll={this.resetStopAll}
        saveTrack={this.getTracksForSaving}
        />
    }

    return (
      <View style={styles.container}>
        <View>{tracks}</View>
        {/* <MenuModal menuOpen={this.state.menuOpen} resetMenuOpen={this.resetMenuOpen} tracksToSave={this.state.savedTracks}/>  */}

        <View style={styles.masterControl}>
          <View style={{paddingRight: 10}}>
            <Button title="Play" onPress={()=> this.setState({ masterPlay: true })}/>
          </View>
          <Button title="Stop" onPress={() => this.setState({ stopAll: true })} />
          {/* <View style={{paddingLeft: 50}}>
            <Button title="Menu" onPress={() => this.setState({menuOpen: !this.state.menuOpen})} />
          </View> */}
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
  masterControl: {
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    flexDirection: 'row', 
    padding: 20, 
    marginTop: 20, 
    justifyContent: 'center', 
    backgroundColor: '#333',
    width: DEVICE_WIDTH * 0.85,
  }
});
