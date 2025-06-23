# Gemini LINE AI ChatBot Basic
このシステムはGemini APIを使用して、LINE BotをAI ChatBotとして使用するためのものです。このシステムはGoogle App Scriptでの動作を想定しています。

## システム構成
* 開発言語
  * Google App Script（Javascript）
* 使用外部API
  * LINE Messaging API
  * Gemini API

## 使用方法
1. コード.jsの内容をGoogle App Scriptにコピー＆ペースとします。
2. LINE for Businessにアクセスします。その際、LINE Businessアカウントが内場合は登録します。
3. Botになる公式アカウントを作成します。
4. 続いてLINE Developer Consoleへ移動し、ログイン後、プロバイダーを作成します。
5. その後、LINE Messaging APIのチャンネルを作成し、先程作った公式アカウントを選択します。
6. Messaging APIの設定に行き、チャンネルアクセストークンを発行します。
7. Google App Scriptに戻り、プロジェクト設定へ移動、スクリプトプロパティを設定します。ここでプロパティ名は「LINE_ACCESS_TOKEN」にすると、元のコードの改変なく動きます。
8. 続いて、Google AI Studioに行き、Gemini APIを発行します。
9. チャンネルアクセストークン同様にスクリプトプロパティを設定します。ここでプロパティ名は「GEMINI_API_KEY」にすると、元のコードの改変なく動きます。
10. Google App Scriptをデプロイします。デプロイから新規デプロイを選択し、歯車マークよりWebアプリケーションを選択します。説明文を追加し、アクセスできるユーザーを全員に設定して、デプロイします。
11. 発行されたウェブアプリのURLをコピーします。
12. LINE Developer ConsoleのMessaging APIの設定に戻ります。
13. 先ほどコピーしたURLをWebhook URLにセットして、検証を押します。ここで成功と出れば完了です。
14. Webhookを利用するを有効にし、応答メッセージ設定から応答メッセージとチャットの応答方法の応答時間のチェックを外します。
15. Botにメッセージを送り、正常に返ってきたら完了です。

## Geminiモデルを変更する方法

urlのmodels/gemini-2.5-flashをお好みのモデルに変更することで変更できます。

```javascript
function runGeminiApi(prompt){
  const payload = {
    contents : [
      {
        parts: [
          { text: prompt },
        ],
      },
    ],
    tools : [
      {
        "google_search": {},
      },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  // このコードのmodels/gemini~を変更するとモデルが変更されます。
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  const response = UrlFetchApp.fetch(url,options);
  const data = JSON.parse(response);
  const content = data['candidates'][0]['content']['parts'][0]['text'];
  return content;
}
```

## リンク
* [LINE for Business](https://manager.line.biz/)
* [LINE Developer Console](https://developers.line.biz/console/)
* [Google AI Studio](https://aistudio.google.com)