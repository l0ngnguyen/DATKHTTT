import React from 'react';
import styles from "./index.module.scss";
import cn from "classnames/bind";
import HeaderDestop from './HeaderDestop';

const cx = cn.bind(styles);

const Header = () => {
    return (
        <div>
            <HeaderDestop />
        </div>
    )
}

export default Header;

