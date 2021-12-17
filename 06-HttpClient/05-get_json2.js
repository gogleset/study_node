const axios = require("axios");

const url = "http://itpaper.co.kr/demo/covid19/now.php";

/**
 state: [
{
    region: "서울",
    confirmed: 196234,
    death: 1461,
    released: 150801,
    vaccinatedOnce: 119118,
    vaccinatedFully: 1283,
    active: 43972,
    confirmed_prev: 193389,
    released_prev: 148598,
    death_prev: 1438,
    active_prev: 43353,
    vaccinatedOnce_prev: 119118,
    vaccinatedFully_prev: 1283,
    vaccinatedBoost_prev: 0
},
 */
(async () => {
  let json = null;

  try {
    const response = await axios.get(url);
    json = response.data;
  } catch (err) {
    const errorMsg =
      "[" + error.response.status + "] " + err.response.statusText;
    console.error(errorMsg);
    return;
  }

  let total = 0;

  json.state.map((v, i) => {
    const confirmed = v.confirmed - v.confirmed_prev;
    console.log("["+v.region + "] 확진자: " + confirmed);
    total += confirmed;
  });

  console.log("오늘 총 확진자 수: %d", total);
})();
