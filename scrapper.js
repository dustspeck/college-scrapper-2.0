const fs = require("fs");
const express = require("express");
const axios = require("axios");
const hostname = "localhost";
const port = process.env.PORT || 2100;

const app = express();

let config = {
  headers: {
    Host: "api.data.gov",
    Connection: "keep-alive",
    Accept: "application/json, text/plain, */*",
    Origin: "https://collegescorecard.ed.gov",
    Referer:
      "https://collegescorecard.ed.gov/school/fields/?166027-Harvard-University",
  },
};

const getSearch = async (term) => {
  const js = await axios.get(
    `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=Xxf2NKtwfcXUd8K2hqawnlur6c0YY93xsNFwq0Dy&fields=id,school.name,school.alias,school.search&per_page=20&sort=school.alias:asc&school.search=${term}&school.operating=1&latest.student.size__range=0..&latest.academics.program_available.assoc_or_bachelors_or_certificate=true&school.degrees_awarded.predominant__range=1..3`,
    config
  );
  j_data = js.data.results[0];
  csv_data = j_data.id + "," + j_data["school.name"];
  //   fs.writeFileSync("seard-ids.csv", csv_data + "\n", { flag: "a+" });
  return csv_data;
};

const getIds = async () => {
  const univs_names_file = fs.readFileSync("usa_univs.txt", "UTF-8");
  const lines = univs_names_file.split(/\r?\n/);
  lines.forEach(async (univ) => {
    try {
      csv_data = await getSearch(univ);
      fs.writeFileSync("seard-ids-with-names.csv", csv_data + "\n", {
        flag: "a+",
      });
    } catch (error) {
      console.log("ERR:" + error);
    }
  });
  return "done";
};

const getAllData = async () => {
  const univs_id_file = fs.readFileSync("search-ids.txt", "UTF-8");
  const lines = univs_id_file.split(/\r?\n/);
  lines.forEach(async (id) => {
    try {
      csv_data = await getData(id);
      fs.writeFileSync("all_data.txt", csv_data + "\n", {
        flag: "a+",
      });
    } catch (error) {
      console.log("ERR:" + error);
    }
  });
  return "done";
};

const getData = async (id) => {
  const js = await axios.get(
    `https://api.data.gov/ed/collegescorecard/v1/schools/?api_key=Xxf2NKtwfcXUd8K2hqawnlur6c0YY93xsNFwq0Dy&id=${id}`,
    config
  );
  const cips = js.data.results[0]["2015"].programs.cip_4_digit;
  arr_cip = [];
  cips.forEach((cip) => {
    arr_dt = [];
    arr_dt.push(cip.title);
    arr_dt.push(cip.credential.title);
    arr_dt.push(cip.school.name);
    arr_cip.push(arr_dt);
  });
  //   return "'" + arr_cip.join("','") + "'";
  return JSON.stringify(arr_cip);
};

app.get("/getData/:id", async (req, res) => {
  const data = await getData(req.params.id);
  res.json(data);
});

app.get("/search/:term", async (req, res) => {
  const data = await getSearch(req.params.term);
  res.json(data);
});

app.get("/getAllData/", async (req, res) => {
  const data = await getAllData();
  res.end(data);
});

app.get("/getids/:file", async (req, res) => {
  const data = await getIds(req.params.term);
  res.end(data);
});

app.listen(port, hostname, () =>
  console.log(`Server started on ${hostname} at ${port}`)
);
