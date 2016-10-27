/*jshint esversion: 6 */

const express = require ( 'express');
const { json } = require( 'body-parser' );
const mongoJS = require( 'mongoJS' );
const cors = require( 'cors' );
const port = 4000;

const app = express();

const db = mongoJS( 'birds', [ 'sightings' ] );
app.use( json() );
app.use( cors() );

app.get( '/api/sighting', ( req, res ) => {
  db.sightings.find( {}, ( err, response ) => {
    if( err ) res.status( 500 ).json( err );
    else res.status( 200 ).json( response );
  });
});

app.post( '/api/sighting', ( req, res ) => {
  db.sightings.save( req.body, ( err, response ) => {
    if ( err ) return res.status( 500 ).json( err );
    else return res.status( 200 ).json( response );
  });
});

app.put( '/api/sighting', ( req, res ) => {
  if(!req.query.id) return res.status(418).send('request query \'id\' required');
	db.sightings.findAndModify({
			query: {
				_id: mongoJS.ObjectId(req.query.id)
			},
			update: {
				$set: req.body
			}
		},
		(err, response) => {
			if(err) return res.status(500).json(err);
			res.status( 200 ).json(response);
		});
});

app.delete( '/api/sighting', ( req, res ) => {
  db.sightings.remove({ _id: mongoJS.ObjectId(req.query.id) }, ( err, response ) => {
		if( err ) return res.status( 500 ).json( err );
		return res.status( 200 ).json( response );
  });
});



app.listen( port, () => console.log( `listening on port ${ port }`));
