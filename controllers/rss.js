const mongoose = require('mongoose');

const { RSS } = require('./rssModel');
let Parser = require('rss-parser');
let parser = new Parser();



const parseRss = async (req, res) => {
  console.log(req.body);
  let url;
  if (req.body && req.body.url.feedUrl) {
    url = req.body.url.feedUrl;
  } else {
    url = req.body.url;
  }

  console.log(`commencing parse of ${url}`);
  try {
    let feed = await parser.parseURL(url);
    console.log(`Feed procesed: ${feed.title}`);
    res.status(200).json(feed);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

const getRss = (req, res) => {
  RSS.find({})
    .exec()
    .then(feeds => res.status(200).json(feeds))
    .catch(err =>
      res
        .status(500)
        .send({ message: 'error finding feeds', error: err.message }),
    );
};

const storeRss = (req, res) => {
  console.log(req.body);
  const {
    color,
    description,
    feedUrl,
    language,
    lastBuildDate,
    link,
    title,
  } = req.body;
  const rss = new RSS({
    color,
    description,
    feedUrl,
    language,
    lastBuildDate,
    link,
    title,
  });
  console.log(rss);
  rss
    .save()
    .then(() => res.status(200).json({ message: 'User added', rss }))
    .catch(err =>
      res
        .status(500)
        .send({ message: 'Internal Server Error', error: err.message }),
    );
};

module.exports = {
  parseRss,
  getRss,
  storeRss,
};
