let sanakirja = [];

const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*CORS isn’t enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

//Haetaan sanakirjan koko sisältö
app.get("/sanakirja", (req, res) => {
  haeSanakirja();
  res.json(sanakirja);
});

//Lisätään uusi sana sanakirja.txt tiedostoon
app.post("/sanakirja", (req, res) => {
  const sana = req.body;
  console.log(sana);
  const uSana = sana.suomeksi + " " + sana.englanniksi; //Poimitaan objectista talteen sanat
  fs.writeFileSync("./sanakirja/sanakirja.txt", "\r\n" + uSana, {
    encoding: "utf-8",
    flag: "a+",
  });
  console.log("Uusi sana lisätty: " + uSana);
  res.json(uSana);
});

//Haetaan sanakirjasta suomenkieliselle sanalle sen englannin kielinen vastine
app.get("/sanakirja/:suomeksi", (req, res) => {
  haeSanakirja();
  const hakuSana = String(req.params.suomeksi);
  console.log(hakuSana);
  const haettavaSana = sanakirja.find(
    (haettavaSana) => haettavaSana.suomeksi === hakuSana
  );
  console.log(haettavaSana.englanniksi);
  res.json(haettavaSana.englanniksi);
});

app.listen(8080, () => {
  console.log("Serveri kuuntelee portissa 8080");
});

//Tämä hakee sanakirjan kaikki sanat tekstitiedostosta objekteiksi taulukkoon
function haeSanakirja() {
  /*Tyhjennetään sanakirja
  Tämä sen takia ettei sanakirja täyty samoista sanoista aina kun tätä funktiota käytetään*/
  sanakirja.length = 0;

  const data = fs.readFileSync("./sanakirja/sanakirja.txt", {
    encoding: "utf8",
    flags: "r",
  });
  const sanaTaulukko = data.split(/\r?\n/);
  sanaTaulukko.forEach((line) => {
    const sanat = line.split(" ");
    const sana = { suomeksi: sanat[0], englanniksi: sanat[1] };
    sanakirja.push(sana);
  });
}
