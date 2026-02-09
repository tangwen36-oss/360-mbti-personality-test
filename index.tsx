import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PeerAssessment from './src/pages/PeerAssessment';

// 简单的 URL 路由
const getAppComponent = () => {
  const pathname = window.location.pathname;

  // /peer 或 /peer.html 路径渲染他测页面
  if (pathname === '/peer' || pathname === '/peer.html' || pathname.startsWith('/peer?')) {
    return <PeerAssessment />;
  }

  // 默认渲染主应用
  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {getAppComponent()}
  </React.StrictMode>
);