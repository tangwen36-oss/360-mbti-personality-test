import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

// 他测题目类型
interface PeerQuestion {
    id: number;
    text: string;
    option_a: string;
    option_b: string;
    value_a: string;
    value_b: string;
}

// 视图状态类型
type PeerViewState = 'welcome' | 'quiz' | 'submitting' | 'completed';

const PeerAssessment: React.FC = () => {
    // 从路径参数获取报告 ID
    const { id } = useParams<{ id: string }>();

    // 视图状态
    const [viewState, setViewState] = useState<PeerViewState>('welcome');

    // 题目数据
    const [questions, setQuestions] = useState<PeerQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // 用户输入 (token 现在直接从 URL 获取)
    const [token, setToken] = useState(id || '');
    const [targetUserName, setTargetUserName] = useState<string>('');

    // 答题记录
    const [answers, setAnswers] = useState<string[]>([]);

    // 加载状态
    const [isLoading, setIsLoading] = useState(false);

    // 当 id 变化时更新 token
    useEffect(() => {
        if (id) {
            setToken(id);
        }
    }, [id]);

    // 加载他测题目
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setIsLoading(true);
                const data = await api.fetchPeerQuestions();
                setQuestions(data);
            } catch (error) {
                console.error('加载他测题目失败:', error);
                alert('加载题目失败，请刷新页面重试');
            } finally {
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, []);

    // 开始答题
    const handleStart = () => {
        if (!token.trim()) {
            alert('请输入 Token');
            return;
        }
        setViewState('quiz');
    };

    // 选择答案
    const handleAnswer = async (value: string) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            // 下一题
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // 完成答题 - 调用真实 API
            setViewState('submitting');

            try {
                // 调用 submitPeerAssessment API
                await api.submitPeerAssessment(token, newAnswers);
                setViewState('completed');
            } catch (err) {
                console.error('提交他测失败:', err);
                alert('提交失败，请重试');
                // 回退到答题状态
                setViewState('quiz');
            }
        }
    };

    // 返回上一题
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setAnswers(answers.slice(0, -1));
        }
    };

    // 计算进度
    const progress = questions.length > 0
        ? ((currentQuestionIndex + 1) / questions.length) * 100
        : 0;

    // ============ 视图渲染 ============

    // Welcome 视图 - 完全遵循自测页面 UI
    const renderWelcome = () => (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 animate-fade-in relative z-10 bg-[#FDFBF7]">

            {/* Logo - 与自测首页一致 */}
            <div className="w-28 h-28 bg-gradient-to-br from-[#FF5D8D] to-[#FF8F70] rounded-[2rem] mb-5 shadow-[0_15px_40px_-10px_rgba(255,93,141,0.5)] flex items-center justify-center overflow-hidden relative border border-white/20">
                <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-[1px]"></div>
                <span className="relative text-white text-5xl font-black tracking-tighter drop-shadow-sm select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Lab
                </span>
            </div>

            {/* Brand Name */}
            <p className="text-brand-text font-bold tracking-widest text-sm mb-8">人生算法 Lab</p>

            {/* Main Title - 他测视角 */}
            <h1 className="text-2xl font-serif font-bold text-brand-text mb-3 text-center leading-tight whitespace-nowrap">
                360° MBTI 人格测试-他测视角
            </h1>

            {/* Subtitle */}
            <p className="text-brand-secondary text-sm mb-12 tracking-wide text-center">
                请根据对 TA 的感受如实选择
            </p>

            <div className="w-full max-w-xs space-y-4">
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="输入通行 Token"
                    className="w-full bg-transparent border-b border-brand-line py-3 text-center text-lg focus:outline-none focus:border-brand-pink transition-colors font-sans placeholder:text-gray-300"
                />
                <button
                    onClick={handleStart}
                    disabled={!token || isLoading}
                    className={`w-full py-4 rounded-full text-sm font-semibold tracking-widest transition-all transform active:scale-95 ${token ? 'bg-gradient-to-r from-brand-orange to-brand-pink text-white shadow-glow' : 'bg-gray-100 text-gray-300'}`}
                >
                    {isLoading ? '加载中...' : '立刻开始'}
                </button>
            </div>
        </div>
    );

    // Quiz 视图
    const renderQuiz = () => {
        if (questions.length === 0) {
            return (
                <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 text-sm">加载题目中...</p>
                    </div>
                </div>
            );
        }

        const currentQuestion = questions[currentQuestionIndex];

        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
                {/* 顶部导航栏 */}
                <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <button
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30"
                    >
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <span className="text-sm text-gray-500 font-medium">
                        {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <div className="w-10" /> {/* 占位 */}
                </div>

                {/* 进度条 */}
                <div className="w-full h-1 bg-gray-100">
                    <div
                        className="h-full bg-gradient-to-r from-brand-orange to-brand-pink transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* 题目内容 */}
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        {/* 题目文字 */}
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-10 leading-relaxed">
                            {currentQuestion.text}
                        </h2>

                        {/* 二选一选项 */}
                        <div className="space-y-4">
                            {/* 选项 A */}
                            <button
                                onClick={() => handleAnswer(currentQuestion.value_a)}
                                className="w-full p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-brand-pink hover:shadow-lg transition-all text-left active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-brand-pink/10 text-brand-pink font-bold flex items-center justify-center text-sm">
                                        A
                                    </span>
                                    <span className="text-gray-700 font-medium flex-1">
                                        {currentQuestion.option_a}
                                    </span>
                                </div>
                            </button>

                            {/* 选项 B */}
                            <button
                                onClick={() => handleAnswer(currentQuestion.value_b)}
                                className="w-full p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-brand-pink hover:shadow-lg transition-all text-left active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm">
                                        B
                                    </span>
                                    <span className="text-gray-700 font-medium flex-1">
                                        {currentQuestion.option_b}
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* 底部返回按钮 - 与自测页面一致 */}
                        <div className="mt-10">
                            {currentQuestionIndex > 0 ? (
                                <button
                                    onClick={handleBack}
                                    className="w-full py-4 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:text-brand-text hover:border-brand-text/30 hover:bg-white transition-all text-sm flex items-center justify-center gap-2 group"
                                >
                                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    返回上一题
                                </button>
                            ) : (
                                <button
                                    onClick={() => setViewState('welcome')}
                                    className="w-full py-4 text-gray-300 hover:text-gray-400 transition-colors text-xs flex items-center justify-center gap-1"
                                >
                                    <ChevronLeft size={14} />
                                    返回首页
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Submitting 视图
    const renderSubmitting = () => (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 font-medium">正在计算校准数据...</p>
                <p className="text-gray-400 text-sm mt-2">请稍候</p>
            </div>
        </div>
    );

    // Completed 视图
    const renderCompleted = () => (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-md w-full flex flex-col min-h-[80vh]">
                {/* 成功图标 */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center mb-6 shadow-lg">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>

                    {/* 标题 */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        感谢你的视角
                    </h1>
                    <p className="text-gray-500 mb-8">
                        TA 的全维MBTI报告已更新
                    </p>
                </div>

                {/* 底部品牌栏 */}
                <div className="w-full flex items-center gap-3 pt-5 border-t border-dashed border-gray-200 shrink-0 mt-auto pb-6">
                    <div className="w-full max-w-md mx-auto flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF5D8D] to-[#FF8F70] rounded-xl flex items-center justify-center text-white shadow-md shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10" />
                            <span className="font-black text-xs tracking-tighter font-sans relative z-10">Lab</span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-[9px] text-gray-400 font-bold tracking-[0.05em] uppercase mb-0.5">
                                GET YOUR OWN REPORT
                            </p>
                            <p className="text-[11px] text-gray-900 font-bold tracking-tight">
                                小红书搜索「<span className="text-brand-pink">人生算法 Lab</span>」获取同款
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 根据状态渲染对应视图
    switch (viewState) {
        case 'welcome':
            return renderWelcome();
        case 'quiz':
            return renderQuiz();
        case 'submitting':
            return renderSubmitting();
        case 'completed':
            return renderCompleted();
        default:
            return renderWelcome();
    }
};

export default PeerAssessment;
