// グローバル変数
let todos = [];
let currentFilter = 'all';

// DOM要素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
    renderTodos();
});

// イベントリスナーの設定
function setupEventListeners() {
    // TODO追加
    addBtn.addEventListener('click', handleAddTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    });

    // フィルタ切り替え
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTodos();
        });
    });
}

// ローカルストレージからTODOを読み込み
function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        try {
            todos = JSON.parse(stored);
        } catch (e) {
            console.error('Failed to load todos:', e);
            todos = [];
        }
    }
}

// ローカルストレージにTODOを保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// TODO追加
function handleAddTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('TODOを入力してください');
        return;
    }

    addTodo(text);
    todoInput.value = '';
    todoInput.focus();
}

function addTodo(text) {
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: Date.now()
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
}

// TODO削除
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// TODO完了切り替え
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// TODO編集
function editTodo(id, newText) {
    const todo = todos.find(t => t.id === id);
    if (todo && newText.trim() !== '') {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

// TODOのレンダリング
function renderTodos() {
    // フィルタリング
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // リストをクリア
    todoList.innerHTML = '';

    // 空状態の表示
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }

    // TODO項目を生成
    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });

    // 統計を更新
    updateStats();
}

// TODO要素の生成
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    // TODO内容
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    textSpan.addEventListener('dblclick', () => enterEditMode(li, todo));

    contentDiv.appendChild(textSpan);

    // アクション
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '編集';
    editBtn.addEventListener('click', () => enterEditMode(li, todo));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => {
        if (confirm('このTODOを削除しますか?')) {
            deleteTodo(todo.id);
        }
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    return li;
}

// 編集モードに切り替え
function enterEditMode(li, todo) {
    li.classList.add('editing');

    const contentDiv = li.querySelector('.todo-content');
    const actionsDiv = li.querySelector('.todo-actions');

    // 編集入力フィールド
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-edit-input';
    input.value = todo.text;

    contentDiv.innerHTML = '';
    contentDiv.appendChild(input);
    input.focus();
    input.select();

    // 保存・キャンセルボタン
    actionsDiv.innerHTML = '';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '保存';
    saveBtn.addEventListener('click', () => {
        const newText = input.value.trim();
        if (newText !== '') {
            editTodo(todo.id, newText);
        } else {
            alert('TODOを入力してください');
        }
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'キャンセル';
    cancelBtn.addEventListener('click', () => renderTodos());

    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);

    // Enterキーで保存
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });

    // Escapeキーでキャンセル
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
}

// 統計を更新
function updateStats() {
    const total = todos.length;
    const active = todos.filter(todo => !todo.completed).length;
    const completed = todos.filter(todo => todo.completed).length;

    totalCount.textContent = `全て: ${total}`;
    activeCount.textContent = `未完了: ${active}`;
    completedCount.textContent = `完了: ${completed}`;
}
