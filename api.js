const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 9090;

const DataService = require(__dirname + "/dataService");
const data_service = new DataService();

let ejs = require('ejs')
let fs = require('fs')

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/home.html"));
});

app.get("/:comicId", function (req, res) {
  var id;

  if (parseInt(req.params.comicId)) {
    id = req.params.comicId;

    data_service
      .getComic(id)
      .then((result) => {
        if (result) {
          data_service
            .updateComic(result)
            .then(() => {
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          data_service
            .addComic(id)
            .then(() => {
            })
            .catch((error) => {
              console.log(error);

            });
        }

        var numViews = 1;

        if(result){
          numViews = result.views + 1;
        }
        res.render(path.join(__dirname, "/home.html"), {views: numViews});

      })
      .catch((error) => {
        console.log("[ERROR]: " + error);
      });
  } else {
    res.sendFile(path.join(__dirname, "/home.html"));
  }
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
