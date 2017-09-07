Show the percent of documents that match a filter
---------------------

Query:

```
{
 "query": {
 "bool": {
 "must": [
 "_DASHBOARD_CONTEXT_"
 ]
 }
 },
 "size": 0,
 "aggs" : {
 "parse_failures" : {
 "filter" : { "term": { "tags.keyword": "_fail" } }
 }
 }
}
```

Javascript:

```
({
 percent_fail: function() {
 return Math.round((this.aggregations.parse_failures.doc_count / this.hits.total) * 100);
 }
})
```

Mustache:

```
<hr>
 <b>Percent Failures: {{meta.percent_fail}}%</b><BR>
 Total Hits: {{hits.total}} <BR>
 Failures: {{aggregations.parse_failures.doc_count}}
<hr>
```
