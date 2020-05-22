import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class EditableTagGroupItem extends React.Component {
  state = {
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
    inputVisible: false,
    inputValue: '',
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={index !== 0} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}

ReactDOM.render(<EditableTagGroup />, mountNode);

const columns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: '任务进行的阶段',
    key: 'stage',
    dataIndex: 'stage',
    render: stage => (
      <span>
        {stage.map(tag => {
          return (
            <Tag color="geekblue" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: '收取的比例',
    dataIndex: 'receivable',
    key: 'receivable',
  },
  {
    title: '操作',
    key: 'action',
    render: (category, data) => (
      <span>
        <LinkButton
          onClick={() => {
            // this.category = category // 保存当前分类, 其它地方都可以读取到
            // this.setState({ showStatus: 2})
            this.setEditorVisible(true);
          }}
        >
          修改
        </LinkButton>
        <Modal
          title="任务中断要求修改"
          visible={this.state.editorVisible}
          onOk={this.handleEditorOk}
          onCancel={this.handleEditorCancel}
        >
          <Form layout="vertical">
            <Form.Item label="ID">
              <span className="ant-form-text">{operator.data._id}</span>
            </Form.Item>
            <Form.Item label="收取的比例">
              {getFieldDecorator('receivable', {
                rules: [{ required: true, message: '请输入收取的比例' }],
              })(<Input placeholder="1" />)}
            </Form.Item>
            <Form.Item label="任务进行的阶段">
              {console.log(data)}
              {data.map()}
              {stage.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag key={tag} closable={index !== 0} onClose={() => this.handleClose(tag)}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm(data.stage)}
                  onPressEnter={this.handleInputConfirm(data.stage)}
                />
              )}
              {!inputVisible && (
                <Tag className="site-tag-plus" onClick={this.showInput}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Form.Item>
          </Form>
        </Modal>
        <LinkButton
          onClick={() => {
            // this.deleteCategorys(category);
            this.setDeleteVisible(true);
          }}
        >
          删除
        </LinkButton>
        <Modal
          title="任务中断要求删除"
          visible={this.state.deleteVisible}
          onOk={this.handleDeleteOk}
          onCancel={this.handleDeleteCancel}
        >
          <p>是否确认删除</p>
        </Modal>
      </span>
    ),
  },
];