import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Slider } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row'}}>
          <Button title="Rec" />
          <Button title="Solo" />
          <Button title="Mute" />
          {/* Volume Slider */}
          <Slider/> 
          
        </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
