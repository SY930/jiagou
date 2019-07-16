// 高阶函数 =》 函数参数如果是一个函数，或者这个函数返回一个新的函数，就叫高阶函数，解决异步的问题

// AOP面向切片编程 在函数执行前后做一些事情，在不干扰原函数的情况下 react事务 就使用了他 见 reactAOP

//  before 函数

function say() {
  console.log('hello word');
}
Function.prototype.before = function (beforeFun) {
  return () => {
    beforeFun()
    this();
  }

}

let beforeSay = say.before(function () {
  console.log('begin')
})

// console.log(beforeSay.toString());
beforeSay();

// after函数 计数器原理。promise 的 all 方法也有用到
function after(times, fn) {
  return function () {
    if (--times === 0) {
      fn();
    }
  }
}

let fn = after(3, () => {
  console.log('三次后打印')
})
fn();
fn();
fn();

