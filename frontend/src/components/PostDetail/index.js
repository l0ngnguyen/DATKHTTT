import React from 'react';
import styles from './PostDetail.module.scss';
import cn from 'classnames/bind';
import Layout from '../common/Layout/index';
import Detail from './Detail';

const cx = cn.bind(styles);

const PostDetail = () => {
	return (
		<Layout>
			<Detail />
		</Layout>
	)
}

export default PostDetail;