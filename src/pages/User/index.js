import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    refreshing: false,
  };

  componentDidMount() {
    this.loadStarreds();
  }

  loadStarreds = async () => {
    const { page, stars, refreshing } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });
    this.setState({
      stars: refreshing ? response.data : [...stars, ...response.data],
      page: page + 1,
      refreshing: false,
    });
  };

  refreshList = () => {
    this.setState({ refreshing: true, page: 1 }, () => this.loadStarreds());
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadStarreds}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
