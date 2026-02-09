import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './src/pages/Home';
import Quiz from './src/pages/Quiz';
import Result from './src/pages/Result';
import PeerAssessment from './src/pages/PeerAssessment';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/result" element={<Result />} /> {/* Backward compatibility or fallback */}
        <Route path="/peer/:id" element={<PeerAssessment />} /> {/* 他测页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;