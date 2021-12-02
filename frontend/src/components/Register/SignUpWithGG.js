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
import { useSelector, useDispatch } from 'react-redux';
import { changeUserId } from '../../features/user/userSlice';

const cx = cn.bind(styles);

const SignUpModal = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const email = useSelector(state => state.user.email);
    const accessToken = window.localStorage.getItem("accessTokenSO");

    function setCookie(cName, cValue, expHours) {
        let date = new Date();
        date.setTime(date.getTime() + (expHours * 60 * 60 * 1000));
        const expires = "Expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue;
        document.cookie = "path=/";
        document.cookie = "HttpOnly";
        document.cookie = expires;
    }


    const onFinish = async (value) => {
        const data = {
            'userName': value.username,
            'password': value.password,
            'email': email,
            'accessToken': accessToken,
            "avatarLink": "",
            "gender": true,
            "facebookLink": "",
            "githubLink": "",
            "location": "",
            "description": "",
            "role": 1,
            "googleID": "",
        }

        try {
            const res = await axios.post(`http://localhost:3001/auth/sign-up`, data);
            if (res.status === 200) {
                window.localStorage.setItem("accessTokenSO", res.data.accessToken);
                setCookie("refreshToken", res.data.accessToken, 5);
                dispatch(changeUserId(res.data.userId));
                history.push("/");
            }
        } catch (err) {
            console.log(err);
            console.log(err.response);
            message.error("Username already exists!")
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <HeaderLogin isLogin={false} />
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
                        <div>Complete the fields below to continue logging in with email "{email}"</div>
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

