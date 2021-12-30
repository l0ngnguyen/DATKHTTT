import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import Layout from '../common/Layout';
import { Avatar, Card, Col, Input, Row } from 'antd';
import axios from 'axios';
import { URL } from '../../const/index';
import Loading from '../common/Loading/index';
import moment from 'moment';

const cx = cn.bind(styles);

const Author = () => {
	const [orderBy, setOrderBy] = useState('numPost');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [orderType, setOrderType] = useState("desc");
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState();

	useEffect(() => {
		getUser();
	}, [orderBy]);

	const getUser = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/user/list?page=${page}&perPage=${perPage}&orderBy=${orderBy}&orderType=${orderType}`);
			if (res.status === 200) {
				console.log(res);
				setLoading(false);
				setUserData(res.data.result.data);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	return (
		<Layout>
			<div className={cx("admin")}>
				<div className={cx("container")}>
					<div className={cx("header")}>
						<div className={cx("left")}>
							<div className={cx("title")}>Users</div>
							<div className={cx("subTitle")}>{userData?.length} accounts</div>
						</div>
						<div className={cx("filterButton")}>
							<div
								className={cx("filterButton-left", orderBy === "numPost" && "active")}
								onClick={() => setOrderBy("numPost")}
							>Most post</div>
							<div
								className={cx("filterButton-middle", orderBy === "date" && "active")}
								onClick={() => setOrderBy("date")}
							>New user</div>
						</div>
						{/* <div className={cx("right")}>
							<Input.Search
								placeholder="Find by tag name"
								allowClear
								// onSearch={}
								className={cx("search")}
								size="large"
							/>
						</div> */}
					</div>

					{loading ? (<Loading />) : (
						<div className={cx("body")}>
							<Row gutter={[32, 32]}>
								{userData?.map((item, idx) => (
									<Col span={6} key={idx}>
										<Card className={cx("card")}>
											<Row>
												<Col span={6}>
													<Avatar src={`http://localhost:3001/${item.avatarLink}`} size="large" />
												</Col>
												<Col span={1}></Col>
												<Col span={17}>
													<b>{item.userName}</b>
													<div style={{ color: "#8C8C8C", fontSize: '14px' }}>
														{item.location ? item.location : "Viet Nam"}
													</div>
												</Col>
											</Row>
											<br />
											<div>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<div>Joined in:</div>
													<b style={{ color: '#8C8C8C' }}>{moment(item.date).format('ll')}</b>
												</div>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<div>Up votes:</div>
													<b style={{ color: '#52C41A' }}>
														{item.numUpVotePost + item.numUpVoteAnswer}
													</b>
												</div>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<div>Number of post:</div>
													<b style={{ color: '#007cf0' }}>{item.numPost}</b>
												</div>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<div>Number of answer:</div>
													<b>{item.numAnswer}</b>
												</div>
											</div>
										</Card>
									</Col>
								))}
							</Row>
						</div>
					)}
				</div>
			</div>
		</Layout>
	)
}

export default Author;