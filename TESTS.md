Should be automated at some point, but for the time being:

**1) Style Tags Test**

`<style>` tags should be ignored in Mustache/HTML without `transform_vis.allow_unsafe` 


```
<style>
    .myfont {
        font-size: 40px;
    }
</style>

<hr>
<div class="myfont">My Text</div>
<hr>
```

- with `transform_vis.allow_unsafe` - Expected Result: The font size should be 40px
- without `transform_vis.allow_unsafe` - Expected Result: The font size should not be 40px


**2) Javascript Test**

```
({
 hello_world: function() {
  return "Hello World!";
 }
})
```

```
<hr>
{{meta.hello_world}}
<hr>
```

Result:   
- with `transform_vis.allow_unsafe` - Expected Result: "Hello World!"
- without `transform_vis.allow_unsafe` - Expected Result: `meta` variable does not exist
