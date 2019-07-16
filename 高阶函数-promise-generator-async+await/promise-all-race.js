// promise-all 解决多个异步 同步的问题 为了同步多个异步的结果
let fs = require('fs').promises;

function isPromise(value) {
  if (typeof value === 'function' || (typeof value === 'object' &&  value !== null)) {
    if (typeof value.then === 'function') {
      return true;
    }
  }
  return false;
}

Promise.all = function (values) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let i = 0;
    let processData = (key, value) => {
      arr[key] = value;
      if (++i === values.length) {
        resolve(arr)
      }
 
    }
    for (let i = 0; i < values.length; i++) {
      const cur = values[i];
      if (isPromise(cur)) {
        cur.then(y => {
          processData(i, y);
        }, reject)
      } else {
        processData(i, cur);
      }
    }
  })

}

Promise.all([fs.readFile('./name.txt','utf8'),fs.readFile('./age.txt','utf8'),1,2]).then(data=>{
  console.log(data);
});

Promise.race = function (values) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < values.length; i++) {
      const cur = values[i];
      if (isPromise(cur)) {
        cur.then(y=>{
          resolve(y)
        }, reject)
      }else {
        resolve(cur)
      }
      
    }
  })
  
}

Promise.race([fs.readFile('./name.txt','utf8'),fs.readFile('./age.txt','utf8')]).then(data=>{
  console.log(data);
});


// 中断 promise 链让 promise即不成功也不失败
let promise = new Promise((resolve,reject)=>{
  resolve();
})

// 中断一个 promise 让promise 超时
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(124);
  }, 3000)
})

function wrap(promise) { // 让该方法生成一个新的promise，先于 p 返回失败态
  let abort;
  let newPromise = new Promise((resolve, reject) => {
      abort = reject
  })
  let p = Promise.race([newPromise, promise]);
  p.abort = abort;
  return p;

}
let newP = wrap(p);
// setTimeout(() => {
  newP.abort('error');
// }, 2000)
newP.then(data => {
  console.log(data);
}, err => {
  console.log(err);
})

