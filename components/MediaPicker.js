/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  TouchableHighlight,
  ActivityIndicator,
  CameraRoll,
  StyleSheet,
  Image,
  View,
  Text
} from 'react-native';
import Video from 'react-native-video';

const screen = require('Dimensions').get('window');

class MediaPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      media: [],
      selectedIndex: -1
    }
  }
  componentDidMount() {
    const fetchParams = {
      first: 25,
      groupTypes: 'All',
      assetType: 'All',
    };

    CameraRoll.getPhotos(fetchParams)
      .then((data) => {
        const assets = data.edges;
        const media = assets.map((asset) => asset.node);
        this.setState({
          media: media,
        });
      }, (e) => console.log(e));
  }

  videoError() {
    console.log('video loading error');
  }

  _onPressButton(index) {
    this.setState({selectedIndex: index});
  }

  render() {
    const {media, selectedIndex} = this.state;

    let previewContent;
    if(selectedIndex >= 0 && selectedIndex < media.length) {
      let selectedItem = media[selectedIndex];
      if(selectedItem.type === 'ALAssetTypePhoto') {
        previewContent = <Image source={{uri: selectedItem.image.uri}}
                          style={styles.videoPreview} />;
      } else if(selectedItem.type === 'ALAssetTypeVideo') {
        previewContent = (
          <Video source={{uri: selectedItem.image.uri}}
               onError={this.videoError}
               style={styles.videoPreview} />
        );
      }
    } else if(selectedIndex === -1) {
      previewContent = (
        <Text style={styles.selectVideoText}>Select a video or picture to keep it for today.</Text>
      );
    } else {
      previewContent = (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large" />
      )
    }

    console.log(media);
    let mediaItems = media.map((item, index) => {
      let uri = item.image.uri;
      let id = uri.match(/id=(.*)&/)[1];
      let type = item.type.match(/ALAssetType(.*)/)[1];

      return (
        <View key={id}>
          <TouchableHighlight onPress={this._onPressButton.bind(this, index)}>
            <Image style={styles.image} source={{ uri: uri }} />
          </TouchableHighlight>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.preview}>
          {previewContent}
        </View>

        <View style={styles.mediaList}>
          {mediaItems}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: screen.width,
    height: screen.width,
    backgroundColor: 'red'
  },
  mediaList: {
    width: screen.width,
    height: screen.height - screen.width,
    alignSelf: 'stretch',
    backgroundColor: 'blue',
  },
  selectVideoText: {
  },
  activityIndicator: {
    height: screen.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPreview: {
    flex: 1,
    width: screen.width,
    height: screen.width,
  },
  image: {
    width: 100,
    height: 100,
  },
});

module.exports = MediaPicker;