import React from 'react';
import styles from './index.module.scss';
import cn from "classnames/bind";
import backIcon from "../../../../images/icons/back-button.png";
import { Link, useHistory } from "react-router-dom";

const cx = cn.bind(styles);

const HeaderLogin = (props) => {
    const history = useHistory();

    return (
        <div className={cx("header")}>
            <div className={cx("container")} style={{ padding: '16px 0px' }}>
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 600,
                    }}
                >
                    <img src={backIcon} alt="back" width={24} />&nbsp;&nbsp;
                    <span style={{ color: "#000000" }}>Homepage</span>
                </Link>
                <div
                    className={cx("btn")}
                    onClick={() => history.push(props.isLogin ? "/sign-up" : "/sign-in")}
                >
                    {props.isLogin ? "sign up" : "sign in"}
                </div>
            </div>
        </div>
    )
}

export default HeaderLogin;

