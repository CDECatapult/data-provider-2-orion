const main = require("./server");

// 5 minutes in milliseconds
let timer = 300000;
return setInterval(async () => {
  main(), timer;
});
