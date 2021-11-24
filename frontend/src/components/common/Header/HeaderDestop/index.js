import React from 'react';
import styles from "./index.module.scss";
import cn from "classnames/bind";
import logoText from "../../../../images/logo-text.png";
import searchIcon from "../../../../images/icons/search.png";

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
                    <span className={cx("item")}>Home</span>
                    <span className={cx("item")}>Post</span>
                    <span className={cx("item")}>Tags</span>
                    <span className={cx("item")}>User</span>
                    <span className={cx("button", "item")}>Sign in</span>
                    <span className={cx("button1", "item")}>Sign up</span>
                </div>
            </div>
        </div>
    )
}

export default HeaderDestop;

