import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from '../util/util.js'


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async (req, res) => {    
    //get image url
    let imgUrl = req.query['image_url'];

    //validate the image_url query
    if (!imgUrl)
    {
        return res.status(442).send('Invalid URL');    
    }

    console.log('ImgUrl : ' + imgUrl);

    //call filterImageFromURL(image_url) to filter the image
    const outPathPromise = filterImageFromURL(imgUrl);
    outPathPromise.then((outpath) => {
      console.log('Filter path : ' + outpath);

      //send the resulting file in the response
      res.sendFile(outpath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', outpath);

            let arr = [];
            arr.push(outpath);
            //deletes any files on the server on finish of the response
            deleteLocalFiles(arr);

            res.sendStatus(200);
        }
      });

      }).catch((error) => {
        return res.status(442).send('Failed : ' + error);
      });
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
