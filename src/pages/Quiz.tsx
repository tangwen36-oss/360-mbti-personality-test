import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../services/api';
import { Question } from '../../types';

const Quiz: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const accessCode = (location.state as any)?.accessCode || '';
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [history, setHistory] = useState<number[]>([]);
    const [answers, setAnswers] = useState<{ questionId: number, value: string }[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isTransitioning = useRef(false);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setIsLoading(true);
                const data = await api.fetchQuestions();
                setQuestions(data);
            } catch (error) {
                console.error('加载题目失败:', error);
                alert('加载题目失败，请刷新页面重试');
            } finally {
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, []);

    const handleOptionSelect = async (optionIndex: number) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        const currentQuestion = questions[currentQuestionIndex];

        // --- 核心逻辑: 获取选项对应的值 ---
        // 优先使用后端返回的 values。如果不存在 (旧数据)，为了保证流程跑通，
        // 我们假设: 索引0/1/2/3 分别对应某种维度。
        // 但这里为了稳健，如果 values 不存在，我们可以 log warning 并 mock 一个值，或者以此为契机 Mock 数据。
        // 根据 User 的提示 "假设 ans.value 是 'E' 或 'I' 等"，我们尝试获取。

        let selectedValue = '';
        if (currentQuestion.values && currentQuestion.values[optionIndex]) {
            selectedValue = currentQuestion.values[optionIndex];
        } else {
            console.warn(`Question ${currentQuestion.id} missing values, using fallback.`);
            // Fallback Logic (Mocking for Demo if DB is empty of values)
            // 假设: 偶数题判断 E/I, 奇数题判断 S/N... 这是一个临时的 Mock
            // 为了让算分逻辑跑通 (E/I/S/N/T/F/J/P)
            const mockValues = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
            selectedValue = mockValues[optionIndex % mockValues.length] || 'E';
        }

        // Record Answer
        const newAnswer = { questionId: currentQuestion.id, value: selectedValue };
        // Replace if exists (backtracking) or push
        const newAnswers = [...answers];
        // Ensure we are setting the answer for THIS question index roughly
        // But simpler: just filter out old answer for this question ID and append new
        const filtered = newAnswers.filter(a => a.questionId !== currentQuestion.id);
        setAnswers([...filtered, newAnswer]);

        // Simulate instant jump with tiny delay for ripple effect
        setTimeout(async () => {
            if (currentQuestionIndex < questions.length - 1) {
                setHistory([...history, currentQuestionIndex]);
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // 答题完成，提交真实数据
                try {
                    setIsLoading(true);

                    // Call API to create report
                    // Ensure we pass final state of answers (including current one)
                    const finalAnswers = [...filtered, newAnswer];
                    const reportData = await api.createReport(finalAnswers, accessCode);

                    // Navigate to Result with ID
                    navigate(`/result/${reportData.id}`);
                } catch (error) {
                    console.error('提交失败:', error);
                    alert('生成报告失败，请重试');
                } finally {
                    setIsLoading(false);
                }
            }
            isTransitioning.current = false;
        }, 150);
    };

    const handleBack = () => {
        if (history.length > 0) {
            const prev = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setCurrentQuestionIndex(prev);
        } else {
            navigate('/');
        }
    };

    if (isLoading || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center animate-fade-in">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-brand-secondary text-sm">加载中...</p>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="min-h-screen flex flex-col animate-fade-in relative z-10">
            {/* Fixed Header with Progress and Nav */}
            <div className="fixed top-0 left-0 w-full z-20 bg-brand-bg/95 backdrop-blur-md">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-100">
                    <div
                        className="h-full bg-gradient-to-r from-brand-orange to-brand-pink transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,93,141,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Top Nav Bar - Minimized */}
                <div className="flex justify-end items-center px-6 py-5">
                    {/* Numeric Counter Only */}
                    <div className="flex items-baseline font-mono tracking-widest text-brand-text">
                        <span className="text-xl font-bold">{String(currentQuestionIndex + 1).padStart(2, '0')}</span>
                        <span className="text-xs text-gray-300 mx-1.5 font-light">/</span>
                        <span className="text-sm text-gray-400">{String(totalQuestions).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full pt-28 pb-12">
                <span className="text-xs font-bold text-brand-pink mb-6 tracking-widest uppercase">
                    Question 0{currentQuestionIndex + 1}
                </span>
                <h2 className="text-2xl font-serif font-bold leading-relaxed text-brand-text mb-12">
                    {question.text}
                </h2>

                <div className="space-y-4">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className="w-full text-left p-5 bg-white rounded-xl shadow-card border border-transparent hover:border-brand-pink/30 hover:shadow-md transition-all active:scale-[0.99] group"
                        >
                            <span className="text-sm text-gray-600 group-hover:text-brand-pink transition-colors">
                                {opt}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Bottom Back Button - More Obvious */}
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
                            onClick={() => navigate('/')}
                            className="w-full py-4 text-gray-300 hover:text-gray-400 transition-colors text-xs flex items-center justify-center gap-1"
                        >
                            <ChevronLeft size={14} />
                            返回首页
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Quiz;
