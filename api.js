const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 9090;

const DataService = require(__dirname + "/dataService");
const data_service = new DataService();

var request = require("request");

let ejs = require("ejs");
let fs = require("fs");

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", function (req, response) {
  request.get("http://xkcd.com/info.0.json", function (err, res, body) {
    if (err) {
      console.log(err);
    }

    if (res.statusCode === 200) {
      data_service
        .getComic(JSON.parse(res.body).num)
        .then((result) => {
          if (result) {
            data_service
              .updateComic(result)
              .then(() => {})
              .catch((error) => {
                console.log(error);
              });
          } else {
            data_service
              .addComic(JSON.parse(res.body).num)
              .then(() => {})
              .catch((error) => {
                console.log(error);
              });
          }

          var numViews = 1;

          if (result) {
            numViews = result.views + 1;
          }

          response.render(path.join(__dirname, "/home.html"), {
            data: {
              views: numViews,
              newest: JSON.parse(res.body).num,
              xkcd: JSON.parse(res.body),
              transcript: JSON.parse(res.body).transcript,
            },
          });
        })
        .catch((error) => {
          console.log("[ERROR]: " + error);
        });
    }
  });
});

app.get("/:comicId", function (req, response) {
  var id;
  var newestComic;

  if (parseInt(req.params.comicId)) {
    id = req.params.comicId;

    request.get("http://xkcd.com/info.0.json", function (err, ress, body) {
      if (err) {
        console.log(err);
      }

      newestComic = JSON.parse(ress.body).num;

      if (parseInt(id) < 1) {
        id = 1;
      } else if (parseInt(id) > parseInt(newestComic)) {
        id = newestComic;
      } else if (!parseInt(id)) {
        id = newestComic;
      }

      request.get(
        "http://xkcd.com/" + id + "/info.0.json",
        function (err, res, body) {
          if (err) {
            console.log(err);
          }

          if (res.statusCode === 200) {
            data_service
              .getComic(JSON.parse(res.body).num)
              .then((result) => {
                if (result) {
                  data_service
                    .updateComic(result)
                    .then(() => {})
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  data_service
                    .addComic(JSON.parse(res.body).num)
                    .then(() => {})
                    .catch((error) => {
                      console.log(error);
                    });
                }

                var numViews = 1;

                if (result) {
                  numViews = result.views + 1;
                }

                var transcript = JSON.parse(res.body).transcript;
                transcript = transcript.replace(/[\[\]\&\/\\#+()$~%'"*<>{}]/g, '');

                response.render(path.join(__dirname, "/home.html"), {
                  data: {
                    views: numViews,
                    newest: newestComic,
                    xkcd: JSON.parse(res.body),
                    transcript: transcript.toString(),
                  },
                });
              })
              .catch((error) => {
                console.log("[ERROR]: " + error);
              });
          }
        }
      );
    });
  } else {
    response.redirect("/");
  }
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
