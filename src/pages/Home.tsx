import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home: React.FC = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleStart = async () => {
        const code = token.trim();
        if (!code) return;

        setIsLoading(true);
        setErrorMsg('');

        try {
            const result = await api.verifyAccessCode(code);
            if (result.valid) {
                if (result.reportId) {
                    // 已使用的码，直接跳到报告页
                    navigate(`/result/${result.reportId}`);
                } else {
                    // 新码，进入答题页（传递 code 供 createReport 关联）
                    navigate('/quiz', { state: { accessCode: code } });
                }
            } else {
                setErrorMsg(result.message || '验证失败');
            }
        } catch (err) {
            setErrorMsg('网络错误，请稍后再试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 animate-fade-in relative z-10">

            {/* Recreated Logo based on user image */}
            <div className="w-28 h-28 bg-gradient-to-br from-[#FF5D8D] to-[#FF8F70] rounded-[2rem] mb-5 shadow-[0_15px_40px_-10px_rgba(255,93,141,0.5)] flex items-center justify-center overflow-hidden relative border border-white/20">
                <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-[1px]"></div>
                <span className="relative text-white text-5xl font-black tracking-tighter drop-shadow-sm select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Lab
                </span>
            </div>

            {/* Brand Name */}
            <p className="text-brand-text font-bold tracking-widest text-sm mb-8">人生算法 Lab</p>

            {/* Main Title */}
            <h1 className="text-2xl font-serif font-bold text-brand-text mb-3 text-center leading-tight whitespace-nowrap">
                360° MBTI 人格测试
            </h1>

            {/* Subtitle */}
            <p className="text-brand-secondary text-sm mb-12 tracking-wide text-center">
                基于荣格八维模型构建人格解析系统<br />
                通过双重视角校准，还原更真实的你
            </p>

            <div className="w-full max-w-xs space-y-4">
                <input
                    type="text"
                    value={token}
                    onChange={(e) => { setToken(e.target.value); setErrorMsg(''); }}
                    placeholder="输入邀请码"
                    className="w-full bg-transparent border-b border-brand-line py-3 text-center text-lg focus:outline-none focus:border-brand-pink transition-colors font-sans placeholder:text-gray-300"
                />
                {errorMsg && (
                    <p className="text-red-500 text-xs text-center animate-fade-in">{errorMsg}</p>
                )}
                <button
                    onClick={handleStart}
                    disabled={!token || isLoading}
                    className={`w-full py-4 rounded-full text-sm font-semibold tracking-widest transition-all transform active:scale-95 ${token && !isLoading ? 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-glow' : 'bg-gray-100 text-gray-300'}`}
                >
                    {isLoading ? '验证中...' : '立刻开始'}
                </button>
            </div>
        </div>
    );
};

export default Home;
