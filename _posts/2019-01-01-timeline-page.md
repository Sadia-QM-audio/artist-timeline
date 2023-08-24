---
layout: post
title: "Timeline generation"
author: ""
# categories: documentation
# tags: [documentation,sample]
image: cuba-1.jpg
---
<!-- Code from https://www.w3schools.com/howto/howto_css_timeline.asp -->

<!-- Access this page using http://127.0.0.1:4000/timeline-page
Play around with the CSS and formatting -->


<!-- https://openaccess-api.clevelandart.org/api/creators/24407 -->

<div class="timeline">
  <div class="timelinecontainer timelineleft">
    <div class="timelinecontent">
      <h2>2017</h2>
      <img src="assets/img/city-1.jpg">
      <p>Lorem ipsum..</p>
    </div>
  </div>
  <div class="timelinecontainer timelineright">
    <div class="timelinecontent">
      <h2>2016</h2>
      <img src="assets/img/city-1.jpg">
      <p>Lorem ipsum..</p>
    </div>
  </div>
</div>




<script src="assets/my-script.js"></script>



<!-- <div id = "output"> </div>
   <button onclick = "getData()"> get data using Axios </button>
   
   

<script>
    async function getData() {
        const response = await fetch("http://example.com/movies.json", {
            mode: 'no-cors'
        });
        const movies = await response.json();
        console.log(movies);
    }
   </script> -->


   <!-- let output = document.getElementById('output');
      async function getData() {
         let response = await
         axios.get("https://jsonplaceholder.typicode.com/todos/1")
         for (let key in response.data) {
            output.innerHTML += key + " - " + response.data[key] + "<br/>";
         }
      } -->
