import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LearnPage from './pages/LearnPage';
import TasksPage from './pages/TasksPage';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:slug" element={<LearnPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </>
  );
};

export default App;