function resolvePromise(Promise, x, resolve, reject) {
  // console.log('aaa',x);
  if (Promise === x) {
    // console.log('-------')
    return reject(new Error('return的结果不能与自己相等'));
  }
  let called; // 使用它目的是为了：如果引入别人的 promise失败了就不能再调成功，成功了就不能再调失败
  if (typeof x === 'function' || (typeof x === 'object' && typeof x !== null)) {

    try { // then里面 throw 一个错误信息
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          console.log('y===', y)
          resolvePromise(Promise, y, resolve, reject);
        }, r => {
          if (called) return;
          called = true;
          console.log('r', r)
          reject(r);
        })
      } else {
        // 是对象的情况
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      console.log('errr 报错')
      reject(e);
    }
  } else {
    console.log('x====', x)
    resolve(x);
  }

}
const PENDING = 'pending';
const SUCCESS = 'resovle';
const FAIL = 'reject';
class Promise {

  constructor(executor) {
    this.status = PENDING;
    this.value = '';
    this.reason = '';
    this.onfufilledCallbacks = [];
    this.onrejectCallbacks = [];
    const resolve = value => {
      // resolve(new Promise(res,reje)=>{res(1) // reje(1)}) 的结果是一个 promise
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = SUCCESS;
        this.onfufilledCallbacks.forEach((fn) => fn());
      }

    }
    const reject = reason => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = FAIL;
        this.onrejectCallbacks.forEach((fn) => fn());
      }

    }
    executor(resolve, reject);
  };
  then(onfufilled, onreject) {
    let Promise2;
    Promise2 = new Promise((resolve, reject) => {
      if (this.status === SUCCESS) {
        setTimeout(() => { // 为了防止Promise2 为空
          try {
            let x = onfufilled(this.value);
            resolvePromise(Promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        })

      }
      if (this.status === FAIL) {
        setTimeout(() => {
          try {
            let x = onreject(this.reason);
            resolvePromise(Promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDING) {
        this.onfufilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onfufilled(this.value);
              resolvePromise(Promise2, x, resolve, reject);
            } catch (e) {
              console.log('抛错', e);
              reject(e);
            }
          })
        })
        this.onrejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onreject(this.reason);
              resolvePromise(Promise2, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return Promise2;
  }

};

Promise.prototype.finally = function (callback) {
  return this.then((data) => {
    return new Promise((resolve, reject) => {
      resolve(callback())
    }).then(() => data)
  }, (err) => {
    return new Promise((resolve, reject) => {
      resolve(callback())
    }).then(() => {
      throw err
    })
  })
}

module.exports = Promise;