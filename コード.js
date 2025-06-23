const REPLY_URL     = 'https://api.line.me/v2/bot/message/reply';
const LOADING_URL = 'https://api.line.me/v2/bot/chat/loading/start';
const LINEAPI_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

function doPost(e){
  const eventData = JSON.parse(e.postData.contents).events[0]
        , repToken = eventData.replyToken
        , chatId = eventData.source.userId;
  const prompt_message = eventData.message.text;
  doLoading(chatId);
  const result = runGeminiApi(prompt_message);
  replyTxt(repToken, result);
}

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

function doLoading(chatId){
  const options = {
                    'method' : 'post',
                    'headers' : {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + LINEAPI_TOKEN,
                    },
                    'payload' : JSON.stringify({
                      'chatId': chatId,
                      'loadingSeconds': 30
                    })
                  };
  UrlFetchApp.fetch(LOADING_URL, options)
}

function replyTxt(token, txt){
  const message = {
                    'replyToken' : token,
                    'messages' : [{
                      'type': 'text',
                      'text': txt
                    }]
                  }
        , options = {
                    'method' : 'post',
                    'headers' : {
                      'Content-Type': 'application/json; charset=UTF-8',
                      'Authorization': 'Bearer ' + LINEAPI_TOKEN,
                    },
                    'payload' : JSON.stringify(message)
                  };
  UrlFetchApp.fetch(REPLY_URL, options);
}
