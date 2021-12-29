import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import axios from 'axios';
import Loading from '../../common/Loading';
import { useSelector } from 'react-redux';
import { URL, token } from '../../../const/index';
import moment from 'moment';
import { Modal, Pagination, message, Tag, Col, Row } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const cx = cn.bind(styles);
const text = `I accidentally committed the wrong files to Git, but didn't
push the commit to the server yet.
How can I undo those commits from the local repository?
The only way seems to be to copy the edits in some kind of
GUI text editor, then wipe the whole local clone, then re-clone the repository, 
then re-applying the edits. However,`

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

	useEffect(() => {
		getListPost();
	}, [page, orderBy, reload]);

	const getListPost = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/post/list?userId=${userId}&page=${page}&perPage=${perPage}&orderBy=${orderBy}&orderType=desc`);

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
			postId: postSelected.Id,
		}
		try {
			const res = await axios.post(`${URL}/post/delete-post`, bodyParam);
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
										{post.postName.length > 100 ? post.postName.slice(0, 100) : post.postName}
									</div>
									<div className={cx('topTitle-right')}>
										<div
											className={cx("edit")}
											onClick={() => {
												setPostSelected(post)
												history.push({
													pathname: '/posts/edit-post',
													state: { postSelected: post }
												})
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
										{post.postTags?.map((it, idx) => (<Tag color="geekblue" key={idx}>{it.tagName}</Tag>))}
									</div>
									<div className={cx("time")}>
										{moment(post.date).format('MMMM Do YYYY hh:mm:ss a')}
									</div>
								</div>
								<div className={cx("topItem")}>
									<div className={cx('topItem-left')}>
										<div className={cx("answer")}>{post.upVoteNum} up votes</div>
										<div className={cx("view", "answer")}>{post.upVoteNum} down votes</div>
									</div>
								</div>
								<div className={cx("answerDetail")}>
									<Row>
										<Col span={1}>
											<div className={cx("vertical")}></div>
										</Col>
										<Col span={18}>
											<div className={cx("content")}>
												{text.slice(0, 200)}
											</div>
											<div>
												<a href={`/post-detail/${1}/#${2}`}>View more</a>
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
						title="Delete post"
						visible={visibleDeleteModal}
						onOk={handleDeletePost}
						okText="Delete"
						onCancel={() => setVisibleDeleteModal(false)}
						width={360}
					>
						<div>Do you want to delete this post?</div>
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