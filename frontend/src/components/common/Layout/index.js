import React from 'react';
import Footer from '../Footer';
import Header from '../Header';
import styles from './index.module.scss';
import cn from "classnames/bind";

const cx = cn.bind(styles);

const Layout = (props) => {
    return (
        <div className={cx("layout")}>
            <Header />
            <div>
                {props.children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout;

