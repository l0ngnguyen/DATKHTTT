import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from "classnames/bind";
import HeaderLogin from '../common/Header/HeaderDestop/HeaderLogin';
import logo from "../../images/logo.png";
import {
    Form,
    Input,
    Checkbox,
    Button,
    Divider,
    message,
    Modal,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';

const cx = cn.bind(styles);

const SignUpModal = () => {
    const history = useHistory();

    const onFinish = async (value) => {
        const data = {
            'userName': value.username,
            'email': value.email,
            'password': value.password,
        }

        try {
            const res = await axios.post(`http://localhost:3001/auth/sign-up/send-otp`, {
                'email': data.email,
            });
            if (res.status === 200) {

            }
        } catch (err) {
            console.log(err);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className={cx("container")}>
                <div className={cx("login")}>
                    <div className={cx("top")}>
                        <img src={logo} alt="logo" width={100} />
                        <div className={cx("title")}>
                            <span>Welcome to</span><br />
                            <span>stack <b>overflow</b></span>
                        </div>
                    </div>
                    <div className={cx("form")}>
                        <div><b>You can skip this step and sign up now!</b></div>
                        <Form
                            name="basic"
                            initialValues={{ remember: true, username: "", password: "" }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            className={cx("form")}
                            size="large"
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input placeholder="Username" prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[
                                    { type: 'email' },
                                    { required: true, message: 'Please input your username!' }
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>

                            <Form.Item >
                                <Button
                                    htmlType="submit"
                                    className={cx("button")}
                                >
                                    SIGN UP
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUpModal;

