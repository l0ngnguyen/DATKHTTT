import React from 'react';
import styles from "./index.module.scss";
import cn from "classnames/bind";
import social from "../../../images/icons/social.svg";

const cx = cn.bind(styles);

const Footer = () => {
    return (
        <div className={cx("footer")}>
            <div className={cx("top")}>
                <div className={cx("container")}>
                    <div>
                        <p><b>CONTACT :</b></p>
                        <div>Email: da.tkhttt20211@soict.hust.edu.vn</div>
                        <p>Github: DATTHTTT.github.io</p>
                    </div>
                    <div>Address: Building B1 - HUST</div>
                    <img src={social} alt="social" />
                </div>
            </div>
            <div className={cx("bottom")}>
                <div className={cx("container")}>Copyright © 2021 Student of SOICT - HUST</div>
            </div>
        </div>
    )
}

export default Footer;

