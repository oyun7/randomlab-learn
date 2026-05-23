import React, { useState } from 'react';
import {
  REGULAR_TASKS,
  TASK_CATEGORIES,
  type RegularTask,
  type TaskCategory,
  type TaskCategoryKey,
} from '../data/tasks';

// ─── Утилита для формирования метки задачи ────────────────

function formatTaskLabel(task: RegularTask): string {
  const levelMap: Record<string, string> = {
    'ОГЭ': 'ОГЭ',
    'ЕГЭ, базовый уровень': 'ЕГЭ базовый уровень',
    'ЕГЭ, профильный уровень': 'ЕГЭ профильный уровень',
    'ЕГЭ, повышенная сложность': 'ЕГЭ повышенная сложность',
    'Адаптировано под симулятор': 'адаптировано под симулятор',
  };
  const levelStr = levelMap[task.level] ?? task.level;
  return `Задача ${task.id} (${levelStr})`;
}

// ─── Цвета уровней ─────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  'ОГЭ': '#4ade80',
  'ЕГЭ, базовый уровень': '#38bdf8',
  'ЕГЭ, профильный уровень': '#a78bfa',
  'ЕГЭ, повышенная сложность': '#f472b6',
  'Адаптировано под симулятор': '#fb923c',
};

// ─── TaskItem ──────────────────────────────────────────────

const TaskItem: React.FC<{ task: RegularTask }> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const color = LEVEL_COLORS[task.level] ?? '#94a3b8';
  const label = formatTaskLabel(task);

  return (
    <div className="task-item">
      <button className="task-item__header" onClick={() => setOpen(!open)}>
        <span className="task-item__num">{label}</span>
        <span
          className="task-item__badge"
          style={{ background: `${color}22`, color }}
        >
          {task.level}
        </span>
        {task.isSimulator && (
          <span className="task-item__sim-badge">🔬 Симулятор</span>
        )}
        <span className="task-item__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="task-item__body">
          <p className="task-item__text">{task.text}</p>

          {task.isSimulator && task.simulatorHint && (
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

// ─── CategoryPanel ─────────────────────────────────────────

const CategoryPanel: React.FC<{
  category: TaskCategory;
  tasks: RegularTask[];
  isActive: boolean;
  onToggle: () => void;
}> = ({ category, tasks, isActive, onToggle }) => {
  const [showAll, setShowAll] = useState(false);

  const simulatorTasks = tasks.filter(t => t.isSimulator);
  const regularTasks = tasks.filter(t => !t.isSimulator);

  return (
    <div
      className="task-category-panel"
      style={{
        marginBottom: '16px',
        borderRadius: '16px',
        border: `1px solid ${isActive ? category.color : 'rgba(255,255,255,0.08)'}`,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        background: isActive ? `${category.color}08` : 'rgba(255,255,255,0.03)',
      }}
    >
      {/* Заголовок категории */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '18px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{category.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: isActive ? category.color : '#fff',
            marginBottom: '4px',
            transition: 'color 0.2s',
          }}>
            {category.label}
          </div>
          <div style={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.4,
          }}>
            {category.description}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{
            background: `${category.color}22`,
            color: category.color,
            borderRadius: '8px',
            padding: '2px 10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            fontFamily: 'Mulish, sans-serif',
          }}>
            {tasks.length}
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.8rem',
            transition: 'transform 0.2s',
            transform: isActive ? 'rotate(180deg)' : 'none',
          }}>▼</span>
        </div>
      </button>

      {/* Список задач */}
      {isActive && (
        <div style={{ padding: '0 16px 16px' }}>
          {/* Обычные задачи */}
          {regularTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}

          {/* Симуляторные задачи — в отдельном блоке внутри категории */}
          {simulatorTasks.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                padding: '8px 12px',
                background: 'rgba(251,146,60,0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(251,146,60,0.2)',
              }}>
                <span>🔬</span>
                <span style={{
                  fontFamily: 'Mulish, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#fb923c',
                }}>
                  Задачи для симулятора
                </span>
                <span style={{
                  background: 'rgba(251,146,60,0.2)',
                  color: '#fb923c',
                  borderRadius: '6px',
                  padding: '1px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {simulatorTasks.length}
                </span>
              </div>
              {simulatorTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── LevelLegend ───────────────────────────────────────────

const LevelLegend: React.FC = () => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  }}>
    {Object.entries(LEVEL_COLORS).map(([level, color]) => (
      <span
        key={level}
        style={{
          background: `${color}22`,
          color,
          borderRadius: '8px',
          padding: '3px 10px',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: 'Mulish, sans-serif',
          border: `1px solid ${color}44`,
        }}
      >
        {level}
      </span>
    ))}
  </div>
);

// ─── TasksBlock (главный экспорт) ──────────────────────────

interface TasksBlockProps {
  /** Если передан — показывает только задачи из этой категории */
  filterCategory?: TaskCategoryKey;
  color?: string;
}

const TasksBlock: React.FC<TasksBlockProps> = ({ filterCategory, color = '#a78bfa' }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeCategory, setActiveCategory] = useState<TaskCategoryKey | null>(null);

  const categoriesToShow = filterCategory
    ? TASK_CATEGORIES.filter(c => c.key === filterCategory)
    : TASK_CATEGORIES;

  const getTasksForCategory = (key: TaskCategoryKey): RegularTask[] =>
    REGULAR_TASKS.filter(t => t.category === key);

  const totalCount = categoriesToShow.reduce(
    (acc, cat) => acc + getTasksForCategory(cat.key).length,
    0
  );

  if (totalCount === 0) return null;

  return (
    <div className="tasks-block" style={{ margin: '60px 0' }}>
      {/* Кнопка-заголовок раздела */}
      <button
        className="tasks-block__toggle"
        style={{ borderColor: color }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ color }}>📝</span>
        <span>Задачи</span>
        <span
          className="tasks-block__count"
          style={{ background: `${color}22`, color }}
        >
          {totalCount}
        </span>
        <span className="task-item__arrow">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ marginTop: '24px' }}>
          {/* Легенда */}
          <LevelLegend />

          {/* Категории */}
          {categoriesToShow.map(category => {
            const tasks = getTasksForCategory(category.key);
            if (tasks.length === 0) return null;

            const isActive = activeCategory === category.key;

            return (
              <CategoryPanel
                key={category.key}
                category={category}
                tasks={tasks}
                isActive={isActive}
                onToggle={() =>
                  setActiveCategory(isActive ? null : category.key)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksBlock;