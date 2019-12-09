import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "./actions/authActions";
import 'antd/dist/antd.css';
import './index.css';
import axios from 'axios';
import md5 from 'md5';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Button,
} from 'antd';

const { Option } = Select;
const defaultBranches = [
  {
    value: 'branch-1',
    label: 'branch-1',
    children: [
      {
        value: 'department-1',
        label: 'department-1',
      },
      {
        value: 'department-2',
        label: 'department-2',
      },
      {
        value: 'department-3',
        label: 'department-3'
      }
    ],
  },
  {
    value: 'branch-2',
    label: 'branch-2',
    children: [
      {
        value: 'department-1',
        label: 'department-1',
      },
      {
        value: 'department-2',
        label: 'department-2',
      },
      {
        value: 'department-3',
        label: 'department-3'
      }
    ],
  },
];

class CreatAccount extends React.Component {
  static propTypes = {
    form: PropTypes.any,
  };
  constructor(props) {
    super(props)
    this.state = {
      userData: {
          "branches": [
              "branch-1",
              "department-2"
              ],
          "_id": "5ddcd8d65692222ca785b1f8",
          "prefix": 886,
          "email": "cas386@pitt.edu",
          "password": "$2a$10$47VR75cHvdWDuXJva2EXrO/tir4CoopUAH/Bv/Y2Pa7oljnBfpv3G",
          "nickname": "eden",
          "staffID": 1,
          "permission": 0,
          "phone": 341241324341,
          "grade": 0,
          "__v": 0
      }
    }
  }

  state = {
    confirmDirty: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        delete values.confirm;
        this.props.registerUser(values);
        // values.password = md5(values.password)
        // axios.post('/users', values)
        // .then(function (response) {
        //   console.log(response);
        //   // TODO: Clear form data here
        // })
        // .catch(function (error) {
        //   console.log(error);
        // });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 10,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="852">+852</Option>
      </Select>,
    );


    const { userData } = this.state;
    const { phone, branches, email, staffID, password, nickname } = this.state.userData;
    console.log("userData:", userData);
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Email">
          {getFieldDecorator('email', {
            initialValue: email,
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              }
            ],
          })(<Input disabled/>)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Password&nbsp;
              <Tooltip title="Should be combination of alphabets and numbers.">
              <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password placeholder="*****"/>)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password placeholder="*****" onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Name&nbsp;
              <Tooltip title="The real name on your staff card.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
          })(<Input placeholder={nickname}/>)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Staff ID&nbsp;
              <Tooltip title="The serial number on your staff card.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('staffID', {
            initialValue: staffID,
            rules: [{ required: true, message: 'Please input your staff ID!', whitespace: true }],
          })(<Input disabled/>)}
        </Form.Item>
        <Form.Item label="Branch / Department">
          {getFieldDecorator('branches', {
            initialValue: [branches[0], branches[1]],
            rules: [
              { type: 'array', required: true, message: 'Please select your branch & department!' },
            ],
          })(<Cascader options={defaultBranches} />)}
        </Form.Item>

        <Form.Item label="Permission">
          {getFieldDecorator('permission', {
            rules: [{ required: true, message: 'Please assign the user permission' }],
          })(
            <Select>
            </Select>,
          )}
        </Form.Item>


        <Form.Item label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(<Input addonBefore={prefixSelector} placeholder={phone} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

CreatAccount.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

// export default CreatAccount;
export default connect(
  mapStateToProps,
  { registerUser }
)(CreatAccount);
