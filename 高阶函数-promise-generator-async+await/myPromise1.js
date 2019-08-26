function resolvePromise(Promise, x, resolve, reject) {
  if (Promise === x) {
    return reject(new Error('x===Promise'));
  }
  if (typeof x === 'function' || (typeof x === "object" && x !== null)) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, (r) => {
          resolvePromise(Promise, r, resolve, reject)
        }, y => {
          reject(y)
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(x)
  }

}

const PANDING = 'panding';
const FAIL = 'rejected';
const SUCCESS = 'success';
class Promise {
  constructor(executor) {
    this.status = PANDING; // 状态
    this.value = undefined; // 成功的结果
    this.reason = undefined; // 失败的原因
    this.onfufilledCallbacks = [];
    this.onrejectedCallbacks = [];
    let resolve = (value) => {
      this.value = value;
      this.status = SUCCESS;
      this.onfufilledCallbacks.forEach(fn => fn());
    }
    let reject = (reason) => {
      this.reason = reason;
      this.status = FAIL;
      this.onrejectedCallbacks.forEach(fn => fn())
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e);
    }

  }

  then(onfufilled, onrejected) {

    let Promise2;
    Promise2 = new Promise((resolve, reject) => {
      if (this.status === SUCCESS) {
        setTimeout(() => {
          try {
            let x = onfufilled(this.value);
            resolvePromise(Promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })

      }

      if (this.status === FAIL) {
        setTimeout(() => {
          try {
            let x = onrejected(this.reason)
            resolvePromise(Promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }

        })

      }

      if (this.status === PANDING) {
        this.onfufilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onfufilled(this.value);
              resolvePromise(Promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onrejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onrejected(this.reason)
              resolvePromise(Promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })

        })
      }
    })
    return Promise2;
  }
}

module.exports = Promise;


class A {
  constructor() {
    this.id = {}
  }

  load() {
    A['a'](this)
  }

  static 'a'(m) {
    function fn(id) {
       console.log(id)
      id = 'a'
    }
    fn(m.id)
  }
}

function b() {
  let a = new A()
  a.load()
  return a.id
}
console.log(b())