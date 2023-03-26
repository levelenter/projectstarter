# 起動方法

```
docker compose up -d
```

## 動作確認

ブラウザを 2 つ立ち上げて http://localhost:8080/sv/ でアクセス(最後のスラ必要)
簡易なアバターでお互いを認識できる

## 構成

- nginx
  Nginx を起動し、8080->docker->80->nginx->プロキシ
  localhost:8080/sv/ → コンテンツ
  localhost:8080/ → シグナリング

- server
  Express でスタティックに client フォルダ返すだけ

- sig
  Websocket

# 再起動(キャッシュ削除リビルド)

```
docker compose down
docker compose build --no-cache
docker compose up -d
```


```
 docker-compose exec starter_server bash
```

コンソールに入る
```
docker compose exec nginx bash
```

Dockerコンテナの中からホストマシンのlocalhostに接続する方法
https://peblo.gs/get-host-machine-ip-address-in-docker-container/


Astroからaxiosやfetchやらで、RestAPIを呼ぼうとするとCORSの制限に引っかかる。

ローカルだとClientとServerをそれぞれポートを分けて立てたりするから。

仮に以下のようにするとする

Astro => http://localhost:3000/

Server => http://localhost:8080/api/

Astro側のpackage.jsonに"proxy": "http://localhost:8080/と、サーバーのホストを知らせてやれば良い。

```
{
 "name": "sampleservice",
 "type": "module",
 "proxy": "http://localhost:8080/,
 "version": "0.0.1",
 ・・・
}
```