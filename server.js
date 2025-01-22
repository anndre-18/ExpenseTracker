// // // 1. import http module
// // const http = require('http');

// // //2.Create http server
// // const server = http.createServer((req,res)=>{
// //     res.writeHead(200,{"Content-Type":"text/plain"});
// //     res.end("Hello World\n");
// // });

// // //3.Start the server
// // server.listen(3000,()=>{
// //     console.log("Server running at http://127.0.0.1:3000/");
// // });



// File Systems

// const fs=require('fs')

// fs.readFile('sample.txt',"utf8",(err,data)=>{
//     if(err){
//         console.error(err)
//     }
//     // console.log(data.toString())
//     console.log(data)


// })
// fs.writeFile('sampleWr.txt', "Hello World",(err)=>{
//     if(err){
//         console.error(err)
//         return
//     }
//     console.log("Write action success")
// })
// fs.appendFile('sampleWr.txt', "Hello World txt",(err)=>{
//     if(err){
//         console.error(err)
//         return
//     }
//     
//     console.log("Append action success")
// })
// fs.readFile('sampleWr.txt',"utf8",(err,data)=>{
//     if(err){
//         console.error(err)
//     }
//     // console.log(data.toString())
//     console.log(data)


// })const fs = require('fs');


const fs=require('fs')
const newPerson = {
    name: "Visalini",
    age: 19,
    city: "Pollachi",
};

fs.readFile('sample.json', "utf8", (err, data) => {
  if (err) {
      console.error(err);
      return;
  }

  const json = JSON.parse(data);  
//   console.log("Parsed JSON data:", json);

  const combined = { ...newPerson, ...json };

  const jsonString = JSON.stringify(combined, null, 2);

//   console.log("Combined JSON:", jsonString);

  fs.writeFile('sample.json', jsonString, (err) => {
      if (err) {
          throw err;
      }
      console.log("Write action Success");
  });
});