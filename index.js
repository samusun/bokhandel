const express = require("express");
const böcker = require("./routes/böcker");
const sql = require("mssql");
const app = express();

require("dotenv").config();
app.use(express.json());
app.locals.pretty = true;
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  try {
    const connection = await sql.connect(process.env.CONNECTION);
    const result = await connection.request().query(
      // "SELECT * FROM Böcker INNER JOIN FörfattareBöcker ON Böcker.ISBN13=FörfattareBöcker.bokId INNER JOIN Författare ON FörfattareBöcker.//// FörfattareId = Författare.ID"
      "select böcker.ISBN13, Böcker.Titel, Böcker.pris, case when count(Förnamn) > 1 then string_agg(Förnamn + ' ' + Efternamn, ', ' ) else min(Förnamn + ' ' + Efternamn) end as Förf from böcker inner join FörfattareBöcker on böcker.ISBN13 = FörfattareBöcker.BokId inner join Författare on FörfattareBöcker.FörfattareId = Författare.ID group by böcker.ISBN13, böcker.Titel, böcker.pris"
    );
    const butiker = await connection
      .request()
      .query("select Namn from Butiker");
    res.render("index.pug", {
      Böcker: result.recordset,
      Butiker: butiker.recordset,
    });
  } catch (ex) {
    console.log(ex);
  }
});

app.get("/book/:ISBN", async (req, res) => {
  try {
    const connection = await sql.connect(process.env.CONNECTION);
    const result = await connection
      .request()
      .query(
        "select * from Böcker inner join FörfattareBöcker on Böcker.ISBN13 = FörfattareBöcker.bokID inner join Författare on FörfattareBöcker.FörfattareId = Författare.ID inner join LagerSaldo on Böcker.ISBN13 = LagerSaldo.ISBN inner join Butiker on LagerSaldo.ButiksID = Butiker.ID where ISBN13 =" +
          req.params.ISBN
      );
    const Butiker = await connection.request().query("select * from butiker");
    res.render("bok.pug", {
      Bok: result.recordset,
      Butiker: Butiker.recordset,
    });
  } catch (ex) {
    console.log(ex);
  }
  req.params.ISBN;
});

app.listen(3000, () => {
  console.log("App is listening on port: 3000");
});
