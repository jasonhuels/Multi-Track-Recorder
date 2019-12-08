import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';

export default class AudioTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <View style={{
        flexDirection: 'row'
      }}>
        <Button title="Rec" />
        <Button title="Solo" />
        <Button title="Mute" />
        {/* Volume Slider */}
        <Slider />
        {/* Panning Slider */}
        <Slider />
        {/* Playback Slider */}
        <Slider />
    <Text>{this.props.canRecord ? 'true' : 'false'}</Text>
      </View>
    );
  }
}