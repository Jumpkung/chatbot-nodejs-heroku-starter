  /*
  if( event.message.type == 'text' && 0 >= sayHiMessage.indexOf(event.message.text) ){

    if(userData.user_action.first_hello == false) {
      let msg = {
        type: "text",
        text: "สวัสดีครับ ไม่ทราบว่าชื่ออะไรครับ"
      }
      userData.user_action.first_hello = true;
      client.pushMessage(event.source.userId, msg)
    }
    else if ( userData.user_action.first_hello ) {
      let msg = {
        type: "text",
        text: "สวัสดีครับ คุณ" + event.message.text
      }
      
      client.pushMessage(event.source.userId, msg)
    }
    else if (event.message.text == 'ลาก่อน') {
      let msg = {
        type: "text",
        text: "ล่าก่อนครับ " + event.message.text
      }
      userData.user_action.first_hello = false;
      client.pushMessage(event.source.userId, msg)
    }

    console.log(userData.user_action.first_hello);
    // else {
    //   let msg = {
    //     type: "text",
    //     text: "สวัสดีครับ ไม่ทราบว่าชื่ออะไรครับ"
    //   }
    //   client.pushMessage(event.source.userId, msg)
    // }
  } */