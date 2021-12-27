import React, { useEffect, useState } from 'react';
import styles from '../Posts/CreatePost/CreatePost.module.scss';
import cn from 'classnames/bind';
import Layout from '../common/Layout/index';
import { Row, Input, Card } from 'antd';
import { URL } from '../../const/index';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

const cx = cn.bind(styles);

const EditPost = () => {
	const token = window.localStorage.getItem("accessTokenSO");
	const history = useHistory();
	const location = useLocation();
	const [options, setOptions] = useState([]);
	const [listTag, setListTag] = useState();
	const [markdownContent, setMarkdownContent] = useState(location.state.postSelected.postDetail);
	const [title, setTitle] = useState(location.state.postSelected.postName);
	const userId = useSelector(state => state.user.userId);
	const post = location.state.postSelected;
	const [defaultTags, setDefaultTags] = useState(location.state.postSelected.postTags);

	useEffect(() => {
		handleSearch();
	}, [post]);

	const handleSearch = async (value) => {
		console.log(post);
		try {
			const res = await axios.get(`${URL}/tag/list?page=${1}&perPage=${10000}`);
			if (res.status === 200) {
				const list = res.data.result.data;
				setOptions(list);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getTagOfPost = async () => {
		const post = location.state.postSelected;
		try {
			const res = await axios.get(`${URL}/post/tag?postId=${post.postId}`);
			console.log("res", res);
			return res.data.result;
		} catch (err) {
			console.log(err);
		}
	}

	const onSelect = (event, values) => {
		setListTag(values.map((item, id) => item.Id));
	};

	const handleEditPost = async () => {
		const bodyParam = {
			token: token,
			postId: post.Id,
			postName: title,
			postDetail: markdownContent,
			postTags: listTag,

		}
		try {
			const res = await axios.post(`${URL}/post/edit-post`, bodyParam);
			if (res.status === 200) {
				console.log(res);
				history.push("/profile?tab=my-post");
			}
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<Layout>
			<div className={cx("createPost")}>
				<div className={cx("container")}>
					<div className={cx("pageTitle")}>Edit post</div>
					<div className={cx("body")}>
						<div className={cx("left")}>
							<div className={cx("oneField")}>
								<div className={cx("title")}>Title</div>
								<div className={cx("description")}>
									Be specific and imagine you're asking a question to another person
								</div>
								<input
									defaultValue={post.postName}
									placeholder='e.g. How do I undo the most recent local commits in Git?'
									className={cx("input")}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>

							<div className={cx("oneField")}>
								<div className={cx("title")}>Body</div>
								<div className={cx("description")}>
									Include all the information someone would need to answer your question
								</div>
								<div className={cx("content")}>
									<div className={cx("markdown")}>
										<b>Markdown</b>
										<textarea
											defaultValue={post.postDetail}
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
												{post.postDetail}
											</ReactMarkdown>
										</div>
									</div>
								</div>
								{/* <input
                                    placeholder='e.g. How do I undo the most recent local commits in Git?'
                                    className={cx("input")}
                                /> */}
							</div>

							<div className={cx("oneField")}>
								<div className={cx("title")}>Tags</div>
								<div className={cx("description")}>
									Add up to 5 tags to describe what your question is about
								</div>
								<Autocomplete
									multiple
									id="tags-outlined"
									options={options}
									defaultValue={defaultTags}
									getOptionLabel={(option) => option.tagName}
									filterSelectedOptions
									renderInput={(params) => (
										<TextField
											{...params}
											label="Tags"
											placeholder='e.g. git'
										/>
									)}
									onChange={(event, values) => onSelect(event, values)}
								/>
								{console.log("list", listTag)}
							</div>
						</div>
					</div>
					<div style={{ display: 'flex' }}>
						<div
							className={cx("button")}
							onClick={handleEditPost}
						>
							Save
						</div> &nbsp; &nbsp;
						<div
							className={cx("button")}
							onClick={() => history.push("/profile?tab=my-post")}
						>
							Cancel
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default EditPost;