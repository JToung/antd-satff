import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip, message } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { connect } from 'dva';

@connect(({ message, loading }) => ({
  message,
  loading: loading.effects['message/queryNews'],
  //model
}))
export default class GlobalHeaderRight extends PureComponent {
  state = {
    notices: [],
  };

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

    const { dispatch } = this.props;
    const params0 = {
      pt: localStorage.getItem('userId'),
      read: '0',
    };

    this.timer = setInterval(() => {
      dispatch({
        type: 'message/queryNews',
        payload: params0,
      }).then(res => {
        // console.log('res0', res);
        if (res.status == '1') {
          const { notices } = this.state;
          this.setState({ notices: [] }, () => {
            // console.log('测试', notices);
          });
          res.findresult.map(findResult => {
            const findResultD = {
              description:
                '对' +
                this.getDetailObject(findResult) +
                '对' +
                this.getAction(findResult) +
                '操作进行了' +
                this.getResult(findResult.result) +
                '处理',
              datetime: findResult.timestamp,
              title: this.getObject(findResult) + findResult.auditorName + '给你发了条消息',
              id: findResult._id,
              key: findResult._id,
              type: 'message',
            };
            const { notices } = this.state;
            this.setState({ notices: [...notices, findResultD] }, () => {
            });
          });
        }
      });
    }, 1500);
  }

  // 为了防止内存泄漏  清除定时器
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getNoticeData() {
    // const { notices = [] } = this.props;
    const { notices } = this.state;

    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      // console.log('newNotice', newNotice);
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  //获取发送标识
  getObject = val => {
    // console.log('val.object', val.object);
    switch (val.object) {
      case 'o':
        return '运营商';
        break;
      case 'p':
        return '平台管理员';
        break;
      case 'z':
        return '专才';
        break;
      case 'y':
        return '用户';
        break;
    }
  };

  getResult = val => {
    if (val == '1') {
      return '通过';
    } else if (val == '2') {
      return '拒绝';
    } else {
      return '';
    }
  };

  //获取动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
  getAction = val => {
    // console.log('action', val.action);
    switch (val.action) {
      case 't':
        return '提交审核';
        break;
      case 'q':
        return '确认审核';
        break;
      case 'p':
        return '派单';
        break;
      case 'j':
        return '接单';
        break;
    }
  };

  // 获取具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
  getDetailObject = val => {
    // console.log('detailObject', val.detailObject);
    switch (val.detailObject) {
      case 'c':
        return '品类';
        break;
      case 't':
        return '任务';
        break;
      case 'o':
        return '运营商';
        break;
      case 'z':
        return '专才';
        break;
      case 'I':
        return '单品';
        break;
      case 'log':
        return '工作日志';
        break;
      case 'p':
        return '分区';
        break;
      case 'g':
        return '工单';
        break;
    }
  };

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  getname = (currentUser) =>{
    if(currentUser.status == '1'){
      return currentUser.result.name
    }else{
      return currentUser.name
    }
  }

  getphoto = (currentUser) =>{
    if(currentUser.status == '1'){
      return currentUser.result.photo
    }else{
      return currentUser.photo
    }
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const { notices } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <NoticeIcon
          className={styles.action}
          count={notices.length}
          onItemClick={(item, tabProps) => {
            console.log(item, tabProps); // eslint-disable-line
            this.changeReadState(item, tabProps);
          }}
          loading={fetchingNotices}
          locale={{
            viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
            message: formatMessage({ id: 'component.globalHeader.message' }),
          }}
          onPopupVisibleChange={onNoticeVisibleChange}
          onViewMore={() => {
            this.props.history.push('/messages');
            location.reload(true);
          }}
          clearClose
        >
          <NoticeIcon.Tab
            count={unreadMsg.message}
            list={noticeData.message}
            title="message"
            showViewMore
          />
        </NoticeIcon>
        {this.getname(currentUser) ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={'http://47.103.1.149:7003'+ this.getphoto(currentUser)}
                alt="avatar"
              />
              <span className={styles.name}>{this.getname(currentUser)}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
