import React, { useEffect, useState } from 'react';
import styles from './CreatePost.module.scss';
import cn from 'classnames/bind';
import Layout from '../../common/Layout/index';
import { Row, Input, Card } from 'antd';
import { URL } from '../../../const/index';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const cx = cn.bind(styles);

const CreatePost = () => {
    const [options, setOptions] = useState([]);
    const [listTag, setListTag] = useState();
    const [markdownContent, setMarkdownContent] = useState();
    const [title, setTitle] = useState();
    const userId = useSelector(state => state.user.userId);
    const token = window.localStorage.getItem("accessTokenSO");
    const history = useHistory();

    useEffect(() => {
        handleSearch();
    }, [])

    const handleSearch = async (value) => {
        console.log(value);
        try {
            const res = await axios.get(`${URL}/tag/list?page=${1}&perPage=${10000}`);
            if (res.status === 200) {
                setOptions(res.data.result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onSelect = (event, values) => {
        setListTag(values.map((item, id) => item.Id));
    };

    const handleCreatePost = async () => {
        const bodyParam = {
            token: token,
            postName: title,
            postDetail: markdownContent,
            postTags: listTag,

        }
        try {
            const res = await axios.post(`${URL}/post/create-post`, bodyParam);
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
                    <div className={cx("pageTitle")}>Create a new post</div>
                    <div className={cx("body")}>
                        <div className={cx("left")}>
                            <div className={cx("oneField")}>
                                <div className={cx("title")}>Title</div>
                                <div className={cx("description")}>
                                    Be specific and imagine you're asking a question to another person
                                </div>
                                <input
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
                                            placeholder='e.g. # Git'
                                            className={cx("input")}
                                            onChange={(e) => setMarkdownContent(e.target.value)}
                                            style={{ marginTop: '10px' }}
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
                        <div className={cx("right")}>
                            <Card
                                title="Tips to create a post"
                            >
                                <div style={{ textAlign: 'justify' }}>
                                    The community is here to help you with specific coding,
                                    algorithm, or language problems.
                                    <br /> <br />
                                    Avoid asking opinion-based questions.
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div
                        className={cx("button")}
                        onClick={handleCreatePost}
                    >
                        Create post
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreatePost;