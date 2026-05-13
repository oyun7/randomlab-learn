import React, { useState } from 'react';
import { getTasksByLesson, type Task } from '../data/tasks';

const LEVEL_COLORS: Record<string, string> = {
  'ОГЭ':              '#4ade80',
  'ЕГЭ базовый':      '#38bdf8',
  'ЕГЭ профильный':   '#a78bfa',
  'ЕГЭ повышенный':   '#f472b6',
  'Симулятор':        '#fb923c',
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const color = LEVEL_COLORS[task.level] || '#94a3b8';

  return (
    <div className="task-item">
      <button className="task-item__header" onClick={() => setOpen(!open)}>
        <span className="task-item__badge" style={{ background: `${color}22`, color }}>
          {task.level}
        </span>
        <span className="task-item__num">Задание {task.id}</span>
        {task.simulatorHint && <span className="task-item__sim-badge">🔬 Симулятор</span>}
        <span className="task-item__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="task-item__body">
          <p className="task-item__text">{task.text}</p>

          {task.simulatorHint && (
            <div className="task-item__sim-hint">🔬 {task.simulatorHint}</div>
          )}

          {!showSolution ? (
            <button
              className="task-item__solution-btn"
              onClick={() => setShowSolution(true)}
            >
              Показать решение
            </button>
          ) : (
            <div className="task-item__solution">
              <div className="task-item__solution-label">Решение</div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{task.solution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TasksBlock: React.FC<{ lessonSlug: string; color: string }> = ({ lessonSlug, color }) => {
  const tasks = getTasksByLesson(lessonSlug);

  return (
    <div className="tasks-block" style={{ margin: '60px 0' }}>
      <button
        className="tasks-block__toggle"
        style={{ borderColor: color }}
        onClick={() => {}} // можно потом добавить состояние
      >
        <span style={{ color }}>📝</span>
        <span>Задачи к уроку</span>
        <span className="tasks-block__count" style={{ background: `${color}22`, color }}>
          {tasks.length}
        </span>
      </button>

      {tasks.length === 0 ? (
        <div style={{
          padding: '32px',
          background: '#1f293720',
          border: `2px dashed ${color}40`,
          borderRadius: '12px',
          color: '#94a3b8',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          Задачи для этого урока пока не добавлены<br />
          <small>Slug урока: <code>{lessonSlug}</code></small>
        </div>
      ) : (
        <div className="tasks-block__list" style={{ marginTop: '20px' }}>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksBlock;