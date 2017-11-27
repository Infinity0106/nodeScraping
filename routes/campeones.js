var express = require("express");
var router = express.Router();
var request = require("request");
var cloudscraper = require("cloudscraper");
var cheerio = require("cheerio");
var data = require("./datos");
const config = require("./config");

const pg = require("pg");
const conStr =
  process.env.DATABASE_URL ||
  "postgresql://" +
    config.user +
    ":" +
    config.password +
    "@" +
    config.host +
    "/" +
    config.baseDeDatos +
    "";
("postgresql://vuzchzbcdyocxq:ca781dadaf7e58e6a0ab39fca31119c9d95c7aa6daf902a961744847659ebd89@ec2-107-21-248-129.compute-1.amazonaws.com/dnpgppfifq8nj");

function prepareQuery(arr) {
  var query = "INSERT INTO Campeones(nombre,faction,urlFoto) VALUES ";
  arr.forEach(element => {
    query +=
      "('" +
      element.nombre.replace(/'/g, "''") +
      "', '" +
      element.faction +
      "', '" +
      element.urlFoto +
      "'), ";
  });
  query = query.slice(0, -2);
  console.log(query);
  return query;
}

/**
 * select by something
 */
router.get("/:field/:value", (req, res, next) => {
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
      var rows = client.query(
        "SELECT * FROM Campeones WHERE  " +
          req.params.field +
          "='" +
          req.params.value.replace(/'/g, "''") +
          "'"
      );
      var result = [];
      rows.on("row", row => {
        result.push(row);
      });
      rows.on("end", () => {
        done();
        res.json(result);
      });
    }
  );
});

/**
 * masive insert
 */
router.post("/insertar", function(req, res, next) {
  cloudscraper.get(
    "http://leagueoflegends.wikia.com/wiki/List_of_champions",
    function(error, response, body) {
      if (error) {
        console.log("Error occurred");
      } else {
        var array = [];
        var $ = cheerio.load(data);
        $(".item__30l", ".champsListUl__2Lm").each((i, e) => {
          array.push({
            nombre:
              e.children[1].children[1].children[3].children[1].children[0]
                .data,
            faction:
              e.children[1].children[1].children[3].children[3].children[1]
                .children[0].data,
            urlFoto: e.children[1].children[1].children[1].attribs[
              "data-am-url"
            ].replace("//am", "am")
          });
        });
        var que = prepareQuery(array);
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
            client
              .query(que, [])
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
    }
  );
});

router.post("/", (req, res, next) => {
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
      // Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err });
      }
      var str = prepareQuery(req.body);
      client.query(str, []).then(respuesta => {
        res.json(respuesta);
        done();
      });
    }
  );
});

router.put("/", (req, res, next) => {
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
        return res.status(500).json({ success: false, data: err });
      }
      client
        .query(
          "UPDATE Campeones SET " +
            req.body.field +
            "='" +
            req.body.newValue +
            "' WHERE nombre='" +
            req.body.nombre +
            "'",
          []
        )
        .then(respuesta => {
          res.json(respuesta);
          done();
        })
        .catch(e => {
          console.log(e);
        });
    }
  );
});

router.delete("/", (req, res, next) => {
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
        return res.status(500).json({ success: false, data: err });
      }
      client
        .query(
          "DELETE FROM Habilidades where nombreFK='" + req.body.value + "'",
          []
        )
        .then(() => {
          client
            .query(
              "DELETE FROM Aspectos where nombreFK='" + req.body.value + "'",
              []
            )
            .then(() => {
              client
                .query(
                  "DELETE FROM Campeones where nombre='" + req.body.value + "'",
                  []
                )
                .then(respuesta => {
                  res.json(respuesta);
                  done();
                })
                .catch(e => {
                  console.log(e);
                });
            });
        });
    }
  );
});

module.exports = router;
