import React from 'react';
import styles from "./index.module.scss";
import cn from "classnames/bind";
import logoText from "../../../../images/logo-text.png";
import searchIcon from "../../../../images/icons/search.png";
import {
    Link,
} from "react-router-dom";

const cx = cn.bind(styles);

const HeaderDestop = () => {
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
                    <Link to="/sign-in" className={cx("button", "item")}>Sign in</Link>
                    <Link to="/sign-up" className={cx("button1", "item")}>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default HeaderDestop;

