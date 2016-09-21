/**
 * Sample Firebase & React Native App
 * https://github.com/davideast/firebase-react-native-sample
 */
'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js')

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

import base from './config';


// Initialize Firebase

// const firebaseApp = firebase.initializeApp(firebaseConfig);

class FirebaseReactNativeSample extends Component {

  constructor(props) {
    super(props);
    this.cancelButton = this.cancelButton.bind(this);
    this.addWidget = this.addWidget.bind(this);
    this.complete = this.complete.bind(this);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  componentWillMount() {
    let email = 'luketgriffith@gmail.com';
    let password = 'greatpassword1';

    base.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    })
  }

  componentDidMount(itemsRef) {
    base.listenTo('widgets', {
      context: this,
      asArray: true,
      then(data) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data)
        });
      }
    })
  }

  cancelButton() {
    AlertIOS.alert('You done canceled it, nice work')
  }

  addWidget(text) {
    base.push('widgets', {
      data: {
        name: text,
        age: 4
      },
      then(data) {
      }
    })
  }

  complete(item) {
    console.log(item)
    base.update('widgets/' + item.key, {
      data: { completed: true },
      then(data) {

      }
    })
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Things" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add a Thing" />

      </View>
    )
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {
          text: 'Cancel',
          onPress: () => this.cancelButton(), style: 'cancel'
        },
        {
          text: 'Add',
          onPress: (text) => this.addWidget(text)
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {
    console.log('wssdfadf', item)
    const onPress = () => {
      AlertIOS.alert(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: () => this.complete(item)},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}

AppRegistry.registerComponent('FirebaseReactNativeSample', () => FirebaseReactNativeSample);
