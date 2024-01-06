# JavaScript notes

# Very informative article

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var

# relation operators

```js
// strings are converted reasonablely
> 2 < '1'
false
> 2 > '1'
true
> 2 == '2'
true
// some invalid objects are converted to 0
> -1 < ''
true
> 0 == ''
true
> 0 == +[]
true
// {} is converted to NaN
> isNaN(+{})
true
> +null
0
> null > 0
false
> null >= 0
true
> null == 0
false
// objects are compared by reference
> {} == {}
false
> var a, b; a = b = {}; a == b
true
> '[object Object]' == {}
true
// nothing is equal to NaN
> !!NaN
false
> NaN == false
false
```

# convert to string

```js
> String([1,null,2,[],{}])
'1,,2,,[object Object]'
> String(null)
'null'
> String([null])
''
> String([])
''
```

# convert to numbers

```js
// parseInt does not recognize 'e'
> parseInt('1e3')
1
> parseFloat('1e3')
1000
// 1e3 is a valid number literal
> 1e3
1000
> parseInt(1e3)
1000
> parseFloat('122.00000000000001')
122.00000000000001
> parseFloat('122.000000000000001')
122
// Number() returns NaN on any error
> Number('1k')
NaN
> Number('1e3')
1000
> ++undefined
NaN
> ++0;
++0;
  ^

Uncaught SyntaxError: Invalid left-hand side expression in prefix operation
> +[-1,3,4]
NaN
> +[-1,]
-1
> +[]
0
```

# convert to boolean

```js
> !!''
false
> !!'0'
true
// as soon as the value of the expression is determined, the latest evaulated sub-expression is returned
> false&&1||0
0
> false&&(1||0)
false
> (false&&1)||0
0
> !!('' || null || undefined || NaN || 0)
false
```

