# walica-clone-backend

## walica-cloneについて

[walica](https://walica.jp)という、旅行などの立替を記録しておくと、最終的に誰が誰にいくら払えばいいのかを計算してくれる素晴らしいサービスがあります。
これを再現してみようという試みです。

フロントエンドはこのリポジトリ、バックエンドは[walica-clone-backend](https://github.com/uchijo/walica-clone-backend)にあります。

実際に作ったものに関しては、[こちら(https://walica-clone.uchijo.com)](https://walica-clone.uchijo.com)で公開しており、実際に動作しているところを確認いただけます。

## 使用しているツール類（主要なもののみ）

- gorm
  - SQLite
- grpc-gateway

## 動かし方

動かす際に、以下の環境変数の設定が必要です。

- `NEXT_PUBLIC_API_BASE`: バックエンドのapiのエンドポイントのベースを指定します。

これを設定した上で以下のコマンドを使用することで動作確認を行えます。

```bash
npm run dev
```

```bash
npm build && npm start
```

## その他注意点など

apiはswaggerで自動生成しており、最新の`api.swagger.json`は[こちら](https://github.com/uchijo/walica-clone-backend/blob/main/proto/gen/openapiv2/api/api.swagger.json)から確認できます。
なお、バックエンドのapiのスタブ生成はgrpc-gatewayを用いており、[api.proto](https://github.com/uchijo/walica-clone-backend/blob/main/proto/api/api.proto)から諸々のコードを生成しています。
`api.swagger.json`に関しても、上記の`api.proto`からバックエンド用のスタブを生成する際に自動生成されるようになっています。
