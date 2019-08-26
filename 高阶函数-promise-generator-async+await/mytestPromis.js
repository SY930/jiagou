// let Promise = require('./myPromise');
// let fs = require('fs');

// let p = new Promise((resolve, reject) => {
//   // resolve(100) 同步方法
//   // 如果是异步的情况时没有resolve时status是pading状态，需要先将then的回调结果存起来，放到实例属性上等resolve后者reject后在执行相应的方法
//   // fs.readFile('./age.text','utf8',function(err,data){
//   //   if(err) {
//   //     reject(err);
//   //   }
//   //   resolve(data);
//   // })
//   setTimeout(()=>{
//     resolve('1000');
//   },200)
// }).then((data)=>{
//   return new Promise((resolve, reject)=>{
//     resolve(100)
//   })
// },(err)=>{
//   console.log('err', err);
// }).then((data)=>{
//   console.log('p2', data)
//   return new Promise((resolve, reject)=>{
//   resolve(200)
// })
// },err=>{
//   console.log('p2err', err)
// })

// p.then(data=>{
//   console.log('pthen', data);
// })

// Promise.finally的理解
let Promise = require('./myPromise');
Promise.prototype.finally = function (callback) {
  return this.then((data) => {
     console.log('成功', data);
    return new Promise((resolve, reject) => {
      resolve(callback())
    }).then(() => {console.log('aaaaa', data);
     return data})
  }, (err) => {
    return new Promise((resolve, reject) => {
      resolve(callback())
    }).then(() => {
      console.log('失败',err)
      throw err
    })
  })
}
let p = new Promise((resolve, reject) => {
  resolve(100)
})


p.finally(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('finally')
      resolve(55555);
    }, 3000);
  });
}).then(data => {
  console.log('data', data)
}, err => {
  console.log('err', err);
})
