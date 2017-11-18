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
{"index":{"_index":".kibana","_type":"doc","_id":"index-pattern:de98ba40-cc5f-11e7-aadb-7b129851f054"}}
{"type":"index-pattern","index-pattern":{"title":"test","fields":"[{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"test\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]"}}
{"index":{"_index":".kibana","_type":"doc","_id":"visualization:12d5aed0-cc60-11e7-aadb-7b129851f054"}}
{"type":"visualization","visualization":{"title":"Style Tags Test","visState":"{\"title\":\"Style Tags Test\",\"type\":\"transform\",\"params\":{\"meta\":\"({\\n  count_hits: function() {\\n    return this.response.hits.total;\\n  }\\n})\",\"querydsl\":\"{\\n  \\\"query\\\": {\\n    \\\"bool\\\": {\\n      \\\"must\\\": [\\n        \\\"_DASHBOARD_CONTEXT_\\\"\\n      ]\\n    }\\n  }\\n}\",\"formula\":\"<style>\\n    .myfont {\\n        font-size: 40px;\\n    }\\n</style>\\n\\n<hr>\\n<div class=\\\"myfont\\\">My Text</div>\\n<hr>\",\"indexpattern\":\"de98ba40-cc5f-11e7-aadb-7b129851f054\"},\"aggs\":[]}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{}"}}}
{"index":{"_index":".kibana","_type":"doc","_id":"visualization:248ac390-cc60-11e7-aadb-7b129851f054"}}
{"type":"visualization","visualization":{"title":"Javascript Test","visState":"{\"title\":\"Javascript Test\",\"type\":\"transform\",\"params\":{\"meta\":\"({\\n hello_world: function() {\\n  return \\\"Hello World!\\\";\\n }\\n})\",\"querydsl\":\"{\\n  \\\"query\\\": {\\n    \\\"bool\\\": {\\n      \\\"must\\\": [\\n        \\\"_DASHBOARD_CONTEXT_\\\"\\n      ]\\n    }\\n  }\\n}\",\"formula\":\"<hr>\\n{{meta.hello_world}}\\n<hr>\",\"indexpattern\":\"de98ba40-cc5f-11e7-aadb-7b129851f054\"},\"aggs\":[]}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{}"}}}
{"index":{"_index":".kibana","_type":"doc","_id":"index-pattern:80812210-cc61-11e7-8949-83d23621e0bf"}}
{"type":"index-pattern","index-pattern":{"title":"test-filters","timeFieldName":"@datetime","fields":"[{\"name\":\"@datetime\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"colour\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"colour.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]"}}
{"index":{"_index":".kibana","_type":"doc","_id":"visualization:bab222e0-cc61-11e7-8949-83d23621e0bf"}}
{"type":"visualization","visualization":{"title":"Filters Test","visState":"{\"title\":\"Filters Test\",\"type\":\"transform\",\"params\":{\"meta\":\"({\\n  count_hits: function() {\\n    return this.response.hits.total;\\n  }\\n})\",\"querydsl\":\"{\\n  \\\"query\\\": {\\n    \\\"bool\\\": {\\n      \\\"must\\\": [\\n        \\\"_DASHBOARD_CONTEXT_\\\"\\n      ]\\n    }\\n  }\\n}\",\"formula\":\"<hr>\\n{{meta.count_hits}}\\n<hr>\",\"indexpattern\":\"80812210-cc61-11e7-8949-83d23621e0bf\"},\"aggs\":[]}","uiStateJSON":"{}","description":"","version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{}"}}}
```

Create an index pattern called `test` and point it at the test index
