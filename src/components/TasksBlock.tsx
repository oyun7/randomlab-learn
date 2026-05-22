import React, { useState } from 'react';
import { type Task } from '../data/tasks';

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="task-item">
      <button className="task-item__header" onClick={() => setOpen(!open)}>
        <span className="task-item__num">Задача {task.id}</span>
        {task.simulatorHint && (
          <span className="task-item__sim-badge">🔬 Симулятор</span>
        )}
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

const TasksBlock: React.FC<{ tasks: Task[]; color: string }> = ({ tasks, color }) => {
  const [expanded, setExpanded] = useState(true);

  if (tasks.length === 0) return null;

  return (
    <div className="tasks-block" style={{ margin: '60px 0' }}>
      <button
        className="tasks-block__toggle"
        style={{ borderColor: color }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ color }}>📝</span>
        <span>Задачи</span>
        <span className="tasks-block__count" style={{ background: `${color}22`, color }}>
          {tasks.length}
        </span>
        <span className="task-item__arrow">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
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