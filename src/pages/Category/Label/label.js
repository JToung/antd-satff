import React, { Component } from 'react';
import router from 'umi/router';
import { message  } from 'antd';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';


@connect()
class Index1 extends Component {

  componentDidMount() {
    if(localStorage.getItem('userId')===null){
      message.error("未登录！！请登录！");
      this.props.history.push('/user/login');
    }
  }
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'list':
        router.push(`${match.url}/list`);
        break;
      default:
        break;
    }
  };
  handleFormSubmit = value => {
    // eslint-disable-next-line
    console.log(value);
  };

  render() {
    const { match, children, location } = this.props;
    return (
      <div
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </div>
    );
  }
}

export default Index1;