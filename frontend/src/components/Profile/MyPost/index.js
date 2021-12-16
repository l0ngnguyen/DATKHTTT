import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import axios from 'axios';
import Loading from '../../common/Loading';
import { useSelector } from 'react-redux';
import { URL } from '../../../const/index';
import moment from 'moment';
import { Pagination } from 'antd';
import ReactMarkdown from 'react-markdown';

const cx = cn.bind(styles);

const MyPost = () => {
    const [listPost, setListPost] = useState();
    const userId = useSelector(state => state.user.userId);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('viewNum');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getListPost();
    }, [page, orderBy]);

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
                                    <div className={cx("answer")}>{post.numAnswer} answers</div>
                                    <div>{post.upVoteNum} votes</div>
                                    <div className={cx("view")}>{post.viewNum} views</div>
                                    <div>2 likes</div>
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