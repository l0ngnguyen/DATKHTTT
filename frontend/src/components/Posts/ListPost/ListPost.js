import React, { useEffect, useState } from 'react';
import styles from './ListPost.module.scss';
import cn from 'classnames/bind';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Row, Col, Pagination } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { URL } from '../../../const/index';
import axios from "axios";
import Loading from '../../common/Loading/index';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const cx = cn.bind(styles);

const ListPost = () => {
    const [active, setActive] = useState(1);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('upVoteNum');
    const [listPost, setListPost] = useState();
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const history = useHistory();

    useEffect(() => {
        getAllPost();
    }, [orderBy, page, perPage]);

    const getAllPost = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/post/list?page=${page}&perPage=${perPage}&orderBy=${orderBy}&orderType=desc`);

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

    return (
        <div className={cx("listPost")}>
            <div className={cx("container")}>
                <div className={cx("top")}>
                    <div className={cx("top-left")}>
                        <div className={cx("title")}>All posts</div>
                        <div className={cx("subTitle")}>{total} posts</div>
                    </div>
                    <div className={cx("filterButton")}>
                        <div
                            className={cx("filterButton-left", orderBy === "upVoteNum" && "active")}
                            onClick={() => setOrderBy("upVoteNum")}
                        >Most votes</div>
                        <div
                            className={cx("filterButton-middle", orderBy === "numAnswer" && "active")}
                            onClick={() => setOrderBy("numAnswer")}
                        >Most answers</div>
                        <div
                            className={cx("filterButton-middle", orderBy === "date" && "active")}
                            onClick={() => setOrderBy("date")}
                        >Newest</div>
                        <div
                            className={cx("filterButton-right", orderBy === "viewNum" && "active")}
                            onClick={() => setOrderBy("viewNum")}
                        >Most views</div>
                    </div>
                    <div className={cx("button")} onClick={() => history.push("/posts/create-post")}>
                        <PlusCircleOutlined /> Create new post
                    </div>
                </div>

                {
                    !loading ? (
                        <div className={cx("list")}>
                            {
                                listPost.map((post, id) => (
                                    <div className={cx("oneItem")} key={id}>
                                        <Row>
                                            <Col
                                                span={2}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <div className={cx("vote")}>{post.upVoteNum}</div>
                                                <div className={cx("text")}>up votes</div>
                                            </Col>
                                            <Col
                                                span={2}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <div className={cx("answer")}>{post.numAnswer}</div>
                                                <div className={cx("text")}>answers</div>
                                            </Col>
                                            <Col
                                                span={2}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <div className={cx("view")}>{post.viewNum}</div>
                                                <div className={cx("text")}>views</div>
                                            </Col>
                                            <Col span={1}></Col>
                                            <Col span={12}>
                                                <div className={cx("title")}>{post.postName}</div>
                                                <div className={cx("text")}>
                                                    {post.postDetail.slice(0, 180)}
                                                </div>
                                            </Col>
                                            <Col span={1}></Col>
                                            <Col
                                                span={4}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <div className={cx("time")}>created {moment(post.date).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                                <div className={cx("author")}>
                                                    <Avatar /> &nbsp; {post.postUserName}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            }

                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                <Pagination
                                    defaultPageSize={perPage}
                                    defaultCurrent={page}
                                    total={total}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        </div>
                    ) : (
                        <Loading />
                    )
                }

            </div>
        </div>
    )
}

export default ListPost;