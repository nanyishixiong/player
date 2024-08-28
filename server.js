//加载express模块
var express = require("express");
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  next();
});

app.use("/video", express.static("../react18"));
app.use("/", express.static("./public"));

app.get("/saveCurrentIndex", function (req, res) {
  const query = req._parsedOriginalUrl.query.split("=");
  res.send("saveCurrentIndex: " + query[1]);
  fs.writeFileSync("current.txt", query[1]);
});

app.get("/getCurrentIndex", function (req, res) {
  const current = fs.readFileSync("current.txt", { encoding: "utf8" });
  res.send(current);
});

app.listen(8081, () => {
  console.log(`Example app listening on port 8081`);
  console.log("http://127.0.0.1:8081");
  cp.exec("start chrome http://127.0.0.1:8081");
});
