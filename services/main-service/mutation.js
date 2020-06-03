module.exports= {
	editAccount: (url) => `
    mutation{
      editThisAccount(account:{
        avatar_url:"${url}"
      }){
        status
      }
    }
  `,
  chatRoomMedia: (roomID,media) => `
    mutation{
      chatRoom(roomID:"${roomID}",messages:{
        messageType:media
          text:{
            content:"${media.url}"
            height:${media.height}
            width:${media.width}
        }
      }){
        status 
      }
    }`,
  chatPrivateMedia: (friendID,media) =>
  `
    mutation{
      chatPrivate(friendID:"${friendID}",input:{
        messageType:media
        text:{
          content:"${media.url}"
            height:${media.height}
            width:${media.width}
        }
      }){
        status
      }
    }
  `
}