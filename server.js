const express = require('express');
const https = require('https');
const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client

const app = express()

const config = {
  channelAccessToken: 'atgjSlYb/Mg+N2PKPOPDiKRpgdnBcahDiSdhpJUegXO7sCdjCwrVkvPPh9uUffox0ZfUULXsrQUX89rCGqv/2P/0cqWeR9LRDAIrzrHd/fPCk8cfMvrPSuRlbtpeR+SkmKqw7bduPQ3Ml4Jin4NjGAdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'caac762e9fcce0d5c08290944a05449c'
}

const client = new  Client(config);

app.get('/', function (req, res) {
	res.send('chatbot-nodejs-heroku-starter!! Hi world.');
})

app.post('/webhook', middleware(config), (req, res) => {
  res.sendStatus(200);
  console.log(req.body.events); // webhook event objects
  console.log(req.body.destination); // user ID of the bot (optional)
  Promise
    .all(req.body.events.map(hanndleEvent))
})

app.set('port', (process.env.PORT || 4000))

function hanndleEvent(event) {
  // let msg = {
  //   type: "text",
  //   text: event.message.text
  // }
  var userData = {
    user_name: '',
    user_age: '',
    user_gender: '',
    user_action: {
      first_hello: false
    }
  }
  var sayHiMessage = [
    "สวัสดี",
    "ดีครับ",
    "ดีค่ะ",
    "ดีจ้า",
    "สวัสดีค่ะ",
    "หวัดดี",
  ];

  if(event.message.type == 'text' && (event.message.text == 'ขอที่อยู่' || event.message.text == 'location')){
    let msg = {
      "type": "location",
      "title": "I GEAR GEEK",
      "address": "89, Chonprathan Rd, Tambon Su Thep, Amphoe Mueang Chiang Mai, Chang Wat Chiang Mai 50200",
      "latitude": 18.778021,
      "longitude": 98.9514043
    }

    client.pushMessage(event.source.userId, msg) //-- ส่งแบบหลายครั้ง ใช้ userId
    // return client.replyMessage(event.replyToken, msg) //-- ส่งแบบตอบกลับ ใช้ Token
  }
  else if (event.message.type == 'location') {

    var baseLocation = 'https://fathomless-reaches-36581.herokuapp.com/api?lat=%lat%&long=%long%' ;
    baseLocation = baseLocation.replace("%lat%", event.message.latitude);
    baseLocation = baseLocation.replace("%long%", event.message.longitude);

    let msg = {
      type: "template",
      altText: "this is a carousel template",
      template: {
          type: "carousel",
          columns: [],
          imageAspectRatio: "rectangle",
          imageSize: "cover"
        }
      }

    let column = [
      {
        thumbnailImageUrl: "",
        imageBackgroundColor: "#FFFFFF",
        title: "",
        text: "",
        defaultAction: {
            "type": "uri",
            "label": "View detail",
            "uri": "http://example.com/page/123"
        },
        actions: [
            {
                "type": "postback",
                "label": "Buy",
                "data": "action=buy&itemid=111"
            },
            {
                "type": "postback",
                "label": "Add to cart",
                "data": "action=add&itemid=111"
            },
            {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/111"
            }
        ]
      }
    ]

    https.get(baseLocation, function(res){
        var body = '';
        res.on('data', function(chunk){
            body += chunk;
        });
        res.on('end', function(){
            var fbResponse = JSON.parse(body);
            fbResponse.forEach((element, index) => {
              column.thumbnailImageUrl = element.aqi.icon;
              column.title = element.nameTH;
              column.text = element.aqi.aqi;

              msg.template.columns.push(column);
              console.log(msg);
            });
        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });

    client.pushMessage(event.source.userId, msg)

    // console.log(event.message.latitude);
    // console.log(event.message.longitude);
  }
  else if (event.message.type == 'text' && event.message.text == 'menu') {
    let msg = {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
          "type": "carousel",
          "columns": [
              {
                "thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
                "imageBackgroundColor": "#FFFFFF",
                "title": "this is menu",
                "text": "description",
                "defaultAction": {
                    "type": "uri",
                    "label": "View detail",
                    "uri": "http://example.com/page/123"
                },
                "actions": [
                    {
                        "type": "postback",
                        "label": "Buy",
                        "data": "action=buy&itemid=111"
                    },
                    {
                        "type": "postback",
                        "label": "Add to cart",
                        "data": "action=add&itemid=111"
                    },
                    {
                        "type": "uri",
                        "label": "View detail",
                        "uri": "http://example.com/page/111"
                    }
                ]
              },
              {
                "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
                "imageBackgroundColor": "#000000",
                "title": "this is menu",
                "text": "description",
                "defaultAction": {
                    "type": "uri",
                    "label": "View detail",
                    "uri": "http://example.com/page/222"
                },
                "actions": [
                    {
                        "type": "postback",
                        "label": "Buy",
                        "data": "action=buy&itemid=222"
                    },
                    {
                        "type": "postback",
                        "label": "Add to cart",
                        "data": "action=add&itemid=222"
                    },
                    {
                        "type": "uri",
                        "label": "View detail",
                        "uri": "http://example.com/page/222"
                    }
                ]
              }
          ],
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
      }
    }
    return client.replyMessage(event.replyToken, msg)
  }
  else {
    let msg = {
      type: "text",
      text: "ฉันไม่สามารถตอบคำถามนี้ได้ โปรดติอต่ดแอนมิน"
    }
    return client.replyMessage(event.replyToken, msg) 
  }


  // else if (event.message.type == 'text') {

  //   let txtOne = String(event.message.text);
  //   console.log(txtOne);
  //   let chkSawaddee = txtOne.indexOf('สวัสดี');

  //   console.log(chkSawaddee);

  //   if(chkSawaddee==0) {
  //     let msg = {
  //       type: "text",
  //       text: "สวัสดี"
  //     }
  //     var numb = event.message.text.match(/\d/g);
  //     numb = numb.join("");
  //     for(var i=0; i<numb; i++){
  //       client.pushMessage(event.source.userId, msg)
  //     }
  //   } else {
  //     console.log('ENTER ELSE');
  //     let msg = {
  //       type: "text",
  //       text: event.message.text
  //     }
  //     client.pushMessage(event.source.userId, msg)
  //   }
    
  // }
  
}

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})


