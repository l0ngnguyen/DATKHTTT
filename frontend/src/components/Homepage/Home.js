import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

const Home = (props) => {
    return (
        <>
            <Header />
            <div>{props.children}</div>
            <Footer />
        </>
    )
}

export default Home;

