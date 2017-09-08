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
 return Math.round((this.response.aggregations.parse_failures.doc_count / this.response.hits.total) * 100);
 }
})
```

Mustache:

```
<hr>
 <b>Percent Failures: {{meta.percent_fail}}%</b><BR>
 Total Hits: {{response.hits.total}} <BR>
 Failures: {{response.aggregations.parse_failures.doc_count}}
<hr>
```
