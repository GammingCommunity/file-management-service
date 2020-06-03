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
  chatRoomMedia: (roomID,url,height,width) => `
  mutation{
    chatRoom(roomID:"${roomID}",messages:{
      messageType:media
        text:{
        content:"${url}"
        height:${height}
    	width:${width}
      }
    }){
      status 
    }
  }`
}