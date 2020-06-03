const fetch = require('cross-fetch');
const env = require('./env');
const queries = require('./query'); 
module.exports = {
	updateAvatar: async (token,url) => {
		var response = await fetch(env.subServiceURL,{
			method:'POST',
			headers: { 'Content-Type': 'application/json','token':token},
			body:JSON.stringify({query:queries.editAccount(url)})
		});
		var result = await response.json();
		var status = result.data.editThisAccount.status;
		if(status == "SUCCESS"){
			return true;
		}
		return false;		
	}
}