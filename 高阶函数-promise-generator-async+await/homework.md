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