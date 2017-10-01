console.log( process.env );

const
	Twit    = require( "twit" ),
	T       = new Twit({
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
		access_token: process.env.ACCESS_TOKEN,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET
	});

const stream = T.stream('statuses/filter', { track: '@namedculprit' });

var MattGraySize = 0;

function getMattGraySize() {
	T.get( "users/lookup", { user_id: 18035884 }, ( err, data, res ) => {
		if ( err ) console.error( "GET MATT SIZE ERROR", err );
		else {
			MattGraySize = data[ 0 ].followers_count;
			console.log( "New Matt Gray size: ", MattGraySize );
		}
	});
}

function reply( answer, id, handle ) {
	const data = {
		status: `@${ handle } ${ answer }`,
		in_reply_to_status_id: id
	}

	T.post( 'statuses/update', data, ( err, data, response ) => {
		if ( err ) console.error( "REPLY ERROR", data, arguments, err );
	});
}

stream.on('tweet', function ( tweet ) {
	if ( tweet ) {
		const text = tweet.text.replace( / /g, "" ).toLowerCase();

		console.log( text );
		
		if ( text.substr( "ismattgraybiggerthanme" ) !== -1 ) {
			const
				user = tweet.user,
				size = user.followers_count;

			reply(
				size < MattGraySize ? "yes." : "no.",
				tweet.id,
				user.screen_name
			);
		}
	}
});

getMattGraySize();
setInterval( getMattGraySize, 1000 * 60 );