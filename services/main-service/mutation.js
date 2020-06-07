const checkType = require('../../util/checkType');

module.exports = {
	editAccount: (url) => `
    mutation{
      editThisAccount(account:{
        avatar_url:"${url}"
      }){
        status
        
      }
    }
  `,
  chatRoomFile: (roomID, media) => `
    mutation{
      chatRoom(roomID:"${roomID}",messages:{
        messageType:file
          text:{
            content:"${media.url}"
            publicID:"${media.publicID}"
        }
      }){
        status 
        success
      }
    }`,
  chatPrivateFile: (friendID, media) => 
  `mutation{
      chatPrivate(friendID:"${friendID}",input:{
        messageType:file
        text:{
            content:"${media.url}"
            publicID:"${media.publicID}"
        }
      }){
        status
        success
      }
    }
  `,
  chatRoomMedia: (roomID,media) => `
    mutation{
      chatRoom(roomID:"${roomID}",messages:{
        messageType:${media.format == "gif" ? "gif": checkType(media.format) ? "image" : "video"}
          text:{
            content:"${media.url}"
            publicID:"${media.publicID}"
            height:${media.height}
            width:${media.width}
        }
      }){
        status
        success
      }
    }`,
  chatPrivateMedia: (friendID,media) =>
  `mutation{
      chatPrivate(friendID:"${friendID}",input:{
        messageType:${media.format == "gif" ? "gif" : checkType(media.format) ? "image" : "video"}
        text:{
          content:"${media.url}"
          publicID:"${media.publicID}"
          height:${media.height}
          width:${media.width}
        }
      }){
        status
        success
      }
    }
  `
}