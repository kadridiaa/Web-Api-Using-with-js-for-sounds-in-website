window.onload = () => {
    console.log("Page is loaded");
    start();
}

// URI of the endpoint
const URI_endpoint = "https://jsonplaceholder.typicode.com/users";

/*
// Let's send a HTTP GET request 
fetch(URI_endpoint)
.then(response => {
  // transform / deserialize from JSON
  // to a JavaScript object...
  return response.json();
}).then(decodedResponse => {
  console.log("ANSWER IS BACK!")
  console.log(decodedResponse);
  console.log("REQUEST HAS BEEN SENT !!!!!")
})
*/

async function getData() {
    const response = await fetch(URI_endpoint);
    // this line will be executed only when 
    // the previous one finished
    const decodedResponse = await response.json();
    //console.log(decodedResponse);
  
    // we are going to iterate on the list of users that
    // we just received
    const users = decodedResponse;
  
    // first get the ul element, using the selector API
    let ul = document.querySelector("#userList");
  
    users.forEach(user => {
      //console.log(user.name);
      // for each user, create a <li> element
      // We use the DOM API
      let li = document.createElement("li");
      // we use the innerHTML property to insert
      // text or html inside <li>...</li>
      li.innerHTML = user.name;
      
      // let's add it to the parent ul element
      ul.appendChild(li);
    })
}

function start() {
    // called only when page is loaded
    // and DOM is ready
   getData()
}

