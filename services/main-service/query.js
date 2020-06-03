module.exports = {
	editAccount: (url) => `
    mutation{
      editThisAccount(account:{
        avatar_url:"${url}"
      }){
        status
      }
    }
  `
}