
Handlebars helper that returns a substring of characters of lorem ipsum latin text.

-------------------------------
##### Usage
-------------------------------
```javascript
{{lipsum 0 300}}
```

```javascript
{{lipsum "random" 300}}
```
-------------------------------
##### Parameters

| Argument	| Type 				| Description																						|
|:----------|:------------------|:--------------------------------------------------------------------------------------------------|
| index		| Number or String 	| Zero-based index at which to begin. If the value is "random" a random index will be selected.		|
| length 	| Number 			| Number of characters to return.																	|
