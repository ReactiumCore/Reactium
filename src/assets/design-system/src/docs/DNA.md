
Module that creates a dependency tracker within the notes section of each material.

-------------------------------
##### Usage
-------------------------------
Within your partials you will need to add the following front-matter:
```javascript
{
  "dna": [
    "btn", "btn-primary", "btn-secondary", "btn-success", "btn-info", "btn-warning",
    "btn-outline-primary", "btn-outline-secondary", "btn-outline-success", "btn-outline-info", "btn-outline-warning"
  ]
}
```
The first element in the `dna` array is the ID of the partial and must be unique. The other values are css selectors that relate to the partial.

Optionally you can just specify a string:
```javascript
{
  "dna": "btn"
}
```

Within your HTML you will need to apply the `data-dna` attribute. The value of the attribute should be the same as the `dna` ID.
```javascript
<button type="button" class="btn btn-primary" data-dna="btn">Primary</button>
```

As you use the partial through out your toolkit, be sure to include the `data-dna` attribute. When the `dna.scan()` function executes, it will add any file containing `data-dna="btn"` or `id="btn"` to the dependents list.

Knowing that this could be a bit of work in exsisting projects, if you specify class selectors in the `dna` front-matter array, the `dna.scan()` function will add any file containing any of the specified classes to the dependents list. For instance if you specified `class="btn-primary"` anywhere in your toolkit, that file would then be added to the dependents list of `btn`.

