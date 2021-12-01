import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss";
import cn from "classnames/bind";
import logoText from "../../../../images/logo-text.png";
import searchIcon from "../../../../images/icons/search.png";
import avatar from "../../../../images/icons/user.png";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

import {
    Link,
} from "react-router-dom";
import { changeUserId } from '../../../../features/user/userSlice';

const cx = cn.bind(styles);

const HeaderDestop = () => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.user.userId);
    const userInfo = useSelector(state => state.user.info);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/user/id/${userId}`);
            if (res.status === 200) {
                console.log(res);
                dispatch(changeUserId(res.data));
            }
        } catch (err) {
            console.log(err.response);
        }
    }

    return (
        <div className={cx("header")}>
            <div className={cx("container")}>
                <div className={cx("left")}>
                    <img alt="logo" src={logoText} height={50} />
                </div>
                <div className={cx("middle")}>
                    <input placeholder="Search..." className={cx("search")} />
                    <img alt="search-icon" src={searchIcon} height={18} />
                </div>
                <div className={cx("menu")}>
                    <Link to="/" className={cx("item")}>Home</Link>
                    <Link to="/" className={cx("item")}>Post</Link>
                    <Link to="/" className={cx("item")}>Tags</Link>
                    <Link to="/" className={cx("item")}>User</Link>
                    {userId ? (
                        <div>
                            <img src={avatar} alt="avatar" width={24} />

                        </div>
                    ) : (
                        <span>
                            <Link to="/sign-in" className={cx("button", "item")}>Sign in</Link>
                            <Link to="/sign-up" className={cx("button1", "item")}>Sign up</Link>
                        </span>)}
                </div>
            </div >
        </div >
    )
}

export default HeaderDestop;

