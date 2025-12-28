import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // クライアントサイドでapp.jsを読み込み
    const script = document.createElement('script');
    script.src = '/app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>TODOアプリ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <div className="container">
        <h1>TODO リスト</h1>

        {/* TODO追加フォーム */}
        <div className="todo-form">
          <input
            type="text"
            id="todoInput"
            placeholder="新しいTODOを入力..."
            autoComplete="off"
          />
          <button id="addBtn">追加</button>
        </div>

        {/* フィルタボタン */}
        <div className="filter-buttons">
          <button className="filter-btn active" data-filter="all">全て</button>
          <button className="filter-btn" data-filter="active">未完了</button>
          <button className="filter-btn" data-filter="completed">完了</button>
        </div>

        {/* TODO統計 */}
        <div className="stats">
          <span id="totalCount">全て: 0</span>
          <span id="activeCount">未完了: 0</span>
          <span id="completedCount">完了: 0</span>
        </div>

        {/* TODOリスト */}
        <ul id="todoList" className="todo-list"></ul>

        {/* 空状態メッセージ */}
        <div id="emptyState" className="empty-state">
          TODOがありません
        </div>
      </div>
    </>
  );
}
