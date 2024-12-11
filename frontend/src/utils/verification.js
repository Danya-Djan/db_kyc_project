export const verificationTg = () => {
    let user = {
        id: '',
        firstName: '',
        lastName: ''
    };
    let token = '';
    
    if(window.Telegram) {
        const tg = window.Telegram.WebApp;
        tg.BackButton.show();
        tg.expand();
        tg.setBackgroundColor("#222222");
        const tgData = tg.initDataUnsafe;

        function showProps(obj) {
          let result = [];
          for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
              if (i != "hash") {
                if (i == "user") {
                  result.push(i + "=" + JSON.stringify(obj[i]) + "\n");
                } else {
                  result.push(i + "=" + obj[i] + "\n");
                }
              }
            }
          }
          let sort = result.sort();
          let final = "";
          for (let i of sort) {
            final += i;
          }
          return final;
        }

        const data_check_string = showProps(tgData);
        const hashTg = tg.initDataUnsafe?.hash;
        const validation = data_check_string + ":" + hashTg;
        token = btoa(
          unescape(encodeURIComponent(validation))
        );
        user.id = tg.initDataUnsafe?.user?.id;
        user.firstName = tg.initDataUnsafe?.user?.first_name;
        user.lastName = tg.initDataUnsafe?.user?.last_name;
    }

    //локально
    /*token = "TelegramToken";
    user.id = "123456";
    user.firstName = 'User';
    user.lastName = 'Name';*/

    return [user, token];
}