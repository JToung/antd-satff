/**
 * 上传头像/封面
 */
import React from 'react';
import { Form, Input,Upload,Icon,Modal} from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const { TextArea } = Input;
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
class AddMa extends React.Component {
  state = {
    value: '',
    previewVisible: false,
    previewImage: '',
    fileList:[],
  };
  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };
//场地图片
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
    console.log(file);
  };
  handleChange = ({ fileList }) => this.setState({ fileList:fileList });
  beforeUpload=(file)=>{
      this.setState(({
        fileList: [this.state.fileList, file],
      }));
    return false;
  }
  render() {
    const { previewVisible, previewImage, fileList ,value} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const props={fileList};
    return (
      <div>
        <Form>
          <FormItem label="单品图片">
            {getFieldDecorator('itemImages',{initialValue:this.props.tAccessory,valuePropName: 'itemImages'})
            (
              <div >
                <Upload name="itemImages" {...props}
                        listType="picture-card"
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        fileList={fileList}
                        accept=".jpg,.png,.gif,.jpeg"
                        beforeUpload={this.beforeUpload}
                >
                  {this.props.tAccessory >= 6 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            )}</FormItem>
            
    		{/* //这里是多个上传获取到的PhotoList     */}
          <FormItem {...formItemLayout} >
            {getFieldDecorator('file',{initialValue:this.props.tAccessory,valuePropName: 'file'})
            (
              <input type="hidden" name="img" multiple="multiple"  />
            )}</FormItem>
        </Form>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   const {csIntro,arPicture,tCsInfo,modelResult,tAccessory} = state.cusy;
//   return {csIntro,arPicture,tCsInfo,modelResult,tAccessory};
// }


export default Form.create()(AddMa);

