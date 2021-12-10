import React, { useState, useEffect } from 'react';
import styles from './TagDetail.module.scss';
import cn from 'classnames/bind';
import { Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';

const cx = cn.bind(styles);

const domain = 'http://localhost:3001';

const TagDetail = (props) => {
    const [tag, setTag] = useState();
    const [author, setAuthor] = useState();
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);

    useEffect(() => {
        getTag();
        getAuthor();
    }, [props.tagId]);

    const getTag = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${domain}/tag/id/${props.tagId}`);
            if (res.status === 200) {
                setTag(res.data.result);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getAuthor = async () => {
        setLoading1(true);
        try {
            const res = await axios.get(`${domain}/user/id/${props.authorId}`);
            if (res.status === 200) {
                setAuthor(res.data.result);
                setLoading1(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Modal
            visible={props.visible}
            onCancel={props.hide}
            footer={null}
        >
            {!loading && !loading1 && (
                <div className={cx("modal")}>
                    <div className={cx("top")}>
                        <div className={cx("label")}>#{tag.tagName}</div>
                        <div className={cx("right")}>
                            <div>Created by {author.userName}</div>
                            <div className={cx("time")}>at {moment((tag.date), "YYYYMMDD").fromNow()}</div>
                        </div>
                    </div>
                
                    <div className={cx("content")}>
                        {tag.tagDetail}
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default TagDetail;