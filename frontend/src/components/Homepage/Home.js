import React, { useEffect, useState } from 'react';
import styles from "./Home.module.scss";
import cn from "classnames/bind";
import axios from 'axios';

const cx = cn.bind(styles);

const Home = () => {

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/user/id/2`);
            if (res.status === 200) {
                console.log(res);
            }
        } catch (err) {
            console.log(err);
        }
    }

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

