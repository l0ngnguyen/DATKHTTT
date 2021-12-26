import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss";
import cn from "classnames/bind";
import logoText from "../../../../images/logo-text.png";
import searchIcon from "../../../../images/icons/search.png";
import avatar from "../../../../images/icons/user.png";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { Menu, Dropdown, Modal, message } from 'antd';

import {
    Link,
} from "react-router-dom";
import { useHistory } from 'react-router';
import { changeUserId, changeUserInfo } from '../../../../features/user/userSlice';

const cx = cn.bind(styles);

const HeaderDestop = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const userId = useSelector((state) => state.user.userId);
    const userInfo = useSelector(state => state.user.info);
    const [data, setData] = useState(userInfo);
    const [logged, setLogged] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [keySearch, setKeySearch] = useState();

    useEffect(() => {
        getUserData();
        setLogged(window.localStorage.getItem("accessTokenSO"));
    }, [refresh]);

    const getUserData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/user/id/${userId}`);
            if (res.status === 200) {
                dispatch(changeUserInfo(res.data.result));
                setData(res.data.result);
            }
        } catch (err) {
            console.log(err.response);
        }
    }

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true
            const res = await axios.post(`http://localhost:3001/auth/logout`, { withCredentials: true });
            if (res.status === 200) {
                console.log(res);
                window.localStorage.setItem("accessTokenSO", "");
                history.push("/");
                dispatch(changeUserId());
                dispatch(changeUserInfo());
                setRefresh(true);
                message.success("Sign out success!");
            }
        } catch (err) {
            console.log(err.response);
            message.error("Sign out fail!")
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = (e) => {
        setKeySearch(e.target.value);
        if (e.keyCode === 13) {
            console.log(e.target.value);
        }
    }

    const menuLogout = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.Item onClick={() => history.push('/profile')}>
                <span>My profile</span>
            </Menu.Item>
            <Menu.Item onClick={() => setIsModalVisible(true)}>
                <span>Sign out</span>
            </Menu.Item>
        </Menu>
    )

    return (
        <div className={cx("header")}>
            <div className={cx("container")}>
                <div className={cx("left")} onClick={() => history.push("/")}>
                    <img alt="logo" src={logoText} height={50} />
                </div>
                <div className={cx("middle")}>
                    <input
                        placeholder="Search..."
                        className={cx("search")}
                        onKeyUp={(e) => handleSearch(e)}
                    />
                    <img alt="search-icon" src={searchIcon} height={18} />
                </div>
                <div className={cx("menu")}>
                    <Link to="/" className={cx("item")}>Home</Link>
                    <Link to="/posts" className={cx("item")}>Posts</Link>
                    <Link to="/tags" className={cx("item")}>Tags</Link>
                    <Link to="/" className={cx("item")}>Author</Link>
                    {logged ? (
                        <Dropdown overlay={menuLogout}>
                            <div style={{ cursor: 'pointer' }}>
                                <img
                                    src={`http://localhost:3001/${userInfo?.avatarLink}`}
                                    alt="avatar"
                                    width={24}
                                />
                                <span style={{ color: "#007CF0", paddingLeft: '8px' }}>{data && data.userName}</span>
                            </div>
                        </Dropdown>
                    ) : (
                        <span>
                            <Link to="/sign-in" className={cx("button", "item")}>Sign in</Link>
                            <Link to="/sign-up" className={cx("button1", "item")}>Sign up</Link>
                        </span>)}
                </div>
            </div >
            <Modal
                visible={isModalVisible}
                onOk={handleLogout}
                onCancel={handleCancel}
                width={300}
            >
                <div className={cx("modalBody")}>
                    <div className={cx("title")}>Do you want to sign out?</div>
                </div>
            </Modal>
        </div >
    )
}

export default HeaderDestop;

