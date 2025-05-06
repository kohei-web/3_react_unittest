import { render, screen, fireEvent, within } from '@testing-library/react';
import TodoTemplate from './index.jsx';
import { describe, it, expect } from 'vitest';

it('初期表示で2件のTodoが表示される', () => {
    render(<TodoTemplate />);
    const todos = screen.getAllByRole('listitem');
    expect(todos).toHaveLength(2);
});

it('新しいTodoを追加できる', async () => {
    render(<TodoTemplate />);
    const input = screen.getByPlaceholderText('todo追加');

    fireEvent.change(input, { target: { value: '新しいTodo' } });
    fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' });

    // 仮想DOMに新しいTodoリストが追加されるのを待つ
    expect(await screen.findByText('新しいTodo')).toBeInTheDocument();
});

it('検索でTodoを絞り込める', () => {
    render(<TodoTemplate />);
    const searchInput = screen.getByPlaceholderText('todoを検索');

    fireEvent.change(searchInput, { target: { value: 'Todo1' } });

    expect(screen.getByText('Todo1')).toBeInTheDocument();
    expect(screen.queryByText('Todo2')).not.toBeInTheDocument();
});

it('削除ボタンを押すとモーダルが表示され、削除ボタンでTodoが消える', () => {
    render(<TodoTemplate />);

    const deleteButton = screen.getAllByText('削除ボタン')[0];
    fireEvent.click(deleteButton);

    // モーダルが表示される
    expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument();

    const confirmDelete = screen.getByText('はい');
    fireEvent.click(confirmDelete);

    // Todo1が削除される
    expect(screen.queryByText('Todo1')).not.toBeInTheDocument();
});
