require('dotenv').config();
const fetch = require('cross-fetch');
module.exports = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	const authUrl = "https://auth-service.glitch.me/auth";
    //console.log(req.headers.token, process.env.secret_key_jwt);


    if (req.headers.token == "" || req.headers.token == undefined) {
        res.status(403).send({
            success: false,
            message: 'Error. Check your token'
        });
    }
    else {
        console.log(req.headers.token);

        const response = await fetch(authUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": req.headers.token,
                "secret_key": process.env.secret_key_jwt
            }
        });

        //if(link.stats)

        if (response.status != 200) {
            res.status(403).send({
                success: false,
                message: 'Error. Check your token'
            });
        }
        else {
			var result = await response.json();
			res.info = JSON.stringify(result);
            next()
        }
    }

}