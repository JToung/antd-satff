import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Modal, Icon, Form, Input, Row, Col, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
// import CreateCode from '@/utils/utils';
import Promptbox from '@/components/PromptBox/index';
import { RocketOutlined, UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { routerRedux } from 'dva/router';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login1, loading }) => ({
  login1,
  submitting: loading.effects['login1/login'],
}))
@withRouter
@Form.create()
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    code: '',
  };
  componentDidMount() {
    if (JSON.parse(localStorage.getItem('user')) != null) {
      if (
        (JSON.parse(localStorage.getItem('user')) != 'guest') &
        (JSON.parse(localStorage.getItem('user')).status != 'false')
      ) {
        this.props.history.push('/staff/home');
        console.log('status', JSON.parse(localStorage.getItem('user')).status);
      }
    }

    this.onGetCaptcha();
  }
  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login1/getCaptcha',
    }).then(res => {
      console.log('res', res);
      this.setState({ code: res });
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      this.props.form.validateFields((err, values) => {
        const payload = {
          ...values,
        };
        if (err) {
          console.log('err' + err);
          return;
        }
        console.log('参数', payload);
        dispatch({
          type: 'login1/login',
          payload,
        }).then(res => {
          console.log('payload res', res);
          if (res.status == 'ok') {
            message.success('登录成功');
            console.log('id', localStorage.getItem('userId'));
            this.props.history.push('/staff/home');
          } else if (res.status === 'false') {
            if (res.result === '验证码不正确') {
              message.error('验证码不正确，请重新输入！');
              this.onGetCaptcha();
            } else {
              message.error(res.result);
              this.onGetCaptcha();
            }
          }
        });
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const {
      login1,
      submitting,
      form: { getFieldDecorator, getFieldError },
    } = this.props;
    const { type, autoLogin, code } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login1.status === 'error' &&
              login1.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <Form.Item>
              {getFieldDecorator('account', {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.userName.required' }),
                  },
                ],
              })(<Input placeholder="请输入登录邮箱" size="large" prefix={<UserOutlined />} />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.password.required' }),
                  },
                ],
              })(
                <Input.Password placeholder="请输入密码" size="large" prefix={<UnlockOutlined />} />
              )}
            </Form.Item>
            <Form.Item>
              <Row gutter={8}>
                <Col span={15}>
                  {getFieldDecorator('code', {
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入验证码' }],
                  })(<Input placeholder="验证码" size="large" prefix={<RocketOutlined />} />)}
                </Col>
                <Col span={9}>
                  {/* 转HTML语言 */}
                  <div
                    onClick={this.onGetCaptcha}
                    dangerouslySetInnerHTML={{ __html: this.state.code.verify_image }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
