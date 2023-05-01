# Netflix Clone

這是一個使用 Next.js、TypeScript、Tailwind、Firebase、Stripe、Recoil、以及串接 tmdb api 建構而成的 Netflix clone 專案。

Demo：https://netflix-clone-linyu0801.vercel.app/

## 如何使用

在本地端進行開發：

1.Clone 這個專案：

```bash
git clone https://github.com/yourusername/netflix-clone.git
```

2.安裝相依套件：

```bash
cd netflix-clone
npm install
```

3.在根目錄下新增 .env.local 檔案，並加入以下設定：

```bash
NEXT_PUBLIC_API_KEY=your_tmdb_api_key
```

開啟開發伺服器：

```bash
npm run dev
```

在瀏覽器中開啟 http://localhost:3000 進行測試。

Stripe 測試環境請使用 https://stripe.com/docs/testing 作為假信用卡使用。

## 功能介紹

使用 Firebase 進行註冊、登入與收藏影片。
串接 tmdb api 取得電影資料並顯示在首頁。
使用 Recoil 管理狀態。
使用 Stripe 模擬付款，可建立訂閱商品種類，同步至 Firebase。
RWD 切版，支援不同的裝置大小。

## 聲明

本專案僅作為個人練習使用，不用於商業用途。

License
MIT License
