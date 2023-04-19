// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option //set up some variables 
let editElement;
let editFlag = false; //only because it is used after we click to edit
let editID = "";


// ****** EVENT LISTENERS **********

//submit our form 
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);



// ****** FUNCTIONS **********
// add item
function addItem(e) {
    e.preventDefault();
    const value = grocery.value; //access value in grocery by using value property
    const id = new Date().getTime().toString(); //create a unique id
//now set up conditions for our 3 options
  if (value && !editFlag) { //if item is not on the list & not editing then add it to the list
    createListItem(id, value)
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
} 
else if(value && editFlag){ //if I AM editing
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage 
    editLocalStorage(editID, value);
    //Set back to default so you can edit next time as well
    setBackToDefault();
} 
else{
   displayAlert("please enter value", "danger")
}
}

//display alert 
function displayAlert(text, action) {
    alert.textContent = text;
    //add classes
    alert.classList.add(`alert-${action}`);

    // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
      items.forEach(function (item) {
        list.removeChild(item);
      });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
  }


//delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement; //target = our fontawesome btn
    const id = element.dataset.id; //get id to remove from local storage
  
    list.removeChild(element); //this is what we are removing from our class "grocery-list"
    //remove show container so it doesn't stay behind if there are no more items on the list
    if (list.children.length === 0) {
      container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger"); //go back to default
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
  }

// edit item
  function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling; //sibling gives us the title to style
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    //
    submitBtn.textContent = "edit";
  }

//set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
    const grocery = {id, value};
    //get grocery items
    let items = getLocalStorage();

    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    //console.log("added to local storage")
    }

function removeFromLocalStorage(id) {
    //remove items
    let items = getLocalStorage();

    items = items.filter(function (item) {
      if (item.id !== id) { //filter out values that don't match this id
        return item;
      }
    });
    localStorage.setItem("list", JSON.stringify(items));
    }


function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
      if (item.id === id) {
        item.value = value;
      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
    }
    

function getLocalStorage(){
    return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
//localStorage API
//setItem
//getItem
//removeItem
//save as strings
localStorage.setItem()


// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
  
    if (items.length > 0) {
      items.forEach(function (item) {
        createListItem(item.id, item.value);
      });
      container.classList.add("show-container");
    }
  }

function createListItem(id, value){
    const element = document.createElement("article");
    //add class and unique id
    element.classList.add('grocery-item');
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr); //add attr to element
    //add html (becareful not to grab article)
    element.innerHTML = `<p class="title">${value}</p> 
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
}