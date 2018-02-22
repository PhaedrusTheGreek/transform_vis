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

Custom D3
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
  "size": 1, 
   "aggs": {
    "hosts": {
      "terms": {
        "field": "beat.hostname",
        "size": 10
      }
    }
  }
}
```

Javascript:

```
({
  after_render: function() {
      
 // Thanks @ http://bl.ocks.org/enjalot/1203641
 
 var w = 300,                        
    h = 300,                           
    r = 100,                            
    color = d3.scale.category20c();     
   
    var data = this.response.aggregations.hosts.buckets;
    
    var vis = d3.select("#viz")
        .append("svg:svg")              
        .data([data])                  
            .attr("width", w)          
            .attr("height", h)
        .append("svg:g")                
            .attr("transform", "translate(" + r + "," + r + ")")   

    var arc = d3.svg.arc()             
        .outerRadius(r);

    var pie = d3.layout.pie()          
        .value(function(d) { return d.doc_count; });    

    var arcs = vis.selectAll("g.slice")     
        .data(pie)                          
        .enter()                            
            .append("svg:g")                
                .attr("class", "slice");    

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) 
                .attr("d", arc);                                    

        arcs.append("svg:text")                                     
                .attr("transform", function(d) {                  
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        
            })
            .attr("text-anchor", "middle")                         
            .text(function(d, i) { return data[i].key.split(".")[0]; });       
            
  },
  debug: function() {
   return JSON.stringify(this, null, ' ');
  } 
}) 
```

Mustache:

```

<style type="text/css">
 .slice text {
   font-size: 12pt;
   font-family: Arial;
 }   
</style> 

<div id="viz"> </div>

<pre>
    {{ meta.debug }}
</pre>


```
