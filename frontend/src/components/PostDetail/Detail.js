import React, { useEffect, useState } from 'react';
import styles from './PostDetail.module.scss';
import cn from 'classnames/bind';
import { Row, Col, Avatar } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	CheckCircleOutlined,
	CheckCircleTwoTone,
	HeartOutlined,
	HeartTwoTone,
	PlusCircleOutlined,
	HeartFilled,
} from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import { Tag } from 'antd';
import ReactMarkdown from 'react-markdown';
import { URL } from '../../const/index';
import axios from "axios";
import Loading from '../common/Loading';
import moment from 'moment';

const cx = cn.bind(styles);

const Detail = () => {
	const history = useHistory();
	const token = window.localStorage.getItem("accessTokenSO");
	const { id } = useParams();
	const [markdownContent, setMarkdownContent] = useState();
	const [postData, setPostData] = useState();
	const [loading, setLoading] = useState(true);
	const [listAnswer, setListAnswer] = useState();
	const [voteType, setVoteType] = useState();
	const [voteAnswer, setVoteAnswer] = useState();
	const [voteOfPost, setVoteOfPost] = useState();
	const [answerId, setAnswerId] = useState();
	const [like, setLike] = useState();
	const [voteOfAnswerById, setVoteOfAnswerById] = useState();
	const [answerOrderBy, setAnswerOrderBy] = useState('upVoteNum');
	const [answerOrderType, setAnswerOrderType] = useState("asc");
	const [isLike, setIsLike] = useState();

	useEffect(() => {
		getPostDetail();
		getVoteOfPost();
		checkLikedPost();
	}, []);

	useEffect(() => {
		getListAnswer();
	}, [answerId, answerOrderType, answerOrderBy]);

	const getPostDetail = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/post/id/${id}`);
			if (res.status === 200) {
				setPostData(res.data.result);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	}

	const getListAnswer = async () => {
		try {
			const res = await axios.get(`${URL}/answer/list?page=1&perPage=1000&postId=${id}&orderBy=${answerOrderBy}&orderType=${answerOrderType}`);
			if (res.status === 200) {
				console.log("listAn", res);
				setListAnswer(res.data.result.data);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const getVoteOfPost = async () => {
		try {
			const res = await axios.get(`${URL}/post/vote-num?postId=${id}`);
			if (res.status === 200) {
				setVoteOfPost(res.data.result);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const handleVotePost = async (voteType) => {
		if (token) {
			const check = await checkUserVotedPost();
			console.log("check", check);
			if (!check?.length || voteType != check[0]?.voteType) {
				handleCreateVoteForPost(voteType);
			} else if (voteType == check[0]?.voteType) {
				handleDeleteVoteForPost();
			}
		} else {
			history.push("/sign-in");
		}
	}

	const handleCreateVoteForPost = async (voteType) => {
		const bodyParams = {
			token: token,
			postId: id,
			voteType: voteType,
		};


		try {
			const res = await axios.post(`${URL}/post/user/create-vote`, bodyParams);
			if (res.status === 200) {
				getVoteOfPost();
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const handleDeleteVoteForPost = async () => {
		const bodyParams = {
			token: token,
			postId: id,
		};

		try {
			const res = await axios.post(`${URL}/post/user/delete-vote`, bodyParams);
			if (res.status === 200) {
				getVoteOfPost();
				console.log("delete", res);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const checkUserVotedPost = async () => {
		const bodyParams = {
			token: token,
			postId: id,
		}

		try {
			const res = await axios.post(`${URL}/post/user/get-vote`, bodyParams);
			if (res.status == 200) {
				return res.data.result;
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	//answer

	const getVoteOfAnswer = async (id) => {
		try {
			const res = await axios.get(`${URL}/answer/vote-num?answerId=${id}`);
			if (res.status === 200) {
				setVoteOfAnswerById(res.data.result);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const handleVoteAnswer = async (voteType, id) => {
		if (token) {
			const check = await checkUserVotedAnswer(id);
			if (!check?.length || voteType != check[0]?.voteType) {
				handleCreateVoteForAnswer(voteType, id);
			} else if (voteType == check[0]?.voteType) {
				handleDeleteVoteForAnswer(id);
			}
		} else {
			history.push("/sign-in");
		}
	}

	const handleCreateVoteForAnswer = async (voteType, id) => {
		const bodyParams = {
			token: token,
			answerId: id,
			voteType: voteType,
		};

		try {
			const res = await axios.post(`${URL}/answer/user/create-vote`, bodyParams);
			if (res.status === 200) {
				getVoteOfAnswer(id);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const handleDeleteVoteForAnswer = async (id) => {
		const bodyParams = {
			token: token,
			answerId: id,
		};

		try {
			const res = await axios.post(`${URL}/answer/user/delete-vote`, bodyParams);
			if (res.status === 200) {
				getVoteOfAnswer(id);
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const checkUserVotedAnswer = async (id) => {
		const bodyParams = {
			token: token,
			answerId: id,
		}

		try {
			const res = await axios.post(`${URL}/answer/user/get-vote`, bodyParams);
			if (res.status == 200) {
				console.log(res.data);
				return res.data.result;
			}
		} catch (err) {
			console.log(err.response);
		}
	}

	const handleFavoritePost = async (isLike) => {
		if (isLike) {
			addToFavoritePost();
		} else {
			deleteFromFavoritePost();
		}
	}

	const addToFavoritePost = async () => {
		const bodyParam = {
			token: token,
			postId: id,
		}
		try {
			const res = await axios.post(`${URL}/post/user/add-favorite-post`, bodyParam);
			if (res.status === 200) {
				setIsLike(true);
				getLikeOfPost();
			}
		} catch (err) {
			console.log(err);
		}
	}

	const deleteFromFavoritePost = async () => {
		const bodyParam = {
			token: token,
			postId: id,
		}
		try {
			const res = await axios.post(`${URL}/post/user/delete-favorite-post`, bodyParam);
			if (res.status === 200) {
				setIsLike(false);
				getLikeOfPost();
			}
		} catch (err) {
			console.log(err);
		}
	}

	const checkLikedPost = async () => {
		const bodyParam = {
			token: token,
			postId: id,
		}
		try {
			const res = await axios.post(`${URL}/post/user/get-like`, bodyParam);
			if (res.status === 200) {
				if (res.data.result?.length > 0) {
					setIsLike(true);
				} else {
					setIsLike(false);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	const getLikeOfPost = async () => {
		try {
			const res = await axios.get(`${URL}/post/like-num?postId=${id}`);
			if (res.status === 200) {
				setLike(res.data.result.likeNum);
			}
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className={cx("post-detail")}>
			{console.log("isLike", isLike)}
			{loading ? (<Loading />) : (
				<div className={cx("container")}>
					<div className={cx("header")}>
						<Row>
							<Col span={18}>
								<div className={cx("title")}>
									{postData.postName}
								</div>
								<div className={cx("info")}>
									<div className={cx("oneField")}>
										<span className={cx("name")}>Posted: </span>
										<b className={cx("view")}>{moment(postData.date, 'YYYY-MM-DD').fromNow()}</b>
									</div>
									<div className={cx("oneField")}>
										<span className={cx("name")}>Views: </span>
										<b className={cx("view")}>{postData.viewNum}</b>
									</div>
									<div className={cx("oneField")}>
										<span className={cx("name")}>Answer: </span>
										<b className={cx("view")}>{postData.numAnswer}</b>
									</div>
									<div className={cx("oneField")}>
										<span className={cx("name")}>Author: </span>
										<b className={cx("view")}>{postData.postUserName}</b>
									</div>
								</div>
							</Col>
							<Col span={2}></Col>
							<Col span={4}>
								<div className={cx("button")} onClick={() => history.push("/posts/create-post")}>
									<PlusCircleOutlined /> Create new post
								</div>
							</Col>
						</Row>
					</div>
					<div className={cx("division")}></div>
					<div className={cx("question")}>
						<Row>
							<Col span={3}>
								<div className={cx("upDown")}>
									<div
										className={cx("icon")}
										className={cx("click-icon")}
										onClick={() => {
											setVoteType(true);
											handleVotePost(true);
										}}
									><CaretUpOutlined /></div>
									<div>{voteOfPost ? voteOfPost.upVote - voteOfPost.downVote : '0'}</div>
									<div
										className={cx("icon")}
										className={cx("click-icon")}
										onClick={() => {
											setVoteType(false);
											handleVotePost(false);
										}}
									><CaretDownOutlined /></div>
								</div>
								<div className={cx("favorite")}>
									<div onClick={() => {
										handleFavoritePost(!isLike);
									}}>
										{isLike ? (
											<HeartFilled style={{ color: '#f5222d' }} className={cx("click-icon")} />
										) : (
											<HeartTwoTone twoToneColor="#f5222d" className={cx("click-icon")} />
										)}
									</div>

									<div style={{ fontSize: '14px', fontWeight: 'bold', color: "#8c8c8c" }}>{like ? like : postData.likeNum} likes</div>
								</div>
							</Col>
							<Col span={16}>
								<div className={cx("postDetail")}>
									<ReactMarkdown>
										{postData.postDetail}
									</ReactMarkdown>
								</div>
							</Col>
							<Col span={1}></Col>
							<Col span={4}>
								{postData.postTags ? postData.postTags?.map((tag, idx) => (
									<Tag color="geekblue" key={idx}>{tag.tagName}</Tag>
								)) : (<></>)}
								<div className={cx("author")}>
									<Avatar /> &nbsp; &nbsp;
									<span>{postData.postUserName}</span>
								</div>
							</Col>
						</Row>
					</div>
					<div className={cx("division")}></div>
					<div className={cx("answer")}>
						<div className={cx("answer-header")}>
							<h1>{postData.numAnswer} Answers</h1>
							<div className={cx("groupButton")}>
								<div
									className={cx("button", answerOrderBy === "upVoteNum" && "active")}
									onClick={() => {
										setAnswerOrderBy("upVoteNum");
										setAnswerOrderType("asc");
									}}
								>Votes</div>
								<div
									className={cx("button", answerOrderBy === "date" && "active")}
									onClick={() => {
										setAnswerOrderBy("date");
										setAnswerOrderType("desc");
									}}
								>Oldest</div>
							</div>
						</div>
						<div className={cx("division")}></div>
						{!listAnswer ? (<></>) :
							listAnswer.map((answer, idx) => (
								<div key={idx}>
									<Row>
										<Col span={3}>
											<div className={cx("upDown")}>
												<div
													className={cx("icon", "click-icon")}
													onClick={() => {
														setAnswerId(answer.Id);
														setVoteAnswer(true);
														handleVoteAnswer(true, answer.Id);
													}}
												><CaretUpOutlined /></div>
												<div>
													{voteOfAnswerById && answerId === answer.Id ? voteOfAnswerById.upVote - voteOfAnswerById.downVote
														: answer.upVoteNum - answer.downVoteNum}
												</div>
												<div
													className={cx("icon", "click-icon")}
													onClick={() => {
														setAnswerId(answer.Id);
														setVoteAnswer(false);
														handleVoteAnswer(false, answer.Id);
													}}
												><CaretDownOutlined /></div>
											</div>
											<div className={cx("favorite")}>
												{answer.Id === postData.rightAnswerID && <CheckCircleTwoTone twoToneColor="#52c41a" />}
											</div>
										</Col>
										<Col span={16}>
											<div className={cx("postDetail")}>
												<ReactMarkdown>
													{answer.answerDetail}
												</ReactMarkdown>
											</div>
										</Col>
										<Col span={1}></Col>
										<Col span={4}>
											<div style={{ fontSize: '12px' }}>{moment(answer.date).format('MMMM Do YYYY, h:mm:ss a')}</div>
											<div className={cx("author")}>
												<Avatar /> &nbsp; &nbsp;
												<span>{answer?.postUserName}</span>
											</div>
										</Col>
									</Row>
									<div className={cx("division")}></div>
								</div>
							))
						}
					</div>
					{/* <div className={cx("division")}></div> */}
					<div className={cx("write-answer")}>
						<h1>Your answer</h1>
						<div className={cx("content")}>
							<div className={cx("markdown")}>
								<b>Markdown</b>
								<textarea
									placeholder='e.g. # Git'
									className={cx("input")}
									onChange={(e) => setMarkdownContent(e.target.value)}
									style={{ marginTop: '10px' }}
									rows={10}
								/>
							</div>
							<div className={cx("markdown")}>
								<b>Preview</b>
								<div className={cx("box")}>
									<ReactMarkdown>
										{markdownContent}
									</ReactMarkdown>
								</div>
							</div>
						</div>
						<div className={cx("btn")}>
							Post your answer
						</div>
					</div>
				</div>
			)
			}
		</div >
	)
}

export default Detail;