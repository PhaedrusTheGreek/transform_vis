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
- without `transform_vis.allow_unsafe` - Expected Result: Nothing Displayed 


## Source

```
PUT /_bulk
{"index":{"_index":"test","_type":"doc"}}
{"test":1}
{"index":{"_index":".kibana","_type":"doc","_id":"visualization:12d5aed0-cc60-11e7-aadb-7b129851f054"}}
{"type":"visualization","visualization":{"title":"Style Tags Test","visState":"{\"title\":\"Style Tags Test\",\"type\":\"transform\",\"params\":{\"meta\":\"({\\n  count_hits: function() {\\n    return this.response.hits.total;\\n  }\\n})\",\"querydsl\":\"{\\n  \\\"query\\\": {\\n    \\\"bool\\\": {\\n      \\\"must\\\": [\\n        \\\"_DASHBOARD_CONTEXT_\\\"\\n      ]\\n    }\\n  }\\n}\",\"formula\":\"<style>\\n    .myfont {\\n        font-size: 40px;\\n    }\\n</style>\\n\\n<hr>\\n<div class=\\\"myfont\\\">My Text</div>\\n<hr>\",\"indexpattern\":\"test\"},\"aggs\":[]}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{}"}}}
{"index":{"_index":".kibana","_type":"doc","_id":"visualization:248ac390-cc60-11e7-aadb-7b129851f054"}}
{"type":"visualization","visualization":{"title":"Javascript Test","visState":"{\"title\":\"Javascript Test\",\"type\":\"transform\",\"params\":{\"meta\":\"({\\n hello_world: function() {\\n  return \\\"Hello World!\\\";\\n }\\n})\",\"querydsl\":\"{\\n  \\\"query\\\": {\\n    \\\"bool\\\": {\\n      \\\"must\\\": [\\n        \\\"_DASHBOARD_CONTEXT_\\\"\\n      ]\\n    }\\n  }\\n}\",\"formula\":\"<hr>\\n{{meta.hello_world}}\\n<hr>\",\"indexpattern\":\"test\"},\"aggs\":[]}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{}"}}}
{"index":{"_index":".kibana","_type":"doc","_id":"visualization:00f9e390-17e0-11e8-bf14-c9dbfc6e6269"}}
{"type":"visualization","updated_at":"2018-02-22T15:37:32.540Z","visualization":{"title":"Test D3","visState":"{\"title\":\"Test D3\",\"type\":\"transform\",\"params\":{\"formula\":\"<div id=\\\"viz\\\"> </div>\\n\\n\",\"indexpattern\":\"test\",\"meta\":\"({\\n  after_render: function() {\\n\\n    var sampleSVG = d3.select(\\\"#viz\\\")\\n        .append(\\\"svg\\\")\\n        .attr(\\\"width\\\", 100)\\n        .attr(\\\"height\\\", 100);    \\n\\n    sampleSVG.append(\\\"circle\\\") \\n        .style(\\\"stroke\\\", \\\"gray\\\") \\n        .style(\\\"fill\\\", \\\"white\\\")\\n        .attr(\\\"r\\\", 40)\\n        .attr(\\\"cx\\\", 50)\\n        .attr(\\\"cy\\\", 50)\\n        .on(\\\"mouseover\\\", function(){d3.select(this).style(\\\"fill\\\", \\\"aliceblue\\\");})\\n        .on(\\\"mouseout\\\", function(){d3.select(this).style(\\\"fill\\\", \\\"white\\\");});\\n  }\\n}) \",\"querydsl\":\"{\\n  \\\"query\\\": {\\n    \\\"bool\\\": {\\n      \\\"must\\\": [ \\n        \\\"_DASHBOARD_CONTEXT_\\\"\\n      ] \\n    } \\n  } \\n}\"},\"aggs\":[]}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{}"}}}
```

Create an index pattern called `test` with id `test` and point it at the test index
