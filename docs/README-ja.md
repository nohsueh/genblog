# GenBlog

[English](../README.md) | [Español](README-es.md) | [Deutsch](README-de.md) | [Français](README-fr.md) | [中文](README-zh.md)

## プロジェクト概要

GenBlogは、Next.jsで構築された最新のブログシステムで、多言語コンテンツ管理をサポートしています。エレガントなユーザーインターフェースと強力な管理機能を提供し、ブログコンテンツを簡単に作成・管理することができます。

![/path/to/your/blog/console page](../imgs/dashboard-create.png "/path/to/your/blog/console page")

## 主な機能

- 📝 AI + 検索エンジン + Webクローラーによる一括ブログコンテンツ生成
- 💻 ウェブサイトの任意のパスへのデプロイをサポート
- 🌐 多言語サポート（英語、スペイン語、ドイツ語、日本語、フランス語、中国語）
- 🔍 SEO 最適化、robots.txt、sitemap_index.xml、ads.txt など。
- 📱 レスポンシブデザイン、モバイル対応
- 🎨 モダンなUIインターフェース
- 🔒 セキュアな認証システム
- 📊 ブロググループ管理
- 🔄 リアルタイムプレビューと編集

## 技術スタック

- **フロントエンドフレームワーク**: Next.js 15
- **UIコンポーネント**:
  - Radix UI
  - Tailwind CSS
  - shadcn/ui
- **コンテンツ処理**:
  - Markdownサポート
  - Prism.jsコードハイライト
- **状態管理**: React Hooks
- **スタイリング**: Tailwind CSS
- **国際化**: 組み込み多言語サポート

## クイックスタート

### 必要条件

- [Vercelアカウント](https://vercel.com)
- [Searchlysisアカウント](https://searchlysis.com)

### Vercelデプロイ手順

1. プロジェクトのフォーク

   - [GenBlog GitHubリポジトリ](https://github.com/nohsueh/genblog)にアクセス
   - 右上の「Fork」ボタンをクリックして、プロジェクトをGitHubアカウントにコピー

2. Vercelへのインポート

   - [Vercel](https://vercel.com)にログイン
   - 「Add New...」ボタンをクリック
   - 「Project」を選択
   - 「Import Git Repository」セクションで、フォークしたGenBlogリポジトリを選択
   - 「Import」をクリック

3. プロジェクトの設定

   - プロジェクト設定ページで、デフォルト設定を維持
   - 「Environment Variables」をクリックして、以下の環境変数を追加：

   ```env
   # 必須設定
   NEXT_PUBLIC_APP_NAME="アプリケーション名"
   NEXT_PUBLIC_ROOT_DOMAIN="ドメイン名"
   SEARCHLYSIS_API_KEY="Searchlysis APIキー"
   PASSWORD="管理者パスワード"

   # オプション設定
   NEXT_PUBLIC_BASE_PATH="/path/to/your/blog"  # ブログがルートパスにデプロイされていない場合
   NEXT_PUBLIC_APP_DESCRIPTION="アプリケーションの説明"
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="Googleサイト認証コード"
   NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT="Google AdSenseアカウント"
   ```

4. プロジェクトのデプロイ

   - 「Deploy」ボタンをクリック
   - Vercelが自動的にビルドとデプロイプロセスを開始
   - デプロイの完了を待機（通常1-2分）

5. カスタムドメインの設定（オプション）

   - Vercelプロジェクトダッシュボードで「Settings」をクリック
   - 「Domains」を選択
   - カスタムドメインを追加
   - Vercelの指示に従ってDNSレコードを設定

6. デプロイの確認

   - VercelデプロイURLまたはカスタムドメインにアクセス
   - ウェブサイトが正常に動作することを確認
   - 管理者ログイン機能をテスト (yourdomain.com/path/to/your/blog/[en | es | de | ja | fr | zh]/console)
   - 言語切り替えが正常に機能することを確認

7. /path/to/your/blog サブパスでブログをホストします（例として Next.js を使用）
   - `next.config.ts` にリバースプロキシを追加します

```ts next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/path/to/your/blog",
        destination: "https://yoursubdomain.vercel.app/path/to/your/blog",
      },
      {
        source: "/path/to/your/blog/:path*",
        destination: "https://yoursubdomain.vercel.app/path/to/your/blog/:path*",
      },
    ];
  },
};

export default nextConfig;
```

## デプロイガイド

### 環境変数ガイド

- `NEXT_PUBLIC_APP_NAME`: ブログ名（ブラウザタブとページタイトルに表示）
- `NEXT_PUBLIC_ROOT_DOMAIN`: ウェブサイトのドメイン（正規リンクとソーシャルメディア共有に使用）
- `SEARCHLYSIS_API_KEY`: コンテンツ分析と生成のためのSearchlysis APIキー
- `PASSWORD`: 管理者ログインパスワード
- `NEXT_PUBLIC_BASE_PATH`: ブログがルートパスにデプロイされていない場合に設定
- `NEXT_PUBLIC_APP_DESCRIPTION`: SEO用のウェブサイト説明
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console認証コード
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT`: 広告表示用のGoogle AdSenseアカウント

## 貢献

プロジェクトの改善のためのプルリクエストとイシューレポートを歓迎します。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています - 詳細は[LICENSE](../LICENSE)ファイルを参照してください
