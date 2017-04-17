Should be automated at some point, but for the time being:

## 1) Style Tags Test

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

## 2) Javascript Test

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


## Source

```
{"index":{"_index":".kibana","_type":"visualization","_id":"736d0290-2371-11e7-be0c-1bb0fbe2c940"}}
{"title":"Test #2 (Javascript Eval Security)","visState":"{\"title\":\"Test #2 (Javascript Eval Security)\",\"type\":\"transform\",\"params\":{\"outputs\":{\"formula\":\"\\n<hr>\\n{{meta.hello_world}}\\n<hr>\",\"indexpattern\":\"test\",\"meta\":\"({\\n hello_world: function() {\\n  return \\\"Hello World\\\";\\n }\\n})\",\"querydsl\":\"{\\n \\\"query\\\": {\\n  \\\"bool\\\": {\\n   \\\"must\\\": [\\n     \\\"_DASHBOARD_CONTEXT_\\\"\\n   ]\\n  }\\n }\\n}\"}},\"aggs\":[],\"listeners\":{}}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query_string\":{\"query\":\"*\"}},\"filter\":[],\"index\":\"test\"}"}}

{"index":{"_index":".kibana","_type":"visualization","_id":"3c633260-2371-11e7-be0c-1bb0fbe2c940"}}
{"title":"Test #1 (Style Tags Security)","visState":"{\"title\":\"Test #1 (Style Tags Security)\",\"type\":\"transform\",\"params\":{\"outputs\":{\"formula\":\"<style>\\n    .myfont {\\n        font-size: 40px;\\n    }\\n</style>\\n\\n<hr>\\n<div class=\\\"myfont\\\">My Text</div>\\n<hr>\",\"indexpattern\":\"test\",\"meta\":\"({\\n count_hits: function() {\\n  return this.response.hits.total;\\n }\\n})\",\"querydsl\":\"{\\n \\\"query\\\": {\\n  \\\"bool\\\": {\\n   \\\"must\\\": [\\n     \\\"_DASHBOARD_CONTEXT_\\\"\\n   ]\\n  }\\n }\\n}\"}},\"aggs\":[],\"listeners\":{}}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{\"query\":{\"query_string\":{\"query\":\"*\"}},\"filter\":[],\"index\":\"test\"}"}}
```
