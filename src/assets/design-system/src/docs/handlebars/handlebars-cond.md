
Handlebars helper that allows you to use comparison conditions like a typical IF statement.

-------------------------------
##### Usage
-------------------------------
```javascript
{{#cond 0 '<' 300}}
correct!
{{/cond}}
```

```javascript
{{#cond 0 '>' 300}}
Are you sure?
{{else}}
I don't think so
{{/cond}}
```

```javascript
{{#cond this 'or' that}}
this or that comparison
{{/cond}}
```

```javascript
{{#cond this 'and' that}}
this and that comparison
{{/cond}}
```

-------------------------------
##### Parameters

| Argument | Description  |
|:----------|:------------|
| lvalue    | The first value to compare.|
| operator  | The comparison operator. Values: == === != !== < > <= >=  && and \|\| or typeof. |
| rvalue    | The second value to compare.
