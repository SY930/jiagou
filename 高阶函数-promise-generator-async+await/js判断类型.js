// js中原始数据类型 string number boolean null undefined symbol / object
// 判断数据类型
// typeof instanceof contructor Object.prototype.toString.call 
// typeof缺点
// 1）对于基本类型，除 null 以外，均可以返回正确的结果。
// 2）对于引用类型，除 function 以外，一律返回 object 类型。
// 3）对于 null ，返回 object 类型。
// 4）对于 function 返回 function 类型。
// instanceof 判断一个对象是否是某一数据类型的实例 缺点 
// 1) 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型(所有的引用数据类型都指向 Object)。
// 2) 也不能不能判断字面值【Number Boolean String】

// constructor 对象通过prototype.constructor来判断对像的数据类型 缺点
// 1) null 和 undefined 是无效的对象，因此没有 constructor 存在
// 2) 函数的 constructor 是不稳定的 当重写 prototype 后，原有的constructor 引用会丢失，constructor 会默认为 Object

// toString 是 Object 原型对象上的方法，使用 call 来调用该方法会返回调用者的类型字符串，格式为 [object,xxx]

// 什么是闭包