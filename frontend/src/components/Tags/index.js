import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from "../common/Layout/index";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Input, Card, Row, Col, Spin, Pagination } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import Loading from '../common/Loading';
import moment from 'moment';
import TagDetail from './TagDetail/TagDetail';

const { Search } = Input;

const cx = cn.bind(styles);

const domain = 'http://localhost:3001';

const Tags = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [list, setList] = useState();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [tag, setTag] = useState();
    const [total, setTotal] = useState();

    useEffect(() => {
        getListTags();
    }, [page, perPage]);

    const onSearch = async (value) => {
        console.log(value);
        setLoading(true);
        try {
            const res = await axios.get(`${domain}/tag/search?query=${value}`);
            if (res.status === 200) {
                console.log("serch", res);
                setList(res.data.result.data);
                setTotal(res.data.result.length);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getListTags = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${domain}/tag/list?page=${page}&perPage=${perPage}`);
            if (res.status === 200) {
                console.log(res);
                setList(res.data.result.data);
                setTotal(res.data.result.pagination.total);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Layout>
            <div className={cx("tag")}>
                {loading ? (
                    <Loading />
                ) : (
                    <div className={cx("container")}>
                        <div className={cx("header")}>
                            <div className={cx("left")}>
                                <div className={cx("title")}>Tags</div>
                                <div className={cx("subTitle")}>{total} tags</div>
                            </div>
                            <div className={cx("right")}>
                                <Search
                                    placeholder="Find by tag name"
                                    allowClear
                                    onSearch={onSearch}
                                    className={cx("search")}
                                    size="large"
                                />
                                {/* <div className={cx("button")}>
                                    <PlusCircleOutlined />  Create New Tag
                                </div> */}
                            </div>
                        </div>
                        <div style={{ fontSize: '12px', width: '45%', padding: '10px 0px 0px 10px' }}>A tag is a keyword or label that
                            categorizes your question with other,
                            similar questions. Using the right
                            tags makes it easier for others to find
                            and answer your question.
                        </div>


                        <div className={cx("body")}>
                            <Row gutter={[16, 24]}>
                                {list.length ? list.map((item, index) => (
                                    <Col span={6} key={index}>
                                        <Card
                                            className={cx("card")}
                                            onClick={() => {
                                                setVisible(true);
                                                setTag(item);
                                            }}
                                        >
                                            <div className={cx("label")}>#{item.tagName}</div>
                                            <div className={cx("content")}>
                                                {item.tagDetail.slice(0, 160) + "..."}
                                            </div>
                                            <div className={cx("card-footer")}>
                                                <div>
                                                    <b>12345</b>
                                                    <div>questions</div>
                                                </div>
                                                <div>Created {moment((item.date), "YYYYMMDD").fromNow()}</div>
                                            </div>
                                        </Card>
                                    </Col>
                                )) : (
                                    <div>
                                        No result
                                    </div>
                                )}
                            </Row>
                        </div>

                        <div className={cx("pagination")}>
                            <Pagination
                                defaultPageSize={perPage}
                                defaultCurrent={page}
                                total={total}
                                showTotal={total => `Total ${total} items`}
                                onChange={(page, pageSize) => {
                                    setPage(page);
                                    setPerPage(pageSize);
                                }}
                            />
                        </div>

                        {tag && <TagDetail
                            visible={visible}
                            hide={() => setVisible(false)}
                            tagId={tag.Id}
                            authorId={tag.userId}
                        />}

                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Tags;