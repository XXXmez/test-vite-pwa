import { ReactNode } from 'react';

/**
 * Представляет базовый тип для свойств компонента с вложенными элементами.
 */
export interface ChildrenProps {
    /**
     * Возвращает или устанавливает вложенные элементы.
     */
    children: ReactNode;
}
