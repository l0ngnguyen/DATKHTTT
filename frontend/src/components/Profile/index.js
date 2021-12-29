import React, { useState } from 'react';
import Layout from '../common/Layout';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import {
    Avatar,
    Modal,
    Button,
    Form, Input,
    message,
    Tooltip
} from 'antd';
import {
    TeamOutlined,
    EnvironmentOutlined,
    EditOutlined,
    PlusCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import MyProfile from './MyProfile/MyProfile';
import MyPost from './MyPost';
import MyAnswer from './MyAnswer';
import FavoritePost from './FavoritePost';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { changeUserInfo } from '../../features/user/userSlice';
import YourTags from './Tags';
import { useHistory, useLocation } from 'react-router';

const cx = cn.bind(styles);

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { TextArea } = Input;

const link = [
    {
        title: 'Profile',
        path: 'profile',
        tab: 1,
        component: <MyProfile />,
    },
    {
        title: 'Posts',
        path: 'my-post',
        tab: 2,
        component: <MyPost />,
    },
    {
        title: 'Answers',
        path: 'my-answer',
        tab: 3,
        component: <MyAnswer />,
    },
    {
        title: 'Favorite posts',
        path: 'favorite-post',
        tab: 4,
        component: <FavoritePost />,
    },
    {
        title: 'Tags',
        path: 'tags',
        tab: 5,
        component: <YourTags />,
    }
];

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Profile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const query = useQuery();
    const [tabActive, setTabActive] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPasswordModal, setIsPasswordModal] = useState(false);
    const userInfo = useSelector(state => state.user.info);
    const [uploading, setUploading] = useState();
    const [visibleModalUploadAvatar, setVisibleModalUploadAvatar] = useState();
    const [avatar, setAvatar] = useState();

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = async (values) => {
        const token = window.localStorage.getItem("accessTokenSO");

        const bodyParams = {
            'token': token,
            'userName': values.username ? values.username : userInfo.userName,
            'gender': true,
            'facebookLink': values.facebookLink ? values.facebookLink : userInfo.facebookLink,
            'githubLink': values.githubLink ? values.githubLink : userInfo.githubLink,
            'location': values.location ? values.location : userInfo.location,
            'description': values.description ? values.description : userInfo.description,
        }
        try {
            const res = await axios.post(
                "http://localhost:3001/user/edit-profile",
                bodyParams
            );

            if (res.status === 200) {
                console.log(res);
                dispatch(changeUserInfo(res.data.user));
                message.success("Change profile success!");
                setIsModalVisible(false);
            }

        } catch (err) {
            console.log(err.response);
            message.error(err.response?.data?.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinishChangePassword = async (values) => {
        console.log(values);
        const token = window.localStorage.getItem("accessTokenSO");

        const bodyParams = {
            'token': token,
            'oldPassword': values.oldPassword,
            'newPassword': values.newPassword,
        }
        try {
            const res = await axios.post(
                "http://localhost:3001/user/edit-user/change-password",
                bodyParams
            );

            if (res.status === 200) {
                message.success("Change profile success!");
                setIsPasswordModal(false);
            }

        } catch (err) {
            console.log(err.response);
            message.error(err.response?.data?.message);
        }
    };

    const onFinishFailedChangePassword = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleUploadAvatar = async (e) => {
        setUploading(true);
        let url = "http://localhost:3001/user/upload-avatar";
        let file = e.target.files[0];
        console.log("avatar", file);
        let formData = new FormData();
        formData.append("avatar", file);
        axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((response) => {
            fnSuccess(response);
        }).catch((error) => {
            fnFail(error);
        });
    };

    const fnSuccess = (response) => {
        console.log(response);
        setAvatar(response.data.result);
        setUploading(false);
    };

    const fnFail = (error) => {
        console.log(error);
        message.error("Upload image fail!")
    };

    const changeAvatar = async () => {
        const token = window.localStorage.getItem("accessTokenSO");
        const bodyParams = {
            'token': token,
            'userName': userInfo.userName,
            'gender': true,
            'facebookLink': userInfo.facebookLink,
            'githubLink': userInfo.githubLink,
            'location': userInfo.location,
            'description': userInfo.description,
            'avatarLink': avatar,
        }
        try {
            const res = await axios.post(
                "http://localhost:3001/user/edit-profile",
                bodyParams
            );

            if (res.status === 200) {
                console.log(res);
                dispatch(changeUserInfo(res.data.user));
                message.success("Upload image success!");
                setVisibleModalUploadAvatar(false);
            }

        } catch (err) {
            console.log(err.response);
            message.error(err.response?.data?.message);
        }
    }

    return (
        <Layout>
            <div className={cx("container")}>
                <div className={cx("top")}>
                    <div className={cx("left")}>
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => setVisibleModalUploadAvatar(true)}
                        >
                            <Tooltip title="Click to upload new avatar">
                                {userInfo?.avatarLink ? (
                                    <img
                                        src={`http://localhost:3001/${userInfo.avatarLink}`}
                                        alt="avatar"
                                        width={120}
                                        height={120}
                                        style={{ borderRadius: '50%' }}
                                    />
                                ) : (
                                    <Avatar
                                        style={{
                                            backgroundColor: '#52C41A',
                                            width: '120px',
                                            height: '120px',
                                            textAlign: 'center',
                                        }}
                                    />
                                )}
                            </Tooltip>
                        </div>
                        <div className={cx("info")}>
                            <div className={cx("name")}>{userInfo.userName}</div>
                            <div className={cx("member")}>
                                <TeamOutlined /> Member in {moment(userInfo.date).format('LLL')}
                            </div>
                            <div className={cx("location")}>
                                <EnvironmentOutlined /> {userInfo.location}
                            </div>
                        </div>
                    </div>
                    <div className={cx("right")}>
                        <div
                            className={cx("button-outline")}
                            onClick={() => setIsModalVisible(true)}
                        >
                            <EditOutlined /> Edit profile
                        </div>
                        <div className={cx("button")} onClick={() => history.push("/posts/create-post")}>
                            <PlusCircleOutlined /> Create post
                        </div>
                    </div>
                </div>
                <div className={cx("tab-navigation")}>
                    {
                        link.map((item, ind) => (
                            <div
                                className={cx(
                                    "tab-navigation-item",
                                    item.path === query.get("tab") && "active",
                                )}
                                key={ind}
                                onClick={() => {
                                    setTabActive(item.tab);
                                    history.push(`/profile?tab=${item.path}`)
                                }}
                            >
                                {item.title}
                            </div>
                        ))
                    }
                </div>
                <div className={cx("body")}>
                    {query.get("tab")
                        ? link.filter((item, index) => item.path === query.get("tab"))[0].component
                        : (<MyProfile />)
                    }
                    {/* {tabActive === 1 ? (
                        <MyProfile />
                    ) : tabActive === 2 ? (
                        <MyPost />
                    ) : tabActive === 3 ? (
                        <MyAnswer />
                    ) : tabActive === 4 ? (
                        <FavoritePost />
                    ) : (
                        <YourTags />
                    )} */}
                </div>
            </div>
            <Modal
                title="Edit Profile"
                visible={isModalVisible}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
                autoComplete="off"
                width={720}
            >
                <Form
                    name="basic-1"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                    >
                        <Button onClick={() => setIsPasswordModal(true)}>
                            Change password
                        </Button>
                    </Form.Item>
                    {/* <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Button onClick={() => setIsPasswordModal(true)}>
                            Change email
                        </Button>
                    </Form.Item> */}
                    <Form.Item
                        label="Facebook link"
                        name="facebookLink"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Github link"
                        name="githubLink"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Location"
                        name="location"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button> &nbsp; &nbsp;
                        <Button onClick={handleCancel}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Change password"
                visible={isPasswordModal}
                footer={null}
                onCancel={() => setIsPasswordModal(false)}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={onFinishChangePassword}
                    onFinishFailed={onFinishFailedChangePassword}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Old password"
                        name="oldPassword"
                        rules={[{ required: true, message: 'Please input your old password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="New password"
                        name="newPassword"
                        rules={[{ required: true, message: 'Please input your new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button> &nbsp; &nbsp;
                        <Button onClick={() => setIsPasswordModal(false)}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Upload Avatar"
                visible={visibleModalUploadAvatar}
                footer={null}
                onCancel={() => setVisibleModalUploadAvatar(false)}
                width={300}
            >
                <input type="file" onChange={handleUploadAvatar} accept="image/*" />
                <br /><br /><br />
                <div>
                    <Button type="primary" onClick={changeAvatar} disabled={uploading}>
                        Submit
                    </Button>
                </div>
            </Modal>
        </Layout >
    )
}

export default Profile;

