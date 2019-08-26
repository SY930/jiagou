// 生成器(Generator)与迭代器(Iterator) 
// Generator是一个特殊的函数，执行它会返回一个Iterator对象。 通过遍历迭代器(Iterator)， Generator函数运行后会返回一个遍历器对象{value: done:}，而不是普通函数的返回值。
// 迭代器(Iterator)有一个next方法，每次执行的时候会返回一个对象 对象里面有两个属性，一个是value表示返回的值，还有就是布尔值done,表示是否迭代完成
// 迭代器模拟
function buy(books) {
  let i = 0;
  return {
    next() {
      let done = i === books.length;
      let value = !done ? books[i++] : undefined;
      return {
        done,
        value
      }
    }
  }
}
let inerators = buy(['js', 'html'])
let curr;
do {
  curr = inerators.next();
  console.log(curr)
} while (!curr.done)


// Generators
function* buy1(books) {
  for (let i = 0; i < books.length; i++) {
    yield books[i];
  }
}

let buying = buy1(['js', 'html']);
let curr1;
do {
  curr1 = buying.next();
  console.log(curr1)
} while (!curr1.done)

// generator + promise 来使用
let fs = require('fs').promises;

function* read() {
  let content = yield fs.readFile('./name.txt', 'utf8');
  let age = yield fs.readFile(content, 'utf8');
  let a = yield age + 100;
  return a;
}

// co 库
function co(it) {
  return new Promise((resolve, reject) => {
    function next() {
      let {
        value,
        done
      } = it.next();
      if (!done) {
        Promise.resolve(value).then(data => {
          next(data);
        }, reject)
      } else {
        resolve(value);
      }
    }
    next();
  })
}

co(read()).then(data => {
  console.log('co', data)
})

// let it = read(); // 返回一个迭代器，可以调用 next 返回{value, done}
// let {value, done} = it.next();
// value.then(function(data) {
//   console.log(data);
//   let {value, done} = it.next(data);
//   value.then(function(data) {
//     let {value, done} = it.next(data);
//     value.then(function(data) {
//       console.log(value);
//     })
//   })
// }, function(err) {
//   it.throw(err);
// })


// async + await

let fs1 = require('fs').promises;
async function read() {
  try {
    let content = await fs.readFile('./name.txt', 'utf8');
    let age = await fs.readFile(content, 'utf8');
    let a = await age + 100;
    return a;
  } catch (e) {

  }
}
read().then(data => {
  console.log('async', data)
})