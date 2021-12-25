import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import axios from 'axios';
import Loading from '../../common/Loading';
import { useSelector } from 'react-redux';
import { URL, token } from '../../../const/index';
import moment from 'moment';
import { Modal, Pagination, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const cx = cn.bind(styles);

const MyPost = () => {
	const [listPost, setListPost] = useState();
	const userId = useSelector(state => state.user.userId);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(5);
	const [orderBy, setOrderBy] = useState('viewNum');
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
						<div className={cx("title")}>{listPost.length} posts</div>
						<div className={cx("groupButton")}>
							<div
								className={cx("button", orderBy === "viewNum" && "active")}
								onClick={() => setOrderBy("viewNum")}
							>Views</div>
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
								<div className={cx("topItem")}>
									<div className={cx('topItem-left')}>
										<div className={cx("answer")}>{post.numAnswer} answers</div>
										<div>{post.upVoteNum} votes</div>
										<div className={cx("view")}>{post.viewNum} views</div>
										<div>0 likes</div>
									</div>
									<div className={cx('topItem-right')}>
										<div
											className={cx("edit")}
											onClick={() => {
												setPostSelected(post)
												history.push({
												pathname: '/posts/edit-post',
												state: { postSelected: post }
											})}}
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
								<div className={cx("itemTitle")}>
									{post.postName.length > 100 ? post.postName.slice(0, 100) : post.postName}
								</div>
								<div className={cx("bottom")}>
									<div className={cx("content")}>
										{post.postDetail.length > 100 ? post.postDetail.slice(0, 100) : post.postDetail}
									</div>
									<div className={cx("time")}>
										{moment(post.date).format('MMMM Do YYYY, h:mm:ss a')}
									</div>
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

export default MyPost;