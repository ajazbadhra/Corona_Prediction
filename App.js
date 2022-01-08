import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then(image => {
        console.log('selected Image', image);
        imageUpload(image.path);
      })
      .catch(e => {
        console.log('ongal', e);
      });
  };

  const imageUpload = imagePath => {
    setLoading(true);
    const imageData = new FormData();
    imageData.append('image', {
      uri: imagePath,
      name: 'image.jpg',
      fileName: 'img',
      type: 'image/jpeg',
    });
    console.log('form data', imageData);
    axios({
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      method: 'post',
      url: 'http://34.125.11.44/api/corona_prediction/',
      data: imageData,
    })
      .then(function (response) {
        setData(response.data);
        setLoading(false);
        console.log('image upload successfully', response.data);
      })
      .catch(error => {
        console.log('error riased', error);
      });
  };

  return (
    <>
      {loading && (
        <View style={styles.loadstyle}>
          <ActivityIndicator
            animating={true}
            size="large"
            textContent={'Loading...'}
            color="#0000ff"
          />
        </View>
      )}

      {data && data.length > 0 ?(
        <View
          style={[styles.textView,
          data == 'Positive' ? { backgroundColor: '#911717' } : null,
          data == 'Negative' ? { backgroundColor: 'green' } : null
          ]}>
          <ScrollView>
            <Text style={styles.text}>
              {data}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.btnStyle}
            activeOpacity={0.8}
            onPress={() => {
              setData([])
              onGallery()
            }}>
            <Text style={styles.textStyle}>select your image</Text>
          </TouchableOpacity>
        </View>
      ):

      <ImageBackground source={require('./assets/covid.jpeg')} resizeMode="cover" style={styles.image} >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.btnStyle}
            activeOpacity={0.8}
            onPress={() => {
              setData([])
              onGallery()
            }}>
            <Text style={styles.textStyle}>select your image</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>}
    </>
  );
};

const height = Math.round(Dimensions.get('window').height)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  loadstyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnStyle: {
    backgroundColor: 'blue',
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  text: {
    marginTop: height / 3,
    marginLeft: 10,
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black'

  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  }
});

export default App;