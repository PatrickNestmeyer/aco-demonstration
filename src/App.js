import React from 'react';
import Home from './pages/Home';
import BiologicalBackground from './pages/BiologicalBackground';
import ArtificialAnts from './pages/ArtificialAnts';
import AcoSystems from './pages/AcoSystems';
import Demonstration from './pages/Demonstration';

import {
  Layout,
  PageHeader,
  Icon,
  Menu
} from 'antd'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const { Header, Footer, Content, Sider } = Layout;

export default class App extends React.Component {

  state = {
    title: 'Ant Colony Optimization',
    subtitle: '',
    screenOrientation: window.screen.orientation
  };

  componentDidMount = () => {
    window.addEventListener('orientationchange', () => {
      this.setState({screenOrientation: window.screen.orientation});
      console.log(this.state.screenOrientation);
    });
    window.addEventListener('resize', () => {
      this.setState({screenOrientation: window.screen.orientation});
      console.log(this.state.screenOrientation);
    })
  }

  changeSubtitle = (subtitle) => {
    this.setState({
      subtitle: subtitle
    });
  };

  render = () => {
    return (
        <Router>
          <div>
          <Layout style={{minHeight:"100vh"}}>
            <Sider trigger={null} collapsible collapsed={(window.screen.orientation.type === 'portrait-primary')}>
              <div
                  className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="home">
                  <Link to="/home">
                    <Icon type="home" />
                    <span>Home</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="biolocical-background">
                  <Link to="/biolocical-background">
                    <Icon type="experiment" />
                    <span>Biological Background</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="artificial-ants">
                  <Link to="/artificial-ants">
                    <Icon type="bug" />
                    <span>Artificial Ants</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="aco-systems">
                  <Link to="/aco-systems">
                    <Icon type="apartment" />
                    <span>ACO-Systems</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="demonstration">
                  <Link to="/demonstration">
                    <Icon type="video-camera" />
                    <span>Demonstration</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <PageHeader
                    title={this.state.title}
                    subTitle={this.state.subtitle}
                />
              </Header>
              <Content
                  style={{
                    margin: '24px 16px',
                    padding: 24,
                    background: '#fff',
                    minHeight: 280,
                  }}
              >
                <Switch>
                  <Route path="/home">
                    <Home subtitle={this.changeSubtitle.bind(this)}/>
                  </Route>
                  <Route path="/biolocical-background">
                    <BiologicalBackground subtitle={this.changeSubtitle.bind(this)}/>
                  </Route>
                  <Route path="/artificial-ants">
                    <ArtificialAnts subtitle={this.changeSubtitle.bind(this)}/>
                  </Route>
                  <Route path="/aco-systems">
                    <AcoSystems subtitle={this.changeSubtitle.bind(this)}/>
                  </Route>
                  <Route path="/demonstration">
                    <Demonstration subtitle={this.changeSubtitle.bind(this)}/>
                  </Route>
                </Switch>
              </Content>
                <Footer style={{ textAlign: 'center' }}>
                  Created by Patrick Nestmeyer
                </Footer>
            </Layout>
          </Layout>
        </div>
        </Router>
    );
  };
}
