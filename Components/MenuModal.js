import React from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Button } from 'react-native';
//import FileSystem from 'react-native-filesystem';
import * as FileSystem from 'expo-file-system';

export default class MenuModal extends React.Component {
  state = {
    modalVisible: false,
  };

  async onPressSaveButton() {
    console.log(FileSystem.documentDirectory);
    const fileContents = 'This is a my content.';
    try {
      //await FileSystem.writeToFile('my-directory/my-file.txt', fileContents);
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/my-file.txt', fileContents);
      console.log(await FileSystem.getInfoAsync(FileSystem.documentDirectory + '/my-file.txt'));
    } catch(err) {
      console.log(err)
    }
  }
  
  async onPressLoadButton() {
    let content = "";
    try{
      content = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/my-file.txt');
      console.log(content);
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