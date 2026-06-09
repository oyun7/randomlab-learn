import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Компонент для рендеринга текста с поддержкой KaTeX формул.
 * Поддерживает inline формулы: $...$
 * и блочные формулы: $$...$$
 */
export const MathText: React.FC<MathTextProps> = ({ text, className }) => {
  // Разбиваем текст по строкам, затем обрабатываем каждую строку
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, idx) => {
        if (line.trim() === '') {
          return <br key={idx} />;
        }

        // Проверяем, есть ли блочная формула на всей строке
        if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
          const formula = line.trim().slice(2, -2).trim();
          return (
            <div key={idx} style={{ margin: '1em 0', overflow: 'auto' }}>
              <BlockMath>{formula}</BlockMath>
            </div>
          );
        }

        // Рендерим строку с inline формулами
        return (
          <p key={idx} className={className}>
            {renderInlineFormulas(line)}
          </p>
        );
      })}
    </>
  );
};

/**
 * Вспомогательная функция для рендеринга inline формул в обычном тексте
 */
function renderInlineFormulas(text: string): React.ReactNode[] {
  // Разбиваем по inline формулам $...$
  const parts = text.split(/(\$[^$]+\$)/);

  return parts.map((part, idx) => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
      // Это inline формула
      const formula = part.slice(1, -1);
      return <InlineMath key={idx}>{formula}</InlineMath>;
    }

    // Обычный текст
    return <span key={idx}>{part}</span>;
  });
}

export default MathText;
