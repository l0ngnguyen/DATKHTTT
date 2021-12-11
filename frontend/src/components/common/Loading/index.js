import { Spin } from 'antd';
import React from 'react';

const Loading = () => {
    return (
        <div
            style={{
                maxWidth: '1120px',
                margin: '0px auto',
                padding: "120px 0px",
                textAlign: 'center'
            }}
        >
            <Spin size="large" />
        </div>
    )
}

export default Loading;