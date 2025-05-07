import { ReactNode } from 'react';
import {ChildrenProps} from "../children-props.ts";


/**
 * Представляет пропсы компонента синхронного непрерывного рендеринга.
 */
interface ShowProps<TWhen> extends ChildrenProps {
    /**
     * Возвращает признак отображения дочернего компонента.
     */
    readonly when: TWhen | undefined | null;
    /**
     * Возвращает fallback компонента.
     */
    readonly fallback?: ReactNode;
}

/**
 * Представляет компонент синхронного непрерывного рендеринга.
 */
export function Show<TWhen>({ when, fallback = <BusyComponent isBusy />, children }: ShowProps<TWhen>) {
    return when ? children : fallback;
}


function BusyComponent (props: {isBusy: boolean}) {
    const {isBusy} = props

    return <>
        {isBusy ? <h1>LOADING............</h1>: null}
    </>
}