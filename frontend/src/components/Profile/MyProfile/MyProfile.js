import React from 'react';
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from "./MyProfile.module.scss";
import cn from "classnames/bind";
import { useSelector } from 'react-redux';

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
                                    title="Reputation"
                                    value={100289}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Answers"
                                    value={960}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Up votes"
                                    value={11280}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Down votes"
                                    value={330}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ArrowDownOutlined />}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className={cx("title")}>Badges</div>
                    <div className={cx("card")}>
                        Coming soon!
                    </div>
                </Col>
                <Col span={16}>
                    <div className={cx("title")}>About</div>
                    <div className={cx("card")} style={{ fontSize: '16px' }}>
                        <div><b>Username: </b> {userInfo.userName}</div>
                        <div><b>Email: </b> {userInfo.email}</div>
                        <div><b>Location: </b> {userInfo.location}</div>
                        <div><b>Github link: </b> {userInfo.githubLink}</div>
                        <div><b>Facebook link: </b> {userInfo.facebookLink}</div>
                        <div><b>Description: </b> {userInfo.description}</div>
                    </div>
                    <div className={cx("title")}>Top answers</div>
                    <div className={cx("card")}>
                        You hasn’t answered yet
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default MyProfile;