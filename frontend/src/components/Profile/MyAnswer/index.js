import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import axios from 'axios';
import Loading from '../../common/Loading';
import { useSelector } from 'react-redux';
import { URL, token } from '../../../const/index';
import moment from 'moment';
import { Modal, Pagination, message, Tag, Col, Row, Form, Input, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const cx = cn.bind(styles);

const MyAnswer = () => {
	const [listPost, setListPost] = useState();
	const userId = useSelector(state => state.user.userId);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(5);
	const [orderBy, setOrderBy] = useState('upVoteNum');
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
	const [reload, setReload] = useState(false);
	const [postSelected, setPostSelected] = useState();
	const history = useHistory();
	const [visibleEditModal, setVisibleEditModal] = useState(false);

	useEffect(() => {
		getListPost();
	}, [page, orderBy, reload]);

	const onFinishEditTag = async (values) => {
		const bodyParam = {
			"token": token,
			"answerId": postSelected.Id,
			"answerDetail": values.answerDetail,

		}
		try {
			const res = await axios.post(`${URL}/answer/edit-answer`, bodyParam);
			if (res.status === 200) {
				console.log(res);
				message.success("Edit answer success!");
				setVisibleEditModal(false);
				setReload(!reload);
			}
		} catch (err) {
			console.log(err.response);
		}

	}

	const onFinishFailedEditTag = (values) => {
		console.log(values);
	}

	const getListPost = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/answer/list?page=${page}&perPage=${perPage}&userId=${userId}&orderBy=${orderBy}&orderType=desc`);

			if (res.status === 200) {
				console.log(res);
				setListPost(res.data.result.data);
				setTotal(res.data.result.pagination.total);
				setLoading(false);
			}

		} catch (err) {
			console.log(err.response);
		}
	}


	const handleDeletePost = async () => {
		const bodyParam = {
			token: token,
			answerId: postSelected.Id,
		}
		try {
			const res = await axios.post(`${URL}/answer/delete-answer`, bodyParam);
			if (res.status === 200) {
				console.log(res);
				message.success("Deleted!");
				setVisibleDeleteModal(false);
				setReload(!reload);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div div className={cx("myPost")}>
					<div className={cx("top")}>
						<div className={cx("title")}>{listPost.length} answers</div>
						<div className={cx("groupButton")}>
							<div
								className={cx("button", orderBy === "upVoteNum" && "active")}
								onClick={() => setOrderBy("upVoteNum")}
							>Votes</div>
							<div
								className={cx("button", orderBy === "date" && "active")}
								onClick={() => setOrderBy("date")}
							>Newest</div>
						</div>
					</div>
					<div className={cx("list")}>
						{listPost.length > 0 ? listPost.map((post, id) => (
							<div className={cx("oneItem")} key={id}>
								<div className={cx("topTitle")}>
									<div className={cx("itemTitle")} onClick={() => history.push(`/post-detail/${post.Id}`)}>
										{post.postDetail.postName.length > 100 ? post.postName.postName.slice(0, 100) : post.postDetail.postName}
									</div>
									<div className={cx('topTitle-right')}>
										<div
											className={cx("edit")}
											onClick={() => {
												setPostSelected(post);
												setVisibleEditModal(true);
											}}
										>
											<EditOutlined /> Edit
										</div>
										<div className={cx("delete")}
											onClick={() => {
												setPostSelected(post);
												setVisibleDeleteModal(true)
											}}>
											<DeleteOutlined /> Delete
										</div>
									</div>
								</div>
								<div className={cx("bottom")}>
									<div>
										{post.postDetail.postTags.map((it, idx) => (<Tag color="geekblue" key={idx}>{it.tagName}</Tag>))}
									</div>
									<div className={cx("time")}>
										{moment(post.postDetail.date).format('MMMM Do YYYY hh:mm:ss a')}
									</div>
								</div>
								<div className={cx("topItem")}>
									<div className={cx('topItem-left')}>
										<div className={cx("answer")}>{post.upVoteNum} up votes</div>
										<div className={cx("view", "answer")}>{post.downVoteNum} down votes</div>
									</div>
								</div>
								<div className={cx("answerDetail")}>
									<Row>
										<Col span={1}>
											<div className={cx("vertical")}></div>
										</Col>
										<Col span={18}>
											<div className={cx("content")}>
												{/* <ReactMarkdown> */}
												{post.answerDetail.slice(0, 200)}
												{/* </ReactMarkdown> */}
											</div>
											<div>
												<a href={`/post-detail/${post.postDetail.Id}#${post.Id}`}>View more</a>
											</div>
										</Col>
										<Col span={4} offset={1}>
											<div style={{ marginTop: '10px', color: 'rgba(0, 0, 0, 0.4)' }}>
												{moment(post.date).format('MMMM Do YYYY hh:mm:ss a')}
											</div>
										</Col>
									</Row>
								</div>
							</div>
						)) : (<></>)
						}
					</div>

					<Modal
						title="Edit answer"
						visible={visibleEditModal}
						footer={null}
						onCancel={() => setVisibleEditModal(false)}
						width={600}
					>
						<Form
							name="basic"
							onFinish={onFinishEditTag}
							onFinishFailed={onFinishFailedEditTag}
							layout="vertical"
							style={{ padding: '0px 30px' }}
							initialValues={{
								answerDetail: postSelected?.answerDetail,
							}}
						>
							<Form.Item
								label="Answer detail"
								name="answerDetail"
								rules={[{ required: true, message: 'Please input answer!' }]}
							>
								<Input.TextArea maxLength={500} showCount rows={10} />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">Edit</Button>
							</Form.Item>
						</Form>
					</Modal>

					<Modal
						title="Delete answer"
						visible={visibleDeleteModal}
						onOk={handleDeletePost}
						okText="Delete"
						onCancel={() => setVisibleDeleteModal(false)}
						width={360}
					>
						<div>Do you want to delete this answer?</div>
					</Modal>

					{listPost.length > 0 ? (<div style={{ textAlign: 'right', marginTop: '20px' }}>
						<Pagination
							defaultPageSize={perPage}
							defaultCurrent={page}
							total={total}
							onChange={(page) => setPage(page)}
						/>
					</div>) : (<></>)
					}
				</div>
			)}
		</>
	)
}

export default MyAnswer;