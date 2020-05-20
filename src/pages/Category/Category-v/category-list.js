import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableList from'./TableList'

@connect()
class CategoryL extends Component {

  render() {
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.categoty.list.title" />}
      >
        <TableList/>
      </PageHeaderWrapper>
    );
  }
}

export default CategoryL;
