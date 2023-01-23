const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key e1c6eac4bc574fcaaddf393f28776a27");

const handleApiCall = (req, res) => {
	stub.PostModelOutputs(
	    {
	        user_app_id: {
	            "user_id": 'clarifai',
	            "app_id": 'main'
	        },
	        model_id: 'face-detection',
	        inputs: [
	            { data: { image: { url: req.body.input } } }
	        ]
	    },
	    metadata,
	    (err, response) => {
	        if (err) {
	            res.status(400).json('unable to work with API');
	        }

	        // Since we have one input, one output will exist here.
	        const output = response.outputs[0];

	        if (response) {
	        	res.json(response);
	        }
	    }
	);
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
  	.increment('entries', 1)
  	.returning('entries')
  	.then(entries => {
  		res.json(entries[0]);
  	})
  	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}