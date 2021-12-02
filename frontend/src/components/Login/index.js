import React, { useState } from 'react';
import styles from './index.module.scss';
import cn from "classnames/bind";
import HeaderLogin from '../common/Header/HeaderDestop/HeaderLogin';
import logo from "../../images/logo.png";
import { Form, Input, Checkbox, Button, Divider, message, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { changeEmail, changeUserId } from '../../features/user/userSlice';

const cx = cn.bind(styles);
const { Search } = Input;

const Login = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [accessToken, setAccessToken] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingCheckOtp, setLoadingCheckOtp] = useState(false);
    const [otpToken, setOtpToken] = useState();
    const [step, setStep] = useState(1);

    const responseGoogle = async (response) => {
        const data = {
            "idToken": response.tokenId,
        }

        try {
            const res = await axios.post(`http://localhost:3001/auth/login-with-google`, data);
            if (res.status === 200) {
                console.log(res.data);
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
        console.log('Success:', value);
        let data = {
            "username": value.username,
            "password": value.password,
        }

        try {
            const res = await axios.post(`http://localhost:3001/auth/login`, data);
            if (res.status === 200) {
                console.log(res.data);
                window.localStorage.setItem("accessTokenSO", res.data.accessToken);
                setCookie("refreshToken", res.data.accessToken, 5);
                console.log("cookie", document.cookie)
                dispatch(changeUserId(res.data.userId));
                history.push("/");
                console.log(res);
            }
        } catch (err) {
            console.log(err);
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
        setLoadingCheckOtp(false);
    };

    const sendEmail = async (value) => {
        console.log(value);
        if (!value) {
            message.error("Please enter email");
        } else {
            setLoadingCheckOtp(true);
            try {
                const res = await axios.post(`http://localhost:3001/auth/forget-password/send-otp`, {
                    'email': value,
                });
                if (res.status === 200) {
                    setOtpToken(res.data.otpToken);
                    setStep(2);
                    console.log(res);
                }
            } catch (err) {
                console.log(err);
                console.log(err.response);
                message.error(err.response ? err.response?.data.message : "Error");
            }
            setLoadingCheckOtp(false);
        }
    }

    const checkOtp = async (value) => {
        if (!value) {
            message.error("Please enter OTP!");
        } else {
            setLoadingCheckOtp(true);
            try {
                const res = await axios.post('http://localhost:3001/auth/forget-password/check-otp', {
                    'otp': value,
                    'otpToken': otpToken,
                });
                if (res.status === 200) {
                    setAccessToken(res.data.accessToken);
                    setStep(3);
                }
            } catch (err) {
                console.log(err.response);
                message.error("Error!");
            }
            setLoadingCheckOtp(false);
        }
    }

    const sendNewPassword = async (value) => {
        if (!value) {
            message.error("Please new password!");
        } else {
            setLoadingCheckOtp(true);
            try {
                const res = await axios.post('http://localhost:3001/auth/forget-password/reset-password', {
                    'accessToken': accessToken,
                    'newPassword': value,
                });

                if (res.status === 200) {
                    console.log(res);
                    message.success("Login with your new password!");
                }
            } catch (err) {
                console.log(err.response);
                message.error("Error!");
            }
            setLoadingCheckOtp(false);
            setIsModalVisible(false);
        }
    }

    return (
        <>
            <HeaderLogin isLogin={true} />
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
                                <Input placeholder="Username or Email" prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <div
                                className={cx("forgot")}
                                onClick={() => setIsModalVisible(true)}
                            >Forgot password</div>

                            {/* <Form.Item name="remember" valuePropName="checked" >
                                <Checkbox>I agree to the <a>terms</a> and conditions</Checkbox>
                            </Form.Item> */}

                            <Form.Item >
                                <Button htmlType="submit" className={cx("button")}>
                                    SIGN IN
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
                            <Link to="/sign-up">Sign up</Link> for Stack overflow account
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Forgot password"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={360}
            >
                <div className={cx("modalBody")}>
                    {step === 1 ? (
                        <Search
                            placeholder="Enter your email"
                            enterButton="SEND"
                            loading={loadingCheckOtp}
                            defaultValue=""
                            onSearch={(value) => sendEmail(value)}
                        />
                    ) : step === 2 ? (
                        <div>
                            <div>OTP code is valid for <b>3</b> minutes</div><br />
                            <Search
                                placeholder="Enter OTP"
                                enterButton="SEND"
                                defaultValue=""
                                loading={loadingCheckOtp}
                                onSearch={(value) => checkOtp(value)}
                            />
                        </div>
                    ) : (
                    <div>
                        <div>Enter new password</div><br />
                        <Search
                            placeholder="Enter new password"
                            enterButton="SEND"
                            loading={loadingCheckOtp}
                            onSearch={(value) => sendNewPassword(value)}
                        />
                    </div>
                    )}
                </div>
            </Modal>
        </>
    )
}

export default Login;

