import React from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import ListPost from './ListPost/ListPost';
import Layout from "../common/Layout/index";

const cx = cn.bind(styles);

const Post = () => {
    return (
        <Layout>
            <ListPost />
        </Layout>
    )
}

export default Post;