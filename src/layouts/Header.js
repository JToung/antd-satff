import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Layout, message, Modal, Form, Input, Card, Row, Col } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
// import { RocketOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
@Form.create()
class HeaderView extends Component {
  state = {
    visible: true,
    psdVisible: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/staff/center');
      return;
    }
    if (key === 'changePsd') {
      this.showPSDViewModal();
      return;
    }
    // if (key === 'userinfo') {
    //   router.push('/account/settings/base');
    //   return;
    // }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  //提交修改
  handlePSDViewOk = e => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      const data = {
        ...values,
        character: 's',
        _id: localStorage.getItem('userId'),
      };
      console.log('data', data);

      dispatch({
        type: 'staff/changePsd',
        payload: data,
      }).then(res => {
        console.log('res', res);
        if (res.status == '1') {
          message.success(res.information);
          dispatch({
            type: 'login/logout',
          });
        } else {
          message.error(res.information);
        }
      });
    });
    this.setState({
      psdVisible: false,
    });
  };

  showPSDViewModal = e => {
    console.log(e);
    this.setState({
      psdVisible: true,
    });
  };

  handlePSDViewCancel = e => {
    console.log(e);
    this.setState({
      psdVisible: false,
    });
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header
        style={{ padding: 0, width, zIndex: 2 }}
        className={fixedHeader ? styles.fixedHeader : ''}
      >
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
        <Modal
          title="修改密码"
          visible={this.state.psdVisible}
          onOk={this.handlePSDViewOk}
          onCancel={this.handlePSDViewCancel}
          width={720}
        >
          <Form layout="vertical">
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="账号">
                    {this.props.form.getFieldDecorator('account', {
                      rules: [{ required: true, message: '请输入账号' }],
                    })(<Input placeholder="请输入账号" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="密码">
                    {this.props.form.getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入新密码' }],
                    })(<Input.Password placeholder="请输入新密码" size="large" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
}))(HeaderView);
