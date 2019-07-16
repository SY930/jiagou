class Transaction{
  prefrom(anyFuntion, wrappers){
    wrappers.forEach(item => item.initialize());
    anyFuntion()
    wrappers.forEach(item => item.close());

  }
}
let transaction = new Transaction();

let oldFunc = () =>{
  console.log('原有的逻辑')
}

transaction.prefrom(oldFunc, [{
  initialize(){
    console.log('初始化 1')
  },
  close(){
    console.log('关闭1')
  }
}, {
  initialize(){
    console.log('初始化2')
  },
  close(){
    console.log('关闭2')
  }
}])