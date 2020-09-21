const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rssSchema = new Schema({
    color: String,
    description: String,
    feedUrl: String,
    language: String,
    lastBuildDate: String,
    link: String,
    title: String,
})

const RSS = mongoose.model('RSS', rssSchema)

module.exports = { RSS }