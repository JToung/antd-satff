import React, { Component } from 'react'
import PropTypes from 'prop-types'


import {
  Form,
  Input
} from 'antd'

const Item = Form.Item

/* 
添加/修改分类的Form组件
*/
class AddUpdateForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    publisherName: PropTypes.string,
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { publisherName } = this.props
    return (
      <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="运营商ID">
                <span className="ant-form-text">{operator.data._id}</span>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="运营商名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入运营商名' }],
                })(<Input placeholder={operator.data.operatorName} />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="系统分成">
                <span className="ant-form-text">在合约表（运营商约束）中</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="运行状态">
                {getFieldDecorator('states', {
                  rules: [{ required: true, message: '请选择运行状态' }],
                })(
                  <Select placeholder="请选择运行状态">
                    <Option value="1">正在运行中</Option>
                    <Option value="0">已停止运行</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="入驻时间">
                <span className="ant-form-text">{operator.data.operatorAddTime}</span>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item name="operatorProof" label="营销凭证" valuePropName="fileList">
                {getFieldDecorator('operatorProof', {
                  rules: [{ required: true, message: '请上传凭证' }],
                })(
                  <Upload name="operatorProof" action="/upload.do" listType="picture">
                    <Button>
                      <UploadOutlined /> 请上传营销凭证
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="运营商简介">
                {getFieldDecorator('introduction', {
                  rules: [
                    {
                      required: true,
                      message: '请输入运营商简介',
                    },
                  ],
                })(
                  <Input.TextArea
                    style={{ minHeight: 32 }}
                    placeholder={operator.data.operatorIntroduction}
                    rows={2}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="运营商介绍">
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: '请输入运营商介绍',
                    },
                  ],
                })(
                  <Input.TextArea
                    style={{ minHeight: 32 }}
                    placeholder={operator.data.content}
                    rows={4}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="运营商法人">
                {getFieldDecorator('legalPerson', {
                  rules: [{ required: true, message: '请输入运营商法人名' }],
                })(<Input placeholder={operator.data.legalPerson} />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人身份信息">
                {getFieldDecorator('legalPersonIdNo', {
                  rules: [{ required: true, message: '请输入法人身份信息' }],
                })(<Input placeholder={operator.data.legalPersonIdNo} />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人联系方式">
                {getFieldDecorator('legalPersonPhone', {
                  rules: [{ required: true, message: '请输入法人联系方式' }],
                })(<Input placeholder={operator.data.legalPersonPhone} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item name="legalPersonPhoto" label="法人证件照" valuePropName="fileList">
                {getFieldDecorator('operatorProof', {
                  rules: [{ required: true, message: '请上传法人证件照' }],
                })(
                  <Upload name="legalPersonPhoto" action="/upload.do" listType="picture">
                    <Button>
                      <UploadOutlined /> 请上传法人证件照
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人邮箱">
                {getFieldDecorator('legalPersonEmail', {
                  rules: [{ required: true, message: '请输入法人邮箱' }],
                })(<Input placeholder={operator.data.legalPersonEmail} />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人地址">
                {getFieldDecorator('legalPersonAdress', {
                  rules: [{ required: true, message: '请输入法人地址' }],
                })(<Input placeholder={operator.data.legalPersonAdress} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
    )
  }
}

export default Form.create()(AddUpdateForm)
