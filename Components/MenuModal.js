import React from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default class MenuModal extends React.Component {
  state = {
    modalVisible: false,
    loadedTracks: []
  };

  async onPressSaveButton() {
    // const fileContents = 'This is a my content.';
    try {
      for (let i = 0; i < this.props.tracksToSave.length; i++) {
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory + `/track${i}.wav`, this.props.tracksToSave[i]);
        console.log(await FileSystem.getInfoAsync(FileSystem.documentDirectory + `/track${i}.wav`));
      }
      // FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/my-file.txt', fileContents);
      //console.log(await FileSystem.getInfoAsync(FileSystem.documentDirectory + '/my-file.txt'));
    } catch(err) {
      console.log(err)
    }
  }
  
  async onPressLoadButton() {
    let content = [];
    let track0 = await FileSystem.getInfoAsync(FileSystem.documentDirectory + `/track0.wav`)
    console.log(await FileSystem.getInfoAsync(FileSystem.documentDirectory + `/track0.wav`));
    try{
      for(let i=0; i<4; i++) {
        if (track0.exists) {
          content[i] = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + `/track${i}.wav`);
          this.setState({
            loadedTracks: content
          })
        }
      }
      // content = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/my-file.txt');
      console.log(this.state.loadedTracks);
    }
    catch(err){
      console.log(err);
    }
  }

  async onPressDeleteButton() {
    try {
      FileSystem.deleteAsync(FileSystem.documentDirectory + '/my-file.txt')
    }
    catch (err) {
      console.log(err);
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidUpdate(){
    if(!this.state.modalVisible && this.props.menuOpen) this.setModalVisible(true);
  }

  resetMenuOpen() {
    this.props.resetMenuOpen(false);
  }

  render() {
    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View style={{width: 250}}>
              <View style={styles.button}>
              <Button title={'Save Project'} onPress={this.onPressSaveButton}/>
              </View>
              <View style={styles.button}>
              <Button title={'Load Project'} onPress={this.onPressLoadButton} />
              </View>
              <View style={styles.button}>
              <Button title={'Delete Project'} onPress={this.onPressDeleteButton} />
              </View>
              <View style={styles.button}>
                <Button title={"Cancel"}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    this.resetMenuOpen();
                  }} />
              </View>
            </View>
          </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
    padding: 100
  },
  button: {
    margin: 10
  }
});