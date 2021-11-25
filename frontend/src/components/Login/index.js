import React from 'react';
import styles from './index.module.scss';
import cn from "classnames/bind";
import HeaderLogin from '../common/Header/HeaderDestop/HeaderLogin';
import logo from "../../images/logo.png";
import { Form, Input, Checkbox, Button, Divider, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';
import { Link, useHistory } from "react-router-dom";

const cx = cn.bind(styles);

const Login = () => {
    // const history = useHistory();

    const responseGoogle = async (response) => {
        console.log(response);
        // const data = {
        //     "idToken": response.tokenId,
        // }

        // try {
        //     const res = await axios.post(`${URL}/api/Account/gg-authenticate`, data);
        //     if (res.status === 200) {
        //         window.localStorage.setItem("token-lingo", res.data.token);
        //         message.success('Login success');
        //         history.push("/");
        //     }
        // } catch (err) {
        //     console.log(err.response);
        // }
    }


    const onFinish = (value) => {
        console.log('Success:', value);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <HeaderLogin />
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
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <div className={cx("forgot")}>Forgot password</div>

                            {/* <Form.Item name="remember" valuePropName="checked" >
                                <Checkbox>I agree to the <a>terms</a> and conditions</Checkbox>
                            </Form.Item> */}

                            <Form.Item >
                                <div htmlType="submit" className={cx("button")}>
                                    SIGN IN
                                </div>
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
        </>
    )
}

export default Login;

