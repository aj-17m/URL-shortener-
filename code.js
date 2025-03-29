const express = require("express");
const mysql = require("mysql2");
const crypto = require("crypto");

const app = express();

app.use(express.static("public"));
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "golu9588",
  database: "shorturls",
});

con.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit if DB connection fails
  }
  console.log("Connected to MySQL database.");
});

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Create a short URL
app.post("/api/create-short-url", (req, res) => {
  if (!req.body.longurl) {
    return res.status(400).json({ status: "notok", message: "Long URL is required" });
  }

  const uniqueID = crypto.randomBytes(5).toString("hex"); // Generates a 10-character unique ID

  const sql = "INSERT INTO links (longurl, shorturl, count) VALUES (?, ?, 0)";
  con.query(sql, [req.body.longurl, uniqueID], (error) => {
    if (error) {
      console.error("Error inserting URL:", error.message);
      return res.status(500).json({ status: "notok", message: "Something went wrong" });
    }
    res.status(200).json({ status: "ok", shorturl: uniqueID });
  });
});

// Get all short URLs
app.get("/api/get-all-short-urls", (req, res) => {
  const sql = "SELECT * FROM links";
  con.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching URLs:", error.message);
      return res.status(500).json({ status: "notok", message: "Something went wrong" });
    }
    res.status(200).json(results);
  });
});

// Redirect from short URL to long URL
app.get("/:shorturl", (req, res) => {
  const shorturl = req.params.shorturl;

  const sql = "SELECT * FROM links WHERE shorturl = ? LIMIT 1";
  con.query(sql, [shorturl], (error, results) => {
    if (error || results.length === 0) {
      return res.status(404).json({ status: "notok", message: "URL not found" });
    }

    const longurl = results[0].longurl;
    const updateSql = "UPDATE links SET count = count + 1 WHERE id = ?";
    con.query(updateSql, [results[0].id], (err) => {
      if (err) {
        console.error("Error updating count:", err.message);
        return res.status(500).json({ status: "notok", message: "Something went wrong" });
      }
      res.redirect(longurl);
    });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
