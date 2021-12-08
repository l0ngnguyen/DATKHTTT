import React from 'react';
import styles from './TagDetail.module.scss';
import cn from 'classnames/bind';
import { Modal } from 'antd';

const cx = cn.bind(styles);

const TagDetail = (props) => {
    return (
        <Modal
            visible={props.visible}
            onCancel={props.hide}
            footer={null}
        >
            <div className={cx("modal")}>
                <div className={cx("top")}>
                    <div className={cx("label")}>#jdsnf</div>
                    <div className={cx("right")}>
                        <div>Author</div>
                        <div className={cx("time")}>at sldkf</div>
                    </div>
                </div>
                <div className={cx("content")}>
                </div>
            </div>
        </Modal>
    )
}

export default TagDetail;