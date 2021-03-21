//variables
const employeesUrl = "https://randomuser.me/api/?results=500";
const main = document.querySelector('.grid-container');
const modalClose = document.querySelector('.modal-close');
const overlay = document.querySelector('.overlay');
const ovlayName = getClassElm('modal-card .name');
const ovlayPhone = getClassElm('phone');
const ovlayEmail = getClassElm('modal-card .email');
const ovlayAvatar = getClassElm('modal-card .avatar');
const ovlayAddress = getClassElm('address');
const ovlayDob = getClassElm('DoB');
const ovlayState = getClassElm('modal-card .state');

let employeesResponse;
//let targetEmpoyee;
let cardTemplate; 
//let targetEmail;


/* *************** helper functions   */
async function getData(url){
    return await fetch(url)
            .then(response => response.json())
            .then(json =>  {
                        employeesResponse = json.results;
                        cardTemplate = employeesResponse.map(employee => createCard(employee));
                        cardTemplate.forEach(element => main.appendChild(element));

                        let cards = main.querySelectorAll('.card')
                            cards.forEach(item => item.addEventListener('click', (event) => {
                                  
                                let targetEmail = item.querySelector('.email').innerHTML;
                                
                                let targetEmployee = employeesResponse.reduce((acc, item ) => {
                                    if(item.email === targetEmail){
                                        return item;
                                    }
                                    return acc;
                                }, {});
                                console.log(targetEmployee);
                                ovlayAvatar.src = targetEmployee.picture.medium? targetEmployee.picture.medium : "img/universal-person-icon.png";
                                ovlayName.innerHTML = `${targetEmployee.name.first} ${targetEmployee.name.last}`
                                ovlayPhone.innerHTML = targetEmployee.phone? targetEmployee.phone : "";
                                ovlayDob.innerHTML = 'Birthdate: ' + shortDate(targetEmployee.dob.date);
                                ovlayEmail.innerHTML = targetEmail;
                                ovlayState.innerHTML = targetEmployee.location.state? targetEmployee.location.state: "";
                                ovlayAddress.innerHTML = 
                                        `Address ${targetEmployee.location.street.name} ${targetEmployee.location.street.number},
                                        ${targetEmployee.location.city}, ${targetEmployee.location.country}`;



                                overlay.classList.remove('hidden');
                                })
                            
                        );
        })
            
    }           
                
       function createCard(item){
           let card = createNewItem('div', 'card');
           let avatar = createNewItem('img','avatar');
           let textBox = createNewItem('div', 'text-container' );
                let name = createNewItem('h4', 'name');
                let email = createNewItem('p', 'email');
                let state = createNewItem('p', 'state');
    
                
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
          item.classList.add(className);
          return item
      }
    
      function getClassElm(className){
          return document.querySelector(`.${className}`);
      }

      function shortDate(datelong){
          let longDate = new Date(datelong);
          return longDate.toLocaleDateString();
      }

//************code */
getData(employeesUrl);
modalClose.addEventListener('click', (e) => {
                overlay.classList.add('hidden');
})
