//variables
const employeesUrl = "https://randomuser.me/api/?results=12";
const main = document.querySelector('.grid-container');
const searchBox = document.querySelector('#search-box');
const modalClose = document.querySelector('.modal-close');
const overlay = document.querySelector('.overlay');
const modalCard = getClassElm('modal-card');
const ovlayName = getClassElm('modal-card .name');
const ovlayPhone = getClassElm('phone');
const ovlayEmail = getClassElm('modal-card .email');
const ovlayAvatar = getClassElm('modal-card .avatar');
const ovlayAddress = getClassElm('address');
const ovlayDob = getClassElm('DoB');
const ovlayState = getClassElm('modal-card .state');
const btnNext = getClassElm('next');
const btnPrevious = getClassElm('previous');
let employeesResponse;
let cardTemplate; 


/* *************** helper functions   */
async function getData(url){
    return await fetch(url)
            .then(response => response.json())
            .then(json =>  {
                        employeesResponse = json.results;
                        cardTemplate = employeesResponse.map(employee => createCard(employee));
                        cardTemplate.forEach((element, index) => {
                            //console.log(element);
                            element.setAttribute("data-index", index);
                            main.appendChild(element);
                        });

                        // select all cards and add event listener to them to open modal window
                        // to select correct info search by email address
                        let cards = [...main.querySelectorAll('.card')];
                        
                        main.addEventListener('click', (e) => {
                                let target = e.target;
                                if(target !== main && target.classList.value.indexOf('modal') === -1 ){
                                //console.log(target);
                                let parentCard = target.closest('.card');
                                let index = parentCard.attributes['data-index'].value;
                                    index = parseInt(index);
                                    //console.log(index);
                                createModalCard(employeesResponse, index);
                                
                                displayElement(overlay);
                                }});

                                btnNext.addEventListener('click', ()=>{
                                    const modalContainer = document.querySelector('.modal-container');
                                    let currentModalIndex =  getIndex(modalContainer);
                                    //console.log(currentModalIndex);
                                    createModalCard(employeesResponse, currentModalIndex + 1);

                                });

                                btnPrevious.addEventListener('click', ()=>{
                                    const modalContainer = document.querySelector('.modal-container');
                                    let currentModalIndex =  getIndex(modalContainer);
                                    //console.log(currentModalIndex);
                                    createModalCard(employeesResponse, currentModalIndex -1);

                                });
                            })

     
            .catch(error => {
            console.log("there was a problem " + error);
            main.innerHTML = `
            <div class='error-message'>
            <h1>OOOOHPSSS something is wrogng</h1>
            <p>Please report to site admin</p>
            </div>
            `;
        });
            

    function createModalCard(arr,index) {
        let container = document.querySelector('.modal-container');
        let employee = arr[index];
        container.setAttribute("data-index", index);
        ovlayAvatar.src = employee.picture.medium ? employee.picture.medium : "img/universal-person-icon.png";
        ovlayName.innerHTML = `${employee.name.first} ${employee.name.last}`;
        ovlayPhone.innerHTML = employee.phone ? employee.phone : "";
        ovlayDob.innerHTML = 'Birthdate: ' + shortDate(employee.dob.date);
        ovlayEmail.innerHTML = employee.email;
        ovlayState.innerHTML = employee.location.state ? employee.location.state : "";
        ovlayAddress.innerHTML =
        `Address: ${employee.location.street.name} ${employee.location.street.number},
                                         ${employee.location.city}, ${employee.location.postcode}, ${employee.location.country}`;
         modalCard.classList.remove('hidden');  
         
        showHideNextBtn();
        showHidePreviousBtn();


         // ****************helper functions
                    function showHidePreviousBtn() {
                        if (index === 0) {
                            btnPrevious.classList.add('hidden');
                        } else {
                            btnPrevious.classList.remove('hidden');
                        }
                    }

                    function showHideNextBtn() {
                        if (index + 1 === arr.length) {
                            btnNext.classList.add('hidden');
                        } else {
                            btnNext.classList.remove('hidden');
                        }
                    }
         //********************************************** */           
                }
    }           
                
       function createCard(item){
           let card = createNewItem('div', ['card']);
           let avatar = createNewItem('img',['avatar']);
           let textBox = createNewItem('div', ['text-container'] );
                let name = createNewItem('h4', ['name']);
                let email = createNewItem('p', ['email']);
                let state = createNewItem('p', ['state']);
    
                
                avatar.src = item.picture.large;
                name.innerHTML = `${item.name.first} ${item.name.last}`;
                email.innerHTML= item.email;
                state.innerHTML = item.location.state;

                textBox.appendChild(name);
                textBox.appendChild(email);
                textBox.appendChild(state);
                          
                card.appendChild(avatar);
                card.appendChild(textBox);
                return card;

       }     
        


      function createNewItem(elementType, className){
          let item = document.createElement(elementType);
          item.classList.add(...className);
          return item;
      }
    
      function getClassElm(className){
          return document.querySelector(`.${className}`);
      }

      function shortDate(datelong){
          let longDate = new Date(datelong);
          return longDate.toLocaleDateString();
      }

      function hideElement(element){
          element.classList.add('hidden');
      }

      function displayElement(element){
          element.classList.remove('hidden');
      }

      function filterCardsByName() {
        let names = [...document.querySelectorAll('.name')]; //select all names in the dom
        let searchName = searchBox.value.toLowerCase();
    
        names.forEach(item => {
            let nameToSmall = item.innerText.toLowerCase();
            let card = item.parentElement.parentElement;
            //compare searchbox value with names => display/hide accordingly
            if (nameToSmall.indexOf(searchName) > -1) {
                displayElement(card);
            } else {
                hideElement(card);
            }
        });
    }

    //get index of an element
    function getIndex(element){
        let index = element.attributes['data-index'].value;
        return parseInt(index);
    }




//************code */

//get data and create card grid
getData(employeesUrl);
modalClose.addEventListener('click', () => hideElement(overlay) );

//on every keypress check the input against names and hide not matching cards
searchBox.addEventListener('keyup', filterCardsByName);


