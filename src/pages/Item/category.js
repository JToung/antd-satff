import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';


@connect()
class Index extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'info':
        router.push(`${match.url}/info`);
        break;
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

export default Index;