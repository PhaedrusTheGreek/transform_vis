* Jul 10 2017
 * Versions
    * 5.5.0
 * Changes
    * Merging pull request to support 5.5.0 

* Wed April 12 2017
  * Versions
    * 5.3.0-2
    * 5.2.2-2
  * Changes
    * When `allow_unsafe` is enabled, any HTML will be accepted in the template, such as <script> and <style> tags. 
    * Changed binding from the entire response being the root object, to the response being bound to the `response` object.   e.g.  `hits.hits` now is found at `response.hits.hits`
