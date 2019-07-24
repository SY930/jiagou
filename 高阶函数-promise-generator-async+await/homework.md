### 柯理化

```js
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
```

### 反柯理化

```js
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
```


### new 的实现原理

```js
function MyCearte(p){
  let Fn = function(){}
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
```

### 数组的flatten方法
```js
let arr2 = [1, 2, [3, 4, [5, 6, 7, [8, 8, 10, [11, 22, 34]]]]];
Array.prototype.flatten = function (num) {
  if (num < 1) {
    return this
  }
  let arys = [];
  return this.reduce((pev, curent) => {
  Array.isArray(curent) ?  arys.push(...curent.flatten(num - 1)) :  arys.push(curent)
  return arys
  }, 0)
}
console.log(arr2.flatten(3))
```

### Promise.finnaly实现

```js
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

p.finally(()=>{
  return new Promise((resolve,reject)=>{
      setTimeout(() => {
          console.log('finally')
          resolve(55555);
      }, 3000);
  });
}).then(data=>{
  console.log('data',data)
},err=>{
  console.log('err',err);
})
```

### 简易的commonjs规范

```js
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
```
### minx 类的mixin