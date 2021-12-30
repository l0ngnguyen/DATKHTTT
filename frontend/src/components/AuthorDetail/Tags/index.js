import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Tag, Form, Input, Pagination, message, Button } from 'antd';
import { URL } from "../../../const/index";
import axios from 'axios';
import Loading from '../../common/Loading';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const cx = cn.bind(styles);

const YourTags = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [listTag, setListTag] = useState();
    const [loading, setLoading] = useState(true);
    const token = window.localStorage.getItem("accessTokenSO");
	const {userId} = useParams();
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState();
    const [reload, setReload] = useState(false);
    console.log("tag", tag);

    useEffect(() => {
        getListUserTag();
    }, [page, reload]);

    const getListUserTag = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/tag/list?userId=${userId}&page=${page}&perPage=20`);
            if (res.status === 200) {
                setListTag(res.data.result.data);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinishCreateTag = async (values) => {
        const bodyParam = {
            token: token,
            tagName: values.tagName,
            tagDetail: values.tagDetail,
        }
        try {
            const res = await axios.post(`${URL}/tag/create-tag`, bodyParam);
            if (res.status === 200) {
                console.log(res);
                message.success("Create new tag success!");
                setIsModalVisible(false);
                setReload(true);
            }
        } catch (err) {
            console.log(err.response);
        }

    }

    const onFinishFailedCreateTag = (values) => {
        console.log(values);
    }

    const onFinishEditTag = async (values) => {
        const bodyParam = {
            token: token,
            tagId: tag.Id,
            tagName: values.tagName,
            tagDetail: values.tagDetail,
        }
        try {
            const res = await axios.post(`${URL}/tag/edit-tag`, bodyParam);
            if (res.status === 200) {
                console.log(res);
                message.success("Edit tag success!");
                setVisibleEditModal(false);
                setReload(!reload);
            }
        } catch (err) {
            console.log(err.response);
        }

    }

    const onFinishFailedEditTag = (values) => {
        console.log(values);
    }

    const handleDeleteTag = async () => {
        const bodyParam = {
            token: token,
            tagId: tag.Id,
        }
        try {
            const res = await axios.post(`${URL}/tag/delete-tag`, bodyParam);
            if (res.status === 200) {
                console.log(res);
                message.success("Deleted!");
                setVisibleDeleteModal(false);
                setReload(!reload);
            }
        } catch (err) {
            console.log(err.response);
        }
    }

    return (
        <>{loading ? (<Loading />) : (
            <div className={cx("tag")}>
                <div className={cx("top")}>
                    <div className={cx("title")}>{listTag.length} Tags</div>
                    <div
                        className={cx("button")}
                        onClick={() => setIsModalVisible(true)}
                    >Create new tag</div>
                </div>
                <div className={cx("list")}>
                    {listTag.length > 0 ? listTag.map((item, ind) => (
                        <div className={cx("oneTag")} key={ind}>
                            <div style={{ flex: 1 }}>
                                <Tag color="blue" >{item.tagName}</Tag>
                            </div>
                            <div style={{ flex: 5 }}>{item.tagDetail.slice(0, 300)} ...</div>
                            {/* <div className={cx("right")} style={{ flex: 1 }}>
                                <EditOutlined
                                    className={cx("icon")}
                                    onClick={() => {
                                        setTag(item);
                                        setVisibleEditModal(true);
                                    }}
                                />
                                <DeleteOutlined
                                    className={cx("icon")}
                                    onClick={() => {
                                        setTag(item);
                                        setVisibleDeleteModal(true);
                                    }}
                                />
                            </div> */}
                        </div>
                    )) : (
                        <div>
                            You hasn’t posted yet.
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'right', marginTop: '30px' }}>
                    {
                        listTag.length > 0 && (
                            <Pagination
                                defaultCurrent={1}
                                total={listTag.length}
                                onChange={(page) => setPage(page)}
                            />
                        )
                    }
                </div>
                <Modal
                    title="Create New Tag"
                    visible={isModalVisible}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <Form
                        name="basic"
                        onFinish={onFinishCreateTag}
                        onFinishFailed={onFinishFailedCreateTag}
                        layout="vertical"
                        style={{ padding: '0px 30px' }}
                    >
                        <Form.Item
                            label="Tag name"
                            name="tagName"
                            rules={[{ required: true, message: 'Please input tag name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tag detail"
                            name="tagDetail"
                            rules={[{ required: true, message: 'Please input tag description!' }]}
                        >
                            <Input.TextArea maxLength={500} showCount rows={6} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </Form.Item>
                    </Form>
                </Modal>


                <Modal
                    title="Edit Tag"
                    visible={visibleEditModal}
                    footer={null}
                    onCancel={() => setVisibleEditModal(false)}
                >
                    <Form
                        name="basic"
                        onFinish={onFinishEditTag}
                        onFinishFailed={onFinishFailedEditTag}
                        layout="vertical"
                        style={{ padding: '0px 30px' }}
                        initialValues={{
                            tagName: tag?.tagName,
                            tagDetail: tag?.tagDetail,
                        }}
                    >
                        <Form.Item
                            label="Tag name"
                            name="tagName"
                            rules={[{ required: true, message: 'Please input tag name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tag detail"
                            name="tagDetail"
                            rules={[{ required: true, message: 'Please input tag description!' }]}
                        >
                            <Input.TextArea maxLength={300} showCount rows={6} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Edit</Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Delete tag"
                    visible={visibleDeleteModal}
                    onOk={handleDeleteTag}
                    okText="Delete"
                    onCancel={() => setVisibleDeleteModal(false)}
                >
                    <div>Do you want to delete this tag?</div>
                </Modal>
            </div>
        )}
        </>
    )
}

export default YourTags;