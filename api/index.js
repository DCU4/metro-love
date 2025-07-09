'use strict';

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 8081;

let credentials;
if (fs.existsSync('./credentials.json')) {
  credentials = JSON.parse(fs.readFileSync('./credentials.json'));
}

const API_KEY = process.env.API_KEY != null ? process.env.API_KEY : credentials.primary_key

app.use(express.static(`${__dirname}/views`)); // html
app.use(express.static(`${__dirname}/public`)); // js, css, images
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');


async function getMetroTimes(stationCode = 'F04') {
  const response = await fetch(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}`, {
    headers: {
      api_key: API_KEY
    }
  })

  const data = await response.json();
  if (stationCode == 'F04') {
    const trains = data.Trains.filter((x) => x.DestinationName == 'Greenbelt')
    if (trains.length > 0) {
      return trains;
    } else {
      return false
    }
  } else {
    const trains = data.Trains.filter(
      (x) => x.DestinationName.includes('Branch') || x.DestinationName == 'Navy Yard-Ballpark'
    )
    if (trains.length > 0) {
      return trains;
    } else {
      return false
    }
  }
}


app.get('/', async (req, res) => {
  res.json('metro love ok');
});

app.post('/metro-times', async (req, res) => {
  const { stationCode } = req.body;
  const response = await getMetroTimes(stationCode);
  if (response) {
    res.json(response)
  } else {
    res.json(null)
  }
});


app.listen(port, () => {
  console.log(`Connected to server at port ${port}`);
});
