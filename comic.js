const mongoose = require('mongoose')

const ComicSchema = mongoose.Schema ({
    comicNum: Number,
    views: Number
});

ComicSchema.index({comicNum: 'text'});

module.exports = ComicSchema;