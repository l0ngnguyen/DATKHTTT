import React, { useState } from 'react';
import styles from "./Home.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

const Home = () => {

    return (
        <div className={cx("container")}>
            <div className={cx("homepage")}>
                <div className={cx("first")}>
                    <span className={cx("where-all")}>Where all</span>
                    <span className={cx("question")}>question</span>
                </div>
                <div className={cx("have")}>have</div>
                <div className={cx("answer")}>
                    answer .
                </div>
                <div className={cx("groupButton")}>
                    <div className={cx("button")}>START</div>
                    <div className={cx("button1")}>CREATE POST</div>
                </div>
                {/* <div>lorem is perisflksdjfksdjfksd</div> */}
            </div>
        </div>
    )
}

export default Home;

