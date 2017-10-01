const
	Twit = require( "twit" ),
	T    = new Twit({
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
		access_token: process.env.ACCESS_TOKEN,
		access_token_secret: process.env.ACCESS_TOKEN_SECRET
	});

const stream = T.stream('statuses/filter', { track: '@unnamedculprit' });

var MattGraySize = 0;

// Get the size of Matt Gray
function getMattGraySize() {
	// Matt's id is 18035884
	T.get( "users/lookup", { user_id: "18035884" }, ( err, data, res ) => {
		if ( err ) console.error( "GET MATT SIZE ERROR", err );
		else {
			MattGraySize = data[ 0 ].followers_count;
			console.log( "New Matt Gray size: ", MattGraySize );
		}
	});
}

// Reply to the tweet
function reply( answer, id, handles ) {
	let status = ``;

	for ( handle of handles ) status += `@${ handle } `
	
	const data = {
		status: status + `${ answer } ${ Math.random() }`,
		in_reply_to_status_id: id
	}

	T.post( 'statuses/update', data, ( err, data, response ) => {
		if ( err ) console.error( "REPLY ERROR", data, arguments, err );
	});
}

// Get all tweets that mention Matt
stream.on( "tweet", function ( tweet ) {
	if ( tweet ) {
		const
			user = tweet.user,
			text = tweet.text.replace( / /g, "" ).toLowerCase();
		
		console.log( user.id_str );
		
		// For some reason, I can't get id_str to work with this?
		// I guess screen_name will do for now.
		if ( user.screen_name != "namedculprit" ) {
			if ( text.substr( "ismattgraybiggerthanme" ) !== -1 ) {
				const
					size = user.followers_count,
					mentions = tweet.entities.user_mentions;
				
				let handles = [ user.screen_name ];

				if ( mentions )
					for ( mention of mentions )
						handles.push( mention.screen_name );
				
				reply (
					size < MattGraySize ? "yes." : "no.",
					tweet.id_str,
					handles
				);
			}
		}
	}
});

getMattGraySize();
setInterval( getMattGraySize, 1000 * 60 );