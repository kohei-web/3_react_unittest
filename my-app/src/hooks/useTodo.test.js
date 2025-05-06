import { act, renderHook } from '@testing-library/react';
import useTodo from './useTodo';

describe('useTodo カスタムフック', () => {
    it('初期状態は正しいか', () => {
        const { result } = renderHook(() => useTodo());
        const [states] = result.current;

        expect(states.originalText).toBe('');
        expect(states.searchText).toBe('');
        expect(states.isModal).toBe(false);
        expect(states.showTodoList.length).toBe(2); // 初期データ2件
    });

    it('todo追加テキストが更新される', () => {
        const { result } = renderHook(() => useTodo());
        const [, actions] = result.current;

        act(() => {
        actions.handleSetOriginalText({ target: { value: '新しいTodo' } });
        });

        const [states] = result.current;
        expect(states.originalText).toBe('新しいTodo');
    });

    it('新しいTodoをEnterで追加できる', () => {
        const { result } = renderHook(() => useTodo());
        const [, actions] = result.current;

        // テキスト入力
        act(() => {
        actions.handleSetOriginalText({ target: { value: 'テストTodo' } });
        });

        // Enterキー入力イベント
        act(() => {
            result.current[1].createTodo({ key: 'Enter' });
        });

        const [states] = result.current; // もう一度取得し直す！
        expect(states.showTodoList.some(todo => todo.title === 'テストTodo')).toBe(true);
    });

    it('検索テキストでフィルタリングされる', () => {
        const { result } = renderHook(() => useTodo());
        const [, actions] = result.current;

        act(() => {
        actions.handleSetSearchText({ target: { value: 'Todo1' } });
        });

        const [states] = result.current;
        expect(states.showTodoList.length).toBe(1);
        expect(states.showTodoList[0].title).toBe('Todo1');
    });

    it('モーダルを開き、Todoを削除できる', () => {
        const { result } = renderHook(() => useTodo());
        const [, actions] = result.current;

        // モーダルを開く
        act(() => {
            actions.modalOpen({ id: 1, title: 'Todo1' });
        });

        // selectTodoを再取得
        const [, actionsAfterModal] = result.current

        // 削除を実行
        act(() => {
            actionsAfterModal.handleTodoDelete();
        });

        const [states] = result.current;
        expect(states.showTodoList.some(todo => todo.id === 1)).toBe(false);
        expect(states.isModal).toBe(false);
    });
});
