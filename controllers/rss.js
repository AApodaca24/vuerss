let Parser = require("rss-parser");
let parser = new Parser();

const parseRss = async (req, res) => {
    console.log(req.body)
    let url
    if (req.body && req.body.url.feedUrl) {
        url = req.body.url.feedUrl
    } else {
        url = req.body.url
    }
    
    console.log(`commencing parse of ${url}`)
    try {
        let feed = await parser.parseURL(url);
        console.log(`Feed procesed: ${feed.title}`)
        res.status(200).json(feed)
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
        
    }
};

module.exports = {
  parseRss,
};
