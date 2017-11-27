var express = require("express");
var router = express.Router();
var request = require("request");
var cloudscraper = require("cloudscraper");
var cheerio = require("cheerio");
const pg = require("pg");
const config = require("./config");
var phantom = require("phantom");
var fs = require("fs");

function prepareString(arr) {
  var str =
    "INSERT INTO Habilidades (nombrefk,nombre,descripcion,urllogo) VALUES ";
  arr.forEach(e => {
    str +=
      "('" +
      e.nombreFK.replace(/'/g, "''") +
      "','" +
      e.nombre.replace(/'/g, "''") +
      "','" +
      e.desc.replace(/'/g, "''") +
      "','" +
      e.urlLogo +
      "'), ";
  });
  str = str.slice(0, -2);
  return str;
}

/* GET users listing. */
router.get("/", function(req, res, next) {
  req.setTimeout(0);
  var results = [];
  pg.connect(
    {
      user: config.user,
      password: config.password,
      database: config.baseDeDatos,
      port: 5432,
      host: config.host,
      ssl: true
    },
    (err, client, done) => {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err });
      }
      const query = client.query("SELECT * FROM CAMPEONES");
      query.on("row", row => {
        results.push(row);
      });
      query.on("end", () => {
        done();
        // console.log(results);
        // var once = true;
        // results.forEach((e, i) => {
        //   cloudscraper.get(
        //     "https://euw.leagueoflegends.com/es/game-info/champions/" +
        //       e.nombre.replace(/\b\w/g, l => l.toUpperCase()).replace(/'/g, ""),
        //     (error, response, body) => {
        //       if (error) {
        //         console.log("error ocurred");
        //       } else {
        //         var $ = cheerio.load(body);
        //         if (once) {
        //           console.log(body);
        //           console.log(
        //             "https://euw.leagueoflegends.com/es/game-info/champions/" +
        //               e.nombre
        //                 .replace(/\b\w/g, l => l.toUpperCase())
        //                 .replace(/'/g, "")
        //           );
        //         }
        //         once = false;
        //       }
        //     }
        //   );
        // });
        //hacer search con urls
        var arrayHabilidades = [];
        results.forEach((e, i) => {
          if (e.nombre == "Vel'Koz") e.nombre = "Velkoz";
          if (e.nombre == "Cho'Gath") e.nombre = "Chogath";
          if (e.nombre == "Wukong") e.nombre = "MonkeyKing";
          if (e.nombre == "Kha'Zix") e.nombre = "Khazix";
          if (e.nombre == "LeBlanc") e.nombre = "Leblanc";

          phantom.create().then(ph => {
            ph.createPage().then(page => {
              page
                .open(
                  "https://euw.leagueoflegends.com/es/game-info/champions/" +
                    e.nombre
                      .replace(/ /g, "")
                      .replace(/\./g, "")
                      .replace(/'/g, "")
                      .replace(/\b\w/g, l => l.toUpperCase())
                )
                .then(function(status) {
                  page.property("onLoadFinished").then(function(content) {
                    console.log(
                      "https://euw.leagueoflegends.com/es/game-info/champions/" +
                        e.nombre
                          .replace(/ /g, "")
                          .replace(/\./g, "")
                          .replace(/'/g, "")
                          .replace(/\b\w/g, l => l.toUpperCase())
                    );
                    // Output Results After Delay (for AJAX)
                    var arrayTMP = [];
                    setTimeout(function() {
                      page
                        .evaluate(function() {
                          return document.documentElement.outerHTML;
                        })
                        .then(txt => {
                          if (e.nombre == "Velkoz") e.nombre = "Vel'Koz";
                          if (e.nombre == "Chogath") e.nombre = "Cho'Gath";
                          if (e.nombre == "MonkeyKing") e.nombre = "Wukong";
                          if (e.nombre == "Khazix") e.nombre = "Kha'Zix";
                          if (e.nombre == "Leblanc") e.nombre = "LeBlanc";
                          var $ = cheerio.load(txt);
                          arrayHabilidades.push({
                            nombreFK: e.nombre,
                            nombre: $("#PName")
                              .children("h3")
                              .text(),
                            desc: $(
                              "p[data-property='passive.description']"
                            ).text(),
                            urlLogo: $(".dd-set-image-ability-P").attr("src")
                          });

                          arrayHabilidades.push({
                            nombreFK: e.nombre,
                            nombre: $("#QName")
                              .children("h3")
                              .text(),
                            desc: $(
                              "p[data-property='spells.0.description']"
                            ).text(),
                            urlLogo: $(".dd-set-image-ability-Q").attr("src")
                          });

                          arrayHabilidades.push({
                            nombreFK: e.nombre,
                            nombre: $("#WName")
                              .children("h3")
                              .text(),
                            desc: $(
                              "p[data-property='spells.1.description']"
                            ).text(),
                            urlLogo: $(".dd-set-image-ability-W").attr("src")
                          });

                          arrayHabilidades.push({
                            nombreFK: e.nombre,
                            nombre: $("#EName")
                              .children("h3")
                              .text(),
                            desc: $(
                              "p[data-property='spells.2.description']"
                            ).text(),
                            urlLogo: $(".dd-set-image-ability-E").attr("src")
                          });

                          arrayHabilidades.push({
                            nombreFK: e.nombre,
                            nombre: $("#RName")
                              .children("h3")
                              .text(),
                            desc: $(
                              "p[data-property='spells.3.description']"
                            ).text(),
                            urlLogo: $(".dd-set-image-ability-R").attr("src")
                          });
                        });
                      if (parseInt(arrayHabilidades.length / 5) > 100) {
                        var str = prepareString(arrayHabilidades);
                        pg.connect(
                          {
                            user: config.user,
                            password: config.password,
                            database: config.baseDeDatos,
                            port: 5432,
                            host: config.host,
                            ssl: true
                          },
                          (err, client, done) => {
                            if (err) {
                              done();
                              console.log(err);
                              return res
                                .status(500)
                                .json({ success: false, data: err });
                            }
                            client
                              .query(str, [])
                              .then(result => {
                                console.log(result);
                                var respuesta = { res: false };
                                if (result.rowCount != 0) {
                                  respuesta.res = true;
                                }
                                return res.json(respuesta);
                              })
                              .catch(e => {
                                console.log(e);
                              });
                            done();
                          }
                        );
                      }
                      ph.exit();
                    }, 3000);
                  });
                });
            });
          });
        });
        //multiple inserts
      });
    }
  );
});

module.exports = router;
