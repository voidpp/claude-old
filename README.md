

generate sri: `openssl dgst -sha384 -binary material-ui.development.js | openssl base64 -A`


usage

examples


influx table query: `SELECT last(value), max(value), min(value) FROM "magrathea"."autogen"."temperature" where time > now()-1d GROUP BY "name"`
