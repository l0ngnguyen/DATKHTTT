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
import SignUpModal from './SignUpWithGG';
import { useSelector, useDispatch } from 'react-redux';
import { changeUserId, changeEmail } from '../../features/user/userSlice';

const cx = cn.bind(styles);
const { Search } = Input;
const URL = "localhost:3001";

const Register = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userData, setUserData] = useState();
    const [otpToken, setOtpToken] = useState();
    const [otp, setOtp] = useState();
    const [loadingCheckOtp, setLoadingCheckOtp] = useState(false);
    const [accessToken, setAccessToken] = useState();
    const [signUp, setSignUp] = useState(false);

    const responseGoogle = async (response) => {
        console.log(response);
        const data = {
            "idToken": response.tokenId,
        }

        try {
            const res = await axios.post(`http://localhost:3001/auth/sign-up-with-google`, data);
            if (res.status === 200) {
                console.log(res);
                window.localStorage.setItem("accessTokenSO", res.data.accessToken);
                if (res.data.exist) {
                    setCookie("refreshToken", res.data.accessToken, 5);
                    message.success(res.data.message);
                    dispatch(changeUserId(res.data.userId));
                    history.push("/");
                } else {
                    message.error(res.data.message);
                    dispatch(changeEmail(res.data.email));
                    history.push("/sign-up-with-google");
                }
            }
        } catch (err) {
            console.log(err.response);
        }
    }

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
            'email': value.email,
            'password': value.password,
        }
        setUserData(data);

        try {
            const res = await axios.post(`http://localhost:3001/auth/sign-up/send-otp`, {
                'email': data.email,
            });
            if (res.status === 200) {
                setIsModalVisible(true);
                setOtpToken(res.data.otpToken);
            }
        } catch (err) {
            console.log(err);
            console.log(err.response);
            message.error(err.response ? err.response?.data.message : "Error");
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const checkOtp = async (value) => {
        if (!value) {
            message.error("Please enter OTP!");
        }
        setLoadingCheckOtp(true);
        try {
            const res = await axios.post('http://localhost:3001/auth/sign-up/check-otp', {
                'otp': value,
                'otpToken': otpToken,
            });
            if (res.status === 200) {
                setLoadingCheckOtp(false);
                setIsModalVisible(false);
                let accTk = {
                    "accessToken": res.data.accessToken,
                    "avatarLink": "",
                    "gender": true,
                    "facebookLink": "",
                    "githubLink": "",
                    "location": "",
                    "description": "",
                    "role": 1,
                    "googleID": "" 
                };
                let data = { ...userData, ...accTk };
                console.log(data);
                try {
                    const signup = await axios.post('http://localhost:3001/auth/sign-up', data);
                    if (signup.status === 200) {
                        window.localStorage.setItem("accessTokenSO", signup.data.accessToken);
                        setCookie("refreshToken", signup.data.accessToken, 5);
                        dispatch(changeUserId(signup.data.userId));
                        history.push("/");
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err.response);
            message.error("Invalid!");
            setLoadingCheckOtp(false);
        }
    }

    return (
        <>
            <HeaderLogin isLogin={false} />
            {!signUp ? (
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
                                        NEXT
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Divider>or</Divider>
                            <GoogleLogin
                                clientId="846925863530-akeqgusm19k4dgicm7ncbl1jlsdi48m2.apps.googleusercontent.com"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                buttonText="Continue with Google"
                                style={{ width: "100%" }}
                            /><br /><br />
                            <div className={cx("subTitle")}>
                                <Link to="/sign-in">Sign in</Link> for Stack overflow account
                            </div>
                        </div>
                    </div>
                    <Modal
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        width={360}
                    >
                        <div className={cx("modalBody")}>
                            <div className={cx("title")}>Enter OTP code</div>
                            <div className={cx("subtitle")}>
                                Please check your email to get the OTP <br />
                                This OTP is valid for <b>3</b> minutes
                            </div>
                            <Search
                                placeholder="Enter OTP"
                                enterButton="SEND"
                                loading={loadingCheckOtp}
                                onSearch={(value) => checkOtp(value)}
                            />
                        </div>
                    </Modal>
                </div>
            ) : (
                <SignUpModal />
            )}
        </>
    )
}

export default Register;

