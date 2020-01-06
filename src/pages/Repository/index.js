import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').full_name,
  });

  state = {
    repository: {},
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({ repository: navigation.getParam('repository') });
  }

  render() {
    const { repository } = this.state;
    return (
      <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
    );
  }
}
