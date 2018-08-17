* Aug 17 2018
  * Versions
  * 6.4.0 changes as per https://www.elastic.co/blog/upcoming-kibana-plugin-api-changes-in-6-4
* Feb 22 2018
 * Versions
    * 6.2.2, then 6.2.2 re-released again same day with 2 bugs fixed related to after_render
 * Changes
    * before_render and after_render methods added
* Nov 17 2017
 * Versions
    * 6.0.0
 * Changes
    * Total re-org for new visualization framework
* Nov 16 2017
 * Versions
    * 5.6.4
 * Changes
    * Support changes in Index Pattern service

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
