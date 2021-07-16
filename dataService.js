const mongoose = require("mongoose");
const database_uri =
  "mongodb+srv://mbutto:mbutto1@cluster0.unrak.mongodb.net/Comics?retryWrites=true&w=majority";

const ComicSchema = require(__dirname + "/comic");
const Comic = mongoose.model("Comic", ComicSchema, "comics");

class DataService {
  constructor() {
    this.database = mongoose.connect(
      database_uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error) => {
        if (error) {
          console.log("[ERROR]: " + error);
        } else {
          console.log(
            "[INFO]: Data Service Successfully connected to database"
          );
        }
      }
    );
  }

  addComic(data) {
    //console.log(data);
    return new Promise((resolve, _reject) => {
      const newComic = new Comic({
        comicNum: data,
        views: 1,
      });

      newComic.save((error) => {
        if (error) {
          console.log(error);
        } else {
          resolve();
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  getComic(data) {
    return new Promise((resolve, reject) => {
      Comic.findOne({
        comicNum: data,
      })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch(() => {
          reject(Error("Error"));
        });
    });
  }

  updateComic(data) {
    return new Promise((resolve, _reject) => {
      var update = {
        views: parseInt(data.views) + 1,
      };

      var conditions = { comicNum: data.comicNum };

      Comic.updateOne(conditions, update, function (err, numAffected) {
        if (err) {
            console.log(error);
          } else {
            resolve();
          }
      });
    }).catch((error) => {
      console.log(error);
    });
  }
}

module.exports = DataService;
