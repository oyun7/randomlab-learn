import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Компонент для рендеринга текста с поддержкой KaTeX формул.
 * Поддерживает:
 * - блочные формулы: $$...$$  (на отдельной строке)
 * - inline формулы: $...$  (внутри текста)
 */
export const MathText: React.FC<MathTextProps> = ({ text, className }) => {
  // Сначала разбиваем на блочные формулы (на отдельных строках)
  // затем обрабатываем каждый блок для inline формул
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        
        // Пустая строка
        if (trimmed === '') {
          return <br key={lineIdx} />;
        }

        // Блочная формула (вся строка между $$)
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
          const formula = trimmed.slice(2, -2).trim();
          if (formula) {
            return (
              <div 
                key={lineIdx}
                style={{ 
                  margin: '1em 0',
                  padding: '0.5em',
                  overflowX: 'auto',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <BlockMath>{formula}</BlockMath>
              </div>
            );
          }
        }

        // Строка с inline формулами
        return (
          <p key={lineIdx} className={className} style={{ margin: '0.5em 0' }}>
            {renderInlineFormulas(trimmed)}
          </p>
        );
      })}
    </>
  );
};

/**
 * Парсит строку и рендерит inline формулы $...$
 */
function renderInlineFormulas(text: string): React.ReactNode[] {
  if (!text || text.length === 0) {
    return [];
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let inFormula = false;
  let formulaStart = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$') {
      // Проверяем, что это не $$
      if (i + 1 < text.length && text[i + 1] === '$') {
        continue; // Это $$, пропускаем (для блочных формул)
      }

      if (!inFormula) {
        // Начало формулы
        if (lastIndex < i) {
          result.push(<span key={`text-${result.length}`}>{text.slice(lastIndex, i)}</span>);
        }
        inFormula = true;
        formulaStart = i;
      } else {
        // Конец формулы
        const formula = text.slice(formulaStart + 1, i);
        if (formula) {
          result.push(
            <InlineMath key={`math-${result.length}`}>{formula}</InlineMath>
          );
        }
        inFormula = false;
        lastIndex = i + 1;
      }
    }
  }

  // Остаток текста после последней формулы
  if (lastIndex < text.length) {
    result.push(<span key={`text-${result.length}`}>{text.slice(lastIndex)}</span>);
  }

  return result.length > 0 ? result : [text];
}

export default MathText;
