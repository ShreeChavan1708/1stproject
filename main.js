// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:3000`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
const pitchURL = `${baseServerURL}/pitches`;
let mainSection = document.getElementById("data-list-wrapper");

// pitch
let pitchTitleInput = document.getElementById("pitch-title");
let pitchImageInput = document.getElementById("pitch-image");
let pitchCategoryInput = document.getElementById("pitch-category");
let pitchfounderInput = document.getElementById("pitch-founder");
let pitchPriceInput = document.getElementById("pitch-price");
let pitchCreateBtn = document.getElementById("add-pitch");

// Update pitch
let did;
let updatePitchIdInput = document.getElementById("update-pitch-id");
let updatePitchTitleInput = document.getElementById("update-pitch-title");
let updatePitchImageInput = document.getElementById("update-pitch-image");
let updatePitchfounderInput = document.getElementById("update-pitch-founder");
let updatePitchCategoryInput = document.getElementById("update-pitch-category");
let updatePitchPriceInput = document.getElementById("update-pitch-price");
let updatePitchBtn = document.getElementById("update-pitch");

//Update price
let updatePricePitchId = document.getElementById("update-price-pitch-id");
let updatePricePitchPrice = document.getElementById("update-price-pitch-price");
let updatePricePitchPriceButton = document.getElementById("update-price-pitch");

//sort and filter
let sortAtoZBtn = document.getElementById("sort-low-to-high");
let sortZtoABtn = document.getElementById("sort-high-to-low");
let filterFood = document.getElementById("filter-Food");
let filterElectronics = document.getElementById("filter-Electronics");
let filterPersonalCare = document.getElementById("filter-Personal-Care");

//Search by title/founder

let searchBySelect = document.getElementById("search-by-select");
let searchByInput = document.getElementById("search-by-input");
let searchByButton = document.getElementById("search-by-button");


let pitchData = [];

fetchAndRenderData();

searchByButton.addEventListener("click", async(e)=>{
  // console.log(searchBySelect.value,searchByInput.value )
 if(searchBySelect.value !==""){
  console.log("HI", pitchData)
  let filterData = pitchData.filter((el)=>{
    return el[searchBySelect.value].toLowerCase().includes(searchByInput.value.toLowerCase())
  })
 getCards(filterData)
 }
})

function fetchAndRenderData() {
  fetch(pitchURL)
    .then((res) => res.json())
    .then((data) => {

     pitchData = data;
      getCards(pitchData);
    })
    .catch((err) => console.log(err));
}

function getCards(data) {
  mainSection.innerHTML = "";
  let cardList = document.createElement("div");
  cardList.setAttribute("class", "card-list");

  data.forEach((el, index) => {
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("data-id", `${el.id}`);

    let cardImage = document.createElement("div");
    cardImage.setAttribute("class", "card-img");
    let img = document.createElement("img");
    img.setAttribute("src", el.image);
    cardImage.append(img);

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    let title = document.createElement("h4");
    title.setAttribute("class", "card-title");
    title.innerText = el.title;

    let founder = document.createElement("p");
    founder.setAttribute("class", "card-founder");
    founder.innerText = `Founder : ${el.founder}`;

    let category = document.createElement("p");
    category.setAttribute("class", "card-category");
    category.innerText = el.category;

    let price = document.createElement("p");
    price.setAttribute("class", "card-price");
    price.innerText = el.price;

    let edit = document.createElement("a");
    edit.setAttribute("class", "card-link");
    edit.innerText = "Edit";
    edit.setAttribute("data-id", el.id);
    edit.addEventListener("click", (e) => {
      did = el.id;
      updatePitchTitleInput.value = el.title;
      updatePitchImageInput.value = el.image;
      updatePitchfounderInput.value = el.founder;
      updatePitchCategoryInput.value = el.category;
      updatePitchPriceInput.value = el.price;
    });

    let button = document.createElement("button");
    button.setAttribute("class", "card-button");
    button.innerText = "Delete";
    button.setAttribute("data-id", el.id);
    button.addEventListener("click", async (e) => {
      await fetch(`${pitchURL}/${el.id}`, {
        method: "DELETE",
      });
      fetchAndRenderData();
    });

    cardBody.append(title, founder, category, price, edit, button);

    card.append(cardImage, cardBody);

    cardList.append(card);

    mainSection.append(cardList);
  });
}

updatePitchBtn.addEventListener("click", async (e) => {

  if(updatePitchTitleInput.value!=="" || updatePitchImageInput.value !=="" || updatePitchfounderInput.value !=="" || updatePitchCategoryInput.value !=="" ||  updatePitchPriceInput.value!==''
  ){
    
    let obj = {
      title: updatePitchTitleInput.value,
      image: updatePitchImageInput.value,
      founder: updatePitchfounderInput.value,
      category: updatePitchCategoryInput.value,
      price: updatePitchPriceInput.value,
    };
  
    await fetch(`${pitchURL}/${did}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    fetchAndRenderData();
  }

});

updatePricePitchPriceButton.addEventListener("click", async (e) => {
  let obj = {
    id: updatePricePitchId.value,
    price: updatePricePitchPrice.value,
  };

  await fetch(`${pitchURL}/${updatePricePitchId.value}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  fetchAndRenderData();
});

pitchCreateBtn.addEventListener("click", async (e) => {
  let obj = {
    title: pitchTitleInput.value,
    image: pitchImageInput.value,
    founder: pitchfounderInput.value,
    category: pitchCategoryInput.value,
    price: pitchPriceInput.value,
  };

  await fetch(pitchURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  fetchAndRenderData();
});

sortAtoZBtn.addEventListener('click',(e)=>{
  let getData= pitchData.sort((a,b)=>{
    return a.price - b.price
  })
  getCards(getData);
})

sortZtoABtn.addEventListener('click',(e)=>{
  let getData= pitchData.sort((a,b)=>{
    return b.price - a.price
  })
  getCards(getData);
})


filterElectronics.addEventListener('click', (e)=>{
  // console.log(pitchData)
  let filterData = pitchData.filter((el)=>{
    return el.category=='Electronics'
  })
  // console.log(filterData)
  getCards(filterData)
})

filterFood.addEventListener('click', (e)=>{
  let filterData = pitchData.filter((el)=>{
    return el.category=='Food'
  })
  getCards(filterData)
})

filterPersonalCare.addEventListener('click', (e)=>{
  let filterData = pitchData.filter((el)=>{
    return el.category=='Personal Care'
  })

  getCards(filterData)
})

searchByButton.addEventListener('click', (e)=>{

})