const { computeHash } = require('./hash') 
const request = require('request')
const progress = require('request-progress')
const fs = require('fs')

const fetch = request.defaults({	
  headers: {'User-Agent' : 'SubDB/1.0 (SubDB-node/0.1.0; http://maxeon.me)'},
  baseUrl: 'http://api.thesubdb.com'
})

module.exports.download = async (filePath) => {
	try{
		const hash = await computeHash(filePath) 
		return new Promise((resolve, reject) => {
			const r = fetch(`/?action=download&hash=${hash}`)
			r.on('response',function(res){
				if(res.statusCode === 404){
					r.abort()
					resolve(null)
				}
				else{
					r.pipe(fs.createWriteStream(filePath.replace(/\.[^/.]+$/, "")+'.srt'))
				}
			})
			.on('error', function (err) {
			    reject(err)
			})
			.on('end', function(){
				resolve(true)
			})
		})
	} catch (err) {
		console.log(err)
	}
}