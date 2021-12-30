import React, { useEffect, useState } from 'react';
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from "./MyProfile.module.scss";
import cn from "classnames/bind";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const cx = cn.bind(styles);

const MyProfile = () => {
	const userInfo = useSelector(state => state.user.info);
	
    return (
        <div className={cx("my-profile")}>
            <Row gutter={[24, 0]}>
                <Col span={8}>
                    <div className={cx("title")}>Statistic</div>
                    <div className={cx("card")}>
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Statistic
                                    title="Posts"
                                    value={userInfo?.numPost}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Answers"
                                    value={userInfo?.numAnswer}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Up votes"
                                    value={userInfo?.numUpVotePost + userInfo?.numUpVoteAnswer}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Down votes"
                                    value={userInfo?.numDownVotePost + userInfo?.numDownVoteAnswer}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ArrowDownOutlined />}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={16}>
                    <div className={cx("title")}>About</div>
                    <div className={cx("card")} style={{ fontSize: '16px' }}>
                        <div><b>Username: </b> {userInfo?.userName}</div>
                        <div><b>Email: </b> {userInfo?.email}</div>
                        <div><b>Location: </b> {userInfo?.location}</div>
                        <div><b>Github link: </b> {userInfo?.githubLink}</div>
                        <div><b>Facebook link: </b> {userInfo?.facebookLink}</div>
                        <div><b>Description: </b> {userInfo?.description}</div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default MyProfile;