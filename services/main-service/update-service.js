const fetch = require("cross-fetch");
const env = require("./env");
const queries = require("./query");
const mutation = require("./mutation");
const getAccountID = require("../../util/getAccountInfo.js");

module.exports = {
  updateAvatar: async (token, url) => {
    var response = await fetch(env.subServiceURL, {
      method: "POST",
      headers: { "Content-Type": "application/json", token: token },
      body: JSON.stringify({ query: mutation.editAccount(url) }),
    });
    var result = await response.json();
    var status = result.data.editThisAccount.status;
    if (status == "SUCCESS") {
      return true;
    }
    return false;
  },
  chatMedia: async (token, id, type, media) => {
    var response = await fetch(env.mainServiceURL, {
      method: "POST",
      headers: { "Content-Type": "application/json", token: token },
      body: JSON.stringify({
        query:
          type == "room"
            ? mutation.chatRoomMedia(id, media)
            : mutation.chatPrivateMedia(id, media),
      }),
    });
  },
};
