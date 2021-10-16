const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
var imgur = require('imgur-upload');
let path = require('path');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

app.post('/upload', async (req, response) => {
    try {
        if (!req.files) {
            response.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            await avatar.mv('./uploads/' + avatar.name);


            imgur.setClientID("53d5bfeb034a8bf");
             imgur.upload(path.join(__dirname, `/uploads/${avatar.name}`), function (err, res) {
                console.log(res.data.link); //log the imgur url
                response.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size,
                    url: res.data.link
                }
            });
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});