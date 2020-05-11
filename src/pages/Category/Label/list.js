import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableList from'./TableList'

@connect()
class Label extends Component {

  render() {
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.label.list.title" />}
      >
        <TableList/>
      </PageHeaderWrapper>
    );
  }
}

export default Label;
