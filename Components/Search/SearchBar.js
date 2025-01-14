import React, { useState, useEffect } from 'react';
// import LinearGradient from 'react-native-linear-gradient';
// import { Card, Icon } from "@rneui/themed";
import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import axios from 'axios';

const consoles = {
  'PC': 'https://cdn.freebiesupply.com/logos/large/2x/microsoft-windows-22-logo-png-transparent.png',
  'PlayStation': 'https://www.freepnglogos.com/uploads/playstation-png-logo/navy-playstation-png-logo-5.png',
  'Xbox': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1024px-Xbox_one_logo.svg.png',
  'Nintendo': 'https://www.freepnglogos.com/uploads/nintendo-logo-png/file-micrologo-nintendo-n-logo-circle-18.png',
  // 'iOS': 'https://alchemyimmersive.com/wp-content/uploads/sites/4/2020/04/apple-logo-transparent.png',
  // 'Android': 'https://cdn.freebiesupply.com/logos/large/2x/android-logo-png-transparent.png',
}

const consoleCodes = {
  'PC': '4',
  'PlayStation 5': '187',
  'PlayStation 4': '18',
  'PlayStation 3': '16',
  'PlayStation 2': '15',
  'PlayStation 1': '27',
  'Xbox One': '1',
  'Xbox Series S/X': '186',
  'Xbox 360': '14',
  'Xbox': '80',
  'Nintendo Switch': '8',
  'Nintendo 3DS': '8',
  'Nintendo DS': '9',
  'Wii U': '10',
  'Wii': '11',
  'GameCube': '105',
  'Nintendo 64': '83',
  'Game Boy Advance': '24',
  'Game Boy Color': '43',
  'Game Boy': '26',
  'SNES': '79',
  'NES': '49'
}

const getYear = (date) => {
  const newDate = new Date(date)
  return newDate.getFullYear()
}

const getPlatforms = (platforms) => {
  if(platforms) {
    return platforms.map((p, i) => {if(p.platform.name in consoles) {
      return (<Image key={i} style={styles.consoleIcon} source={{uri: consoles[p.platform.name]}}/>)
    }})
  }
  return ''
}

export default function SearchBar( { console, callback } ) {
  const [text, setText] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    if(text.length>0) {
      axios.get('https://api.rawg.io/api/games', {
        params: {
          key: '2a79010bc4f244649e73a1fcc6658773',
          search: text,
          platforms: consoleCodes[console] ? consoleCodes[console] : Object.values(consoleCodes).join()
        }
      })
      .then((response) => {
        setGames(response.data.results)
      })
      .catch((err) => console.log(err))
    } else {
      setGames([])
    }
  }, [text])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.search}
          placeholder='Search games'
          onChangeText={newText => setText(newText)}
          defaultValue={text}
          clearButtonMode='while-editing'
        ></TextInput>
        { text.length > 0 &&
          <FlatList
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
            <TouchableOpacity onPress={() => callback(item.id)}>
              <View style={styles.item}>
                <Image style={styles.image} source={{uri: item.background_image}}/>
                <View style={styles.description}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text>{`Release year: ${getYear(item.released)}`}</Text>
                  <View style={styles.consoles}>{getPlatforms(item.parent_platforms)}</View>
                </View>
              </View>
            </TouchableOpacity>
            }
          />
        }
        <StatusBar style="auto" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  search: {
    height: 60,
    width: '90%',
    fontSize: 30,
    borderWidth: '1px',
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    // marginTop: 20,
    // marginBottom: 20
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    marginRight: 10
  },
  description: {
    width: '65%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    numberOfLines: 2,
  },
  consoles: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  consoleIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 5,
  },
});