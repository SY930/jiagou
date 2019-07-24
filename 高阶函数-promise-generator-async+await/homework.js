// 柯理化 与 反柯理化
// 1. 柯理化
function currying(fn) {
  let allArg = [];
  return function next() {
    let arg = [].slice.call(arguments);
    if (arg.length > 0) {
      allArg.concat(arg);
      return next;
    } else {
      fn.apply(null, arguments)
    }
  }
}

let add = currying(function () {
  let sum = 0;
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];

  }
  return sum
})

add(1)(2)(3)()
// 调用一次 add(1)返回一个函数next先把参数先存起来等最后没有传参了(真正执行时())在让函数执行相加操作
// 当执行var add = currying(...)时，add变量已经指向了next方法。此时，allArgs在next方法内部有引用到，所以不能被GC回收。也就是说，allArgs在该赋值语句执行后，一直存在，形成了闭包。
// 依靠这个特性，只要把接收的参数，不断放入allArgs变量进行存储即可。
// 所以，当arguments.length > 0时，就可以将接收的新参数，放到allArgs中。
// 最后返回next函数指针，形成链式调用。
function add(a, b, c, d) {
  return a + b + c + d;
}

function currying(fn) {
  const args = [];
  return function res(...arguments) {
    args.push(...arguments)
    return args.length === fn.length ? fn.call(null, ...args) : res
  }
}


console.log(currying(add)(1, 2)(3)(4));
console.log(add)





// 2. 反柯理化

// 轻提示
function Toast(option) {
  this.prompt = '';
}
Toast.prototype = {
  constructor: Toast,
  // 输出提示
  show: function () {
    console.log(this.prompt);
  }
};

// 新对象
var obj = {
  prompt: '新对象'
};

function unCurrying(fn) {
  return function () {
    console.log(arguments)
    var args = [].slice.call(arguments);
    console.log(args)
    var that = args.shift();
    console.log(that);
    return fn.apply(that, args);
  }
}

var objShow = unCurrying(Toast.prototype.show);

objShow(obj); // 输出"新对象"



// promise.try

function add(a, b, c) {
  return a + b + c;
}
add(2, 2, 3)

function add2(a) {
  return function (b) {
    return function (c) {
      return a + b + c
    }
  }
}

function unCurrying(fn) {
  return function collent(...arguments) {
    for (let i = 0; i < arguments.length; i++) {
      fn = fn(arguments[i])
    }
    return fn
  }

}

unCurrying(add2)(1, 2, 3)


// new 的原理

function MyCearte(p) {
  let Fn = function () {}
  Fn.prototype = p;
  return Fn;
}

function newA(func) {
  // 创建了一个对象o, 并创建了这个对象的原型(__proto)指向func
  let o = MyCearte(func.prototype);

  // 让函数执行，并让他的 this 是实例对象
  let k = func.call(o);

  // 让这个实例对象o 返回
  // 如果构造函数返回的是一个对象或者函数返回结果是当前构造函数的返回值 k
  return typeof k === 'object' || 'function' ? k : o
}

function A() {
  this.age = '10';
}

let a = new(A) //=>   new A();

//数组的flatten方法
let arr2 = [1, 2, [3, 4, [5, 6, 7, [8, 8, 10, [11, 22, 34]]]]];
Array.prototype.flatten = function (num) {
  if (num < 1) {
    return this
  }
  return this.reduce((pev, curent) => Array.isArray(curent) ? pev.concat(curent.flatten(num - 1)) : pev.concat(curent), [])
}
console.log(arr2.flatten(3))

let arr2 = [1, 2, [3, 4, [5, 6, 7, [8, 8, 10, [11, 22, 34]]]]];
Array.prototype.flatten = function (num) {
  if (num < 1) {
    return this
  }
  let arys = [];
  return this.reduce((pev, curent) => {
    Array.isArray(curent) ? arys.push(...curent.flatten(num - 1)) : arys.push(curent)
    return arys
  }, 0)
}
console.log(arr2.flatten(3))


// Promise.finnaly实现

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
let p = new Promise((resolve, reject) => {
  resolve('ddd')
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


// 简易 commonjs 规范
let path = require('path');
let fs = require('fs');
let vm = require('vm');

let wrapper = [
  '(function(exports, module, require, __dirname, __filename){'
   ,
  '})'
]

class Module {
  constructor(id) {
    this.id = id; // 文件的绝对路径
    this.exports = {}
  }
  load() {
    // 获取文件的后缀
    let ext = path.extname(this.id);
    // 根据不同的后缀名加载想应的方法
    Module[ext](this);
  }
 

  static '.js'(module) {
    let script = fs.readFileSync(module.id, 'utf-8');
    // 读取的到内容包装成一个函数
    let funcStr = `${wrapper[0]}${script}${wrapper[1]}`;
    console.log(funcStr)
    // 动态执行字符串代码
    let fn = vm.runInThisContext(funcStr);
    fn.call(module.exports, module.exports, module, myRequire);
  }

  static '.json'(module) {
    let script = fs.readFileSync(module.id, 'utf-8');
    module.exports = JSON.parse(script);
  }
}

function myRequire(mypath) {
  // 当前路径 mypath 变成一个绝对路径
  let absPath = path.resolve(__dirname, mypath);
  let moulde = new Module(absPath);
  // 加载模块
   moulde.load();

  return moulde.exports
}
let a = myRequire('./b.json')
console.log(a)

// minx 类的mixin