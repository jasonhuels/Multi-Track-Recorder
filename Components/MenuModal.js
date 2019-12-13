import React from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Button } from 'react-native';
//import FileSystem from 'react-native-filesystem';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default class MenuModal extends React.Component {
  state = {
    modalVisible: false,
  };

  // async onPressSaveButton() {
  //   const fileContents = 'This is a my content.';
  //   try {
  //     //await FileSystem.writeToFile('my-directory/my-file.txt', fileContents);
  //     FileSystem.writeAsStringAsync(MediaLibrary.audio, fileContents);
  //     console.log(MediaLibrary.audio);
  //   } catch(err) {
  //     console.log(err)
  //   }
  // }


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
                <Button title={'Load Project'}  />
              </View>
              <View style={styles.button}>
                <Button title={'Delete Project'}  />
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