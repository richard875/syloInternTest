import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  SearchBar,
  Image,
} from "react-native";
import { useDarkMode, DynamicValue } from "react-native-dynamic";
import * as Font from "expo-font";
import { customFonts } from "./fonts";

// let customFonts = {
//   "Rawline-Medium": require("../assets/fonts/rawline-500.ttf"),
//   "Rawline-SemiBold": require("../assets/fonts/rawline-600.ttf"),
// };

export default class Front extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      tokenInfo: null,
    };
  }
  // Loading Fonts
  state = {
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    return fetch("https://assets-api.sylo.io/v2/all")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const isDarkMode = () => useDarkMode();
    const renderItem = ({ item }) => <Item item={item} />;
    const topEle = () => {
      return <View style={styles.topItem}></View>;
    };

    const curren = async () => {
      try {
        let response = await fetch(
          "https://assets-api.sylo.io/v2/asset/id/0xf293d23bf2cdc05411ca0eddd588eb1977e8dcd4:mainnet:ethereum/rate?fiat=NZD&period=week&type=historic"
        );
        let json = await response.json();
        console.log(json.fiat_symbol);
        return json.fiat_symbol;
      } catch (error) {
        console.error(error);
      }
    };

    curren();

    const Item = ({ item }) => (
      <View style={styles.box}>
        <View style={styles.topHalf}>
          <Image
            style={styles.logo}
            source={{
              uri: isDarkMode()
                ? `${item.icon_address}`
                : `${item.icon_address_dark}`,
            }}
          />
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.rightSideText}>
            <Text style={styles.curentPrice}>123</Text>
            <Text style={styles.movingPrice}>456</Text>
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.all}>
        <FlatList
          contentContainerStyle={styles.listView}
          data={this.state.dataSource}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={topEle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  all: {
    width: "100%",
    height: "100%",
  },
  listView: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topItem: {
    height: 145,
    width: 145,
    backgroundColor: "red",
  },
  box: {
    height: 140,
    width: 343,
    marginVertical: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#F6F6F6",
  },
  topHalf: {
    flexDirection: "row",
    width: "100%",
    height: 54,
    //backgroundColor: "blue",
    alignItems: "center",
  },
  logo: {
    height: 36,
    width: 36,
    left: 14,
  },
  title: {
    position: "absolute",
    fontSize: 15,
    lineHeight: 18,
    left: 62,
    fontFamily: "Rawline-SemiBold",
  },
  rightSideText: {
    position: "absolute",
    right: 15,
    height: "100%",
    width: 100,
    //backgroundColor: "red",
    justifyContent: "space-around",
  },
  curentPrice: {
    textAlign: "right",
    fontFamily: "Rawline-SemiBold",
  },
  movingPrice: {
    textAlign: "right",
    fontFamily: "Rawline-SemiBold",
  },
});
