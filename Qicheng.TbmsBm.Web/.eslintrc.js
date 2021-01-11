module.exports = {
  root: true,
  env: {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true,
    "amd": true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "no-dupe-keys":2,
    "no-extra-boolean-cast":2,
    "no-extra-semi":2,
    // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
  "array-bracket-spacing": [2,"never"],
  // 禁止或强制在单行代码块中使用空格(禁用)
  "block-spacing":[1,"never"],
  //强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
  // if while function 后面的{必须与if在同一行，java风格。
  "brace-style": [2,"1tbs", {"allowSingleLine":true}],
  // 双峰驼命名格式
  "camelcase":2,
  // 控制逗号前后的空格
  "comma-spacing": [2, {"before":false,"after":true}],
  // 控制逗号在行尾出现还是在行首出现 (默认行尾)
  // http://eslint.org/docs/rules/comma-style
  "comma-style": [2,"last"],
  //"SwitchCase" (默认：0) 强制 switch 语句中的 case 子句的缩进水平
  // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
  "computed-property-spacing": [2,"never"],
  // 用于指统一在回调函数中指向this的变量名，箭头函数中的this已经可以指向外层调用者，应该没卵用了
  // e.g [0,"that"] 指定只能 var that = this. that不能指向其他任何值，this也不能赋值给that以外的其他值
  "consistent-this": [1,"that"],
  // 强制使用命名的 function 表达式
  "func-names":0,
  // 文件末尾强制换行
  // "eol-last":2,
  "indent": [2,2, {"SwitchCase":1}],
  // 强制在对象字面量的属性中键和值之间使用一致的间距
  "key-spacing": [2, {"beforeColon":false,"afterColon":true}],
  // 要求在注释周围有空行 ( 要求在块级注释之前有一空行)
  "lines-around-comment": [1,{"beforeBlockComment":true}],
  // 强制一致地使用函数声明或函数表达式，方法定义风格，参数：
  // declaration: 强制使用方法声明的方式，function f(){} e.g [2, "declaration"]
  // expression：强制使用方法表达式的方式，var f = function() {} e.g [2, "expression"]
  // allowArrowFunctions: declaration风格中允许箭头函数。 e.g [2, "declaration", {     "allowArrowFunctions": true }]
  "func-style":0,
  // 强制回调函数最大嵌套深度 5层
  "max-nested-callbacks": [1,5],
  // 禁止使用指定的标识符
  "id-blacklist":0,
  // 强制一行的最大长度
  "max-len":[1,200],
  // 强制最大行数
  "max-lines":0,
  // 强制 function 定义中最多允许的参数数量
  "max-params":[1,7],
  // 强制 function 块最多允许的的语句数量
  "max-statements":[1,200],
  // 强制每一行中所允许的最大语句数量
  "max-statements-per-line":0,
  // 要求构造函数首字母大写 （要求调用 new 操作符时有首字母大小的函数，允许调用首字母大写的函数时没有 new 操作符。）
  "new-cap": [2, {"newIsCap":true,"capIsNew":false}],
  // 要求调用无参构造函数时有圆括号
  "new-parens":2,
  // 要求或禁止 var 声明语句后有一行空行
  "newline-after-var":0,
  // 要求 return 语句之前有一空行
  "newline-before-return":0,
  // 不允许空格和 tab 混合缩进
  "no-mixed-spaces-and-tabs":2,
  // 不允许多个空行
  "no-multiple-empty-lines": [2, {"max":2}],

  // 禁止 function 标识符和括号之间出现空格
  "no-spaced-func":2,

  // 禁用行尾空格
  "no-trailing-spaces":2,

  // 禁止属性前有空白
  "no-whitespace-before-property":0,
  // 强制花括号内换行符的一致性
  "object-curly-newline":0,
  // 强制在花括号中使用一致的空格
  "object-curly-spacing":0,
  // 强制将对象的属性放在不同的行上
  "object-property-newline":0,
  // 强制函数中的变量要么一起声明要么分开声明
  "one-var": [2, {"initialized":"never"}],
  // 要求或禁止在 var 声明周围换行
  "one-var-declaration-per-line":0,
  // 要求或禁止块内填充
  "padded-blocks":0,
  // 要求对象字面量属性名称用引号括起来
  "quote-props":0,
  // 强制使用一致的反勾号、双引号或单引号
  "quotes": [2,"single","avoid-escape"],
  // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
  "semi-spacing":0,
  // 要求同一个声明块中的变量按顺序排列
  "sort-vars":0,
  // 强制在块之前使用一致的空格
  "space-before-blocks": [2,"always"],
  // 强制在 function的左括号之前使用一致的空格
  // "space-before-function-paren": [2,"always"],
  // 强制在圆括号内使用一致的空格
  "space-in-parens": [2,"never"],
  // 要求操作符周围有空格
  "space-infix-ops":2,
  // 强制在一元操作符前后使用一致的空格
  "space-unary-ops": [2, {"words":true,"nonwords":false}],


  //////////////
  // ES6.相关 //
  //////////////

  "arrow-spacing":[2,{"before":true,"after":true}],
  // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
  "constructor-super":0,

  // 禁止修改类声明的变量
  "no-class-assign":2,
 
  // 禁止修改 const 声明的变量
  "no-const-assign":2,
  // 禁止类成员中出现重复的名称
  "no-dupe-class-members":2,
  // 不允许复制模块的进口
  "no-duplicate-imports":0,
  // 禁止 Symbol 的构造函数
  "no-new-symbol":2,
  // 允许指定模块加载时的进口
  "no-restricted-imports":0,
  // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
  "no-this-before-super":2,
  // 禁止不必要的计算性能键对象的文字
  "no-useless-computed-key":0,

  // 要求使用 const 声明那些声明后不再被修改的变量
  "prefer-const":0,

  // 要求使用扩展运算符而非 .apply()
  "prefer-spread":0,
  // 要求使用模板字面量而非字符串连接
  "prefer-template":0,
  "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
