A Kibana visualization plugin that allows arbitrary query results to be processed by a [Mustache](https://mustache.github.io/) transform.

Installation for Kibana 5.3.0:

```
bin/kibana-plugin install https://github.com/PhaedrusTheGreek/transform_vis/releases/download/5.3.0/transform_vis-5.3.0.zip
```

![Transform Vis](https://raw.githubusercontent.com/PhaedrusTheGreek/transform_vis/master/transform_vis.png)

**Support for Javascript**

By default, no unsafe HTML (such as `<script> tags`) will be allowed, as processed by Angular's [$sanitize](https://docs.angularjs.org/api/ngSanitize/service/$sanitize) , but Javascript processing can be achieved by acknowledging the client-side security risk in `kibana.yml` with `transform_vis.allow_unsafe: true`.   When enabled, a "Javscript" box appears that allows you to create a special object that will be merged with the query's response object under the field name `meta`.

Any Javascript given will be executed by the web browser, however in order to be merged with the query response object for processing by Mustache, you must prepare an Object, enclosed by parentheses like this:

```
({
 some_var: 42,
 count_hits: function() {
  return this.hits.total;
 }
})
```

Named functions can then be called by mustache, like:

```
<hr>{{meta.count_hits}} total hits<hr>
```

**Query DSL**

`"_DASHBOARD_CONTEXT_"`, including the surrounding quotes, will be replaced by a bool query that represents the filter/search state of the dashboard in context.  

This example is given to demonstrate how the dashboard context can co-exist with your own query clauses, but you are not restricted to this format.

The following code produces multi-level bool statement:

```
{
 "query": {
  "bool": {
   "must": [
     "_DASHBOARD_CONTEXT_"
     .. your must clause(s) can go here ..
   ], 
   "should": [
     .. your should clause(s) can go here ..
   ]
  }
 }
}
```


On a default dashboard, it will be executed as:

```
POST skillsuggest_test/skilltype_test 
{
   "query": {
      "bool": {
         "must": [
            {
               "bool": {
                  "must": [
                     {
                        "query_string": {
                           "query": "*"
                        }
                     },
                     {
                        "range": {
                           "postDate": {
                              "gte": "now-5y",
                              "lte": "now"
                           }
                        }
                     }
                  ],
                  "must_not": []
               }
            }
         ]
      }
   }
}
```

**An example with an aggregation**

Here's something that compares aggregation results with other results content.

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
 Total Hits: {{hits.total}}  <BR>
 Failures: {{aggregations.parse_failures.doc_count}}
<hr>
```

**An example with presenting hits via field collapsing**
Elasticsearch 5.3 Introduces [Field Collapsing](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/search-request-collapse.html).  Here's an example of displaying `Chrome` processes from Metricbeat logs.  We might have a bunch of logs for the same PID, but with Field collapsing we can easily make sure we only see the most recent (see `sort`) log from each PID.

Query:

```
{
   "size": 5,
   "query": {
      "bool": {
         "must": [
            "_DASHBOARD_CONTEXT_",
            {
               "regexp": {
                  "system.process.cmdline": ".*Chrome.*"
               }
            }
         ]
      }
   },
   "collapse": {
      "field": "system.process.pid"
   },
   "sort": {
      "@timestamp": {
         "order": "desc"
      }
   }
}
```

Mustache:

```
<hr>
<table width=100% border=1>
{{#hits.hits}} 
<tr>
 <td> {{_source.system.process.name}} </td>
 <td> {{_source.system.process.pid}} </td>
 <td> {{_source.system.process.cmdline}} </td>
</tr>
{{/hits.hits}} 
</table>
<hr>
```
