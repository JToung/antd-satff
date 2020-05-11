import React, { Component } from 'react';
import router from 'umi/router';
import { message  } from 'antd';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OPERATOR_USER from '@/utils/memoryUtils';

@connect()
class Staff extends Component {
  componentDidMount() {
    if (JSON.parse(localStorage.getItem('user')) === null) {
      message.error('未登录！！请登录！');
      this.props.history.push('/');
    }
    if (JSON.parse(localStorage.getItem('user')) != null) {
      if (JSON.parse(localStorage.getItem('user')) === 'guest') {
        message.error('未登录！！请登录！');
        this.props.history.push('/');
        console.log(JSON.parse(localStorage.getItem('user')));
      }
      if (JSON.parse(localStorage.getItem('user')).status === 'false') {
        message.error('未登录！！请登录！');
        this.props.history.push('/');
        console.log(JSON.parse(localStorage.getItem('user')));
      }
    }
  }
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'info':
        router.push(`${match.url}/info`);
        break;
      case 'update':
        router.push(`${match.url}/update`);
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
      <PageHeaderWrapper
        title={<FormattedMessage id="app.staff.basic.title" />}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
        {/* <Switch>
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch> */}
      </PageHeaderWrapper>
    );
  }
}

export default Staff;
