const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const imgur = require("imgur-upload");
const path = require("path");
const port = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => res.send("Home Page Route"));

app.post("/upload", async (request, response) => {
  try {
    if (!request.files) {
      response.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let file = request.files.file;
      var dir = "/tmp";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      console.log(file);
      await file.mv("/tmp/" + file.name);

      imgur.setClientID("24e5f2ddbc76e0d");
      imgur.upload(
        path.join(__dirname, `/tmp/${file.name}`),
        function (err, res) {
          fs.unlink(path.join(__dirname, `/tmp/${file.name}`), (err) => {
            console.log(err);
          });

          response.send({
            status: true,
            message: "File is uploaded",
            data: {
              name: file.name,
              mimetype: file.mimetype,
              size: file.size,
              url: res.data.link,
            },
          });
        }
      );
    }
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
