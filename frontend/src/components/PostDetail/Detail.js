import React from 'react';
import styles from './PostDetail.module.scss';
import cn from 'classnames/bind';
import { Row, Col } from 'antd';

const cx = cn.bind(styles);

const Detail = () => {
	return (
		<div className={cx("post-detail")}>
			<div className={cx("container")}>
				<div className={cx("header")}>
					<Row>
						<Col span={20}>
							<div className={cx("title")}>
								Why is processing a sorted array faster than processing an
								unsorted array?
							</div>
							<div className={cx("info")}>
								
							</div>
						</Col>
						<Col span={4}>
							<div>button</div>
						</Col>
					</Row>
				</div>
				<div className={cx("answer")}>

				</div>
			</div>
		</div>
	)
}

export default Detail;