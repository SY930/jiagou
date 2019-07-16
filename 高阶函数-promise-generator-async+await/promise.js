
// let fs  = require('fs');
// function read (filePath) {
//   return new Promise((resolve,reject) =>{
//     fs.readFile(filePath, 'utf-8', function(err, data){
//       if (err) {
//         return reject(err);
//       }
//       resolve(data);
//     })
//   })
// }

// let p =read('./name.text').then(function(data){
//   return 1 
// }).then(data=>{
//   console.log('p.success2', data);
//   },err=>{
//     console.log('p.err2', err);
//   })
//   p.then(data=>{
//     console.log('p.success3', data);
//   },err=>{
//     console.log('p.err3', err);
//   })
// let p = new Promise((resovle,reject)=>{
//   throw new Error('err')
// }).then(null, err=>{
//   console.log('err', err)
//   return 100
// }).then((data)=>{
//   console.log('success', data);
//   throw new Error('err')
// },err=>{
//   console.log('err1',err)
// })

// p.then(()=>{}, err=>{
// console.log('throw err', err);
// })

let fs = require('fs');
 let Promise = require('./myPromise');

let p = new Promise((resolve,reject)=>{
  //resolve(10000);
  // fs.readFile('./name.text', 'utf-8', function(err,data){
  //   if (err) {
  //     reject(err);
  //   }
  //   resolve(data);
  // })
  reject(10000);
 
})
let p2 = p.then((data)=>{
  console.log(data);
  return new Promise((resolve,reject)=>{
    // throw new Error('err');
    resolve(100);
})
},err=>{
  return new Promise((resolve,reject)=>{
    // throw new Error('err');
    reject(100);
})
})
p2.then((data)=>{
  console.log('ddd',data);
  throw new Error('err');
}, err=>{
  console.log('r',err);
}).then(null, err=>{
  console.log('hhhh',err)
})

