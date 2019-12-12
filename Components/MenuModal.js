import React from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Button } from 'react-native';

export default class MenuModal extends React.Component {
  state = {
    modalVisible: false,
  };

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
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View>
              <Button title={'Save Project'} />
              <Button title={'Load Project'}  />
              <Button title={'Delete Project'}  />
              <Button title={"Cancel"}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  this.resetMenuOpen();
                }} />
            </View>
          </View>
        </Modal>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',

  },
});