import React from "react";
import './App.scss';
import 'antd/dist/antd.css';
import Homepage from "./components/Homepage";

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SignUpModal from "./components/Register/SignUpWithGG";
import Profile from "./components/Profile";
import Tags from "./components/Tags";
import Post from "./components/Posts";
import CreatePost from "./components/Posts/CreatePost/CreatePost";
import EditPost from "./components/Posts/EditPost";
import PostDetail from "./components/PostDetail";
import Author from "./components/Author";
import AuthorProfile from "./components/AuthorDetail";

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Homepage />
				</Route>
				<Route path="/sign-in">
					<Login />
				</Route>
				<Route path="/sign-up">
					<Register />
				</Route>
				<Route path="/sign-up-with-google">
					<SignUpModal />
				</Route>
				<Route path="/profile">
					<Profile />
				</Route>
				<Route exact path="/tags">
					<Tags />
				</Route>
				<Route exact path="/posts">
					<Post />
				</Route>
				<Route path="/posts/create-post">
					<CreatePost />
				</Route>
				<Route path="/posts/edit-post">
					<EditPost />
				</Route>
				<Route exact path="/post-detail/:id">
					<PostDetail />
				</Route>
				<Route exact path="/user">
					<Author />
				</Route>
				<Route path="/user/user-info/:userId">
					<AuthorProfile />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
