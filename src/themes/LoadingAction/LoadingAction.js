import "./LoadingAction.css";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

const LoadingAction = () => {
    return (
        <div className="LoadingActionWrapper">
            <Spin indicator={antIcon} />
        </div>
    )
}

export default LoadingAction;
