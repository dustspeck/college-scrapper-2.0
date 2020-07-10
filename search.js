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
const getJSON = async (term) => {
  const js = await axios.get(
    `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=Xxf2NKtwfcXUd8K2hqawnlur6c0YY93xsNFwq0Dy&fields=id,school.name,school.alias,school.search&per_page=20&sort=school.alias:asc&school.search=${term}&school.operating=1&latest.student.size__range=0..&latest.academics.program_available.assoc_or_bachelors_or_certificate=true&school.degrees_awarded.predominant__range=1..3`,
    config
  );

  const cips = js.data.results[0]["2015"].programs.cip_4_digit;

  arr_cip = [];

  cips.forEach((cip) => {
    arr_dt = [];
    arr_dt.push(cip.title);
    arr_dt.push(cip.credential.title);
    arr_cip.push(arr_dt);
  });
  return arr_cip;
};

app.get("/search/:term", async (req, res) => {
  const data = await getJSON(req.params.term);
  res.json(data);
});

app.listen(port, hostname, () =>
  console.log(`Server started on ${hostname} at ${port}`)
);
