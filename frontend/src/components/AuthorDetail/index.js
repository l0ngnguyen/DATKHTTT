import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import {
	Avatar,
	Modal,
	Button,
	Form, Input,
	message,
	Tooltip
} from 'antd';
import {
	TeamOutlined,
	EnvironmentOutlined,
	EditOutlined,
	PlusCircleOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import MyProfile from './MyProfile/MyProfile';
import MyPost from './MyPost';
import MyAnswer from './MyAnswer';
import FavoritePost from './FavoritePost';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { changeUserInfo } from '../../features/user/userSlice';
import YourTags from './Tags';
import { useHistory, useLocation, useParams } from 'react-router';
import { URL } from '../../const';

const cx = cn.bind(styles);

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { TextArea } = Input;

const link = [
	{
		title: 'Profile',
		path: 'profile',
		tab: 1,
		component: <MyProfile />,
	},
	{
		title: 'Posts',
		path: 'my-post',
		tab: 2,
		component: <MyPost />,
	},
	{
		title: 'Answers',
		path: 'my-answer',
		tab: 3,
		component: <MyAnswer />,
	},
	{
		title: 'Favorite posts',
		path: 'favorite-post',
		tab: 4,
		component: <FavoritePost />,
	},
	{
		title: 'Tags',
		path: 'tags',
		tab: 5,
		component: <YourTags />,
	}
];

function useQuery() {
	const { search } = useLocation();

	return React.useMemo(() => new URLSearchParams(search), [search]);
}

const AuthorProfile = () => {
	const history = useHistory();
	const query = useQuery();
	const [tabActive, setTabActive] = useState(1);
	const [userInfo, setUserInfo] = useState();
	const { userId } = useParams();

	useEffect(() => {
		getAuthorInfo();
	}, [userId])

	const getAuthorInfo = async () => {
		try {
			const res = await axios.get(`${URL}/user/id/${userId}`);
			if (res.status === 200) {
				setUserInfo(res.data.result);
			}

		} catch (err) {
			console.log(err.response);
		}
	}

	return (
		<Layout>
			<div className={cx("container")}>
				<div className={cx("top")}>
					<div className={cx("left")}>
						<div
							style={{ cursor: 'pointer' }}
						>
							<Tooltip title="Click to upload new avatar">
								{userInfo?.avatarLink ? (
									<img
										src={`http://localhost:3001/${userInfo?.avatarLink}`}
										alt="avatar"
										width={120}
										height={120}
										style={{ borderRadius: '50%' }}
									/>
								) : (
									<Avatar
										style={{
											backgroundColor: '#52C41A',
											width: '120px',
											height: '120px',
											textAlign: 'center',
										}}
									/>
								)}
							</Tooltip>
						</div>
						<div className={cx("info")}>
							<div className={cx("name")}>{userInfo?.userName}</div>
							<div className={cx("member")}>
								<TeamOutlined /> Member in {moment(userInfo?.date).format('LLL')}
							</div>
							<div className={cx("location")}>
								<EnvironmentOutlined /> {userInfo?.location}
							</div>
						</div>
					</div>
				</div>
				<div className={cx("tab-navigation")}>
					{
						link.map((item, ind) => (
							<div
								className={cx(
									"tab-navigation-item",
									item.path === query.get("tab") && "active",
								)}
								key={ind}
								onClick={() => {
									setTabActive(item.tab);
									history.push(`/user/user-info/${userId}?tab=${item.path}`)
								}}
							>
								{item.title}
							</div>
						))
					}
				</div>
				<div className={cx("body")}>
					{query.get("tab")
						? link.filter((item, index) => item.path === query.get("tab"))[0].component
						: (<MyProfile />)
					}
				</div>
			</div>
		</Layout >
	)
}

export default AuthorProfile;

