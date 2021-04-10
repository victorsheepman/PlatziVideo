console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

$.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function(data) {
    console.log(data);
  }
});
      



//funcion asincrona principal
(async function  load(){
  


  //funcion asincrona que devuelve la respuesta y la convierte en  json
  async function getData(url){
    const response = await fetch(url);
    const data = await response.json();
    if(data.data.movie_count>0){
      return data;
    }else{
      throw new Error('titulo no encontrado');
    }
  
   
  }
  async function getUser(url){
    const response = await fetch(url);
    const data = await response.json();
      return data;

  }
  const $featuringContainer = document.querySelector('#featuring')
  $featuringContainer.style.display='none';

  async function cacheExit(element, category){
    
    const cacheList=window.localStorage.getItem(element);

    if(cacheList){
      return JSON.parse(cacheList)
    }else{
      const element=await getData(`https://yts.mx/api/v2/list_movies.json?genre=${category}`);
      window.localStorage.setItem(element,JSON.stringify(element));
      return element;
    }

  }

  //se agrega los generos
 // const actionList=await getData('https://yts.mx/api/v2/list_movies.json?genre=action');
  const actionList= await cacheExit('actionList','action');
  const dramaList=await getData('https://yts.mx/api/v2/list_movies.json?genre=drama');
  const animationList=await getData('https://yts.mx/api/v2/list_movies.json?genre=animation');

  const users=await getUser('https://randomuser.me/api/');
  const user2=await getUser('https://randomuser.me/api/');
  const user3=await getUser('https://randomuser.me/api/');



  console.log(actionList);
  console.log(dramaList);
  console.log(animationList);

  const $home = document.getElementById('home')
  const $actionContainer = document.querySelector('#action')
  const $dramaContainer = document.querySelector('#drama')
  const $animationContainer = document.querySelector('#animation')
  
 
  
        $home.classList.remove('search-active')

  
  const $form = document.getElementById('form')
 
  //$featuringContainer.style.display='none';
   debugger

  function setAtributes($element, attributes){
    for(const attribute in attributes){
      $element.setAttribute(attribute, attributes[attribute]);
    }

  }
  
  
  function featuringTemplate(peli){
    return(
      `<div class="featuring">
      <div class="featuring-image">
        <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${peli.title}</p>
      </div>
      <button class="featuring-btn" id="featuring-btn-id">Exit</button>
    </div>` )

  }

  function addEventClick_btn($element,$event){
      $element.addEventListener('click',()=>{
        $event.style.display='none';
      })
  }
  
 

  $form.addEventListener('submit', async(event)=>{
    event.preventDefault();
    try{
        
        
      
      
      setTimeout(() => {
        $home.classList.add('search-active');
        $featuringContainer.style.display='grid';
      },4000);  
     

    const $louder=document.createElement('img');
    
    setAtributes($louder,{
      src:'src/images/loader.gif',
      height:50,
      width:50,
    })

    $featuringContainer.append($louder)
    const data=new FormData($form);
    const peli= await getData(`https://yts.mx/api/v2/list_movies.json?limit=1&query_term=${data.get('name')}`)
    
     const HTMLString=featuringTemplate(peli.data.movies[0]);

    $featuringContainer.innerHTML=HTMLString;

    const $buttom=document.getElementById('featuring-btn-id');
        debugger
        $buttom.addEventListener('click',()=>{
          $featuringContainer.style.display='none';
          $home.classList.remove('search-active');
        })
    }catch(error){
      $home.classList.remove('search-active');
      swal(error.message);
    }
    

  })

  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal')
  const $modal = document.getElementById('modal')
  const $playlistfriends=document.getElementById('playlistFriends');
  const $hideuser=document.getElementById('hide-modal-user')
  const $hideSidebar=document.getElementById('hide-sidebar')
  const $sidebar=document.getElementById('sidebar')
  const $home_btn=document.getElementById('open-sidebar')
  $home_btn.style.display='none';

  $hideuser.addEventListener('click',()=>{
    $overlay.classList.remove('active');
    $modal__user.style.animation='modalOut .8s forwards';

  })
  $hideModal.addEventListener('click', () =>{
    $overlay.classList.remove('active');
    $modal.style.animation='modalOut .8s forwards';
    
  })


  const $modalTittle = $modal.querySelector('h1')
  const $modalImage = $modal.querySelector('img')
  const $modalDescription = $modal.querySelector('p')

  const $modal__user=document.getElementById('modal__user')
  const $modalName=$modal__user.querySelector('h1')
  const $modalIcon=$modal__user.querySelector('img')


  function findbyid(list,id){
    return list.find(movie=>movie.id===parseInt(id,10));
  }

  function findbymovie(id,category){
    switch(category){
      case 'action':{
        return findbyid(actionList.data.movies,id); 
      }
        
      case 'drama':{
        return findbyid(dramaList.data.movies,id);
      }
        
      default:{
        return findbyid(animationList.data.movies,id);
      }
        
    }
  }

  function showModal($element){
   $overlay.classList.add('active');
   $modal.style.animation ='modalIn .8s forwards'
   const id=$element.dataset.id;
   const category=$element.dataset.category;
   const data=findbymovie(id, category);
   $modalTittle.textContent=data.title;
   $modalImage.setAttribute('src', data.medium_cover_image);
   $modalDescription.textContent=data.description_full;

  }

 

  function showModalUser($element){
    $overlay.classList.add('active')
    $modal__user.style.animation ='modalIn .8s forwards'
     $modalName.textContent=$element.results[0].name.first
    $modalIcon.setAttribute('src',$element.results[0].picture.thumbnail)
  }

function MovieTemplate(movie, category){
   return( 
     `<div class="primaryPlaylistItem" data-id='${movie.id}' data-category=${category}>
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
         </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`)
  }

  function addEventClick($element){
    $element.addEventListener('click', function event(){
      //alert('click')
      showModal($element);
    })
  }

  function addEventClickUser($element){
    $element.addEventListener('click', function event(){
      //alert('click')
      showModalUser($element);
    })
  }

  function MovieList(list, container, category){
    //remuevo la imagend de carga
    container.children[0].remove()
    list.data.movies.forEach((movie) => {
      //contengo en una constante mi templamte con las peliculas del genero seleccionado
    const HTMLString=MovieTemplate(movie, category)
    //implemento un documento html
    const html=document.implementation.createHTMLDocument();
    //le agrego el template a ese documento html
     html.body.innerHTML = HTMLString;
    console.log(HTMLString)
    const movie_template=html.body.children[0];
    //sustituyo en los contenedores de los generos los templamte hechos en javascript
    container.append(movie_template);
    const image=movie_template.querySelector('img')
    image.addEventListener('load',(event)=>{
      image.classList.add('fadeIn');
    })
    addEventClick(movie_template)
    
  });
  }
function cerrar(){
  $home.classList.remove('home')
  $home.classList.add('cerrar')
  $sidebar.style.display='none';
  $home_btn.style.display='unset';

}

function open(){
    $home_btn.style.display='none';
    $sidebar.style.display='block';
    $home.classList.add('home')
    $home.classList.remove('cerrar')
}

$home_btn.addEventListener('click',()=>{
  open()
})

$hideSidebar.addEventListener('click',()=>{
  cerrar()

})
  
  MovieList(actionList,$actionContainer,'action');
  MovieList(dramaList, $dramaContainer,'drama');
  MovieList(animationList, $animationContainer,'animation');
  console.log(users);

  function UserTemplate(user){
    return(
      `<li class="playlistFriends-item" id='${user.results[0].id.value}'>
      <a href="#">
        <img src="${user.results[0].picture.thumbnail}" alt="echame la culpa" />
        <span>
          ${user.results[0].name.first}
        </span>
      </a>
    </li>`)
  }
 function UserList(user){
 
   const HTMLString=UserTemplate(user);
   const html=document.implementation.createHTMLDocument();
   html.body.innerHTML=HTMLString;
   const user_template=html.body.children[0];
   $playlistfriends.append(user_template);
   //addEventClickUser(user_template);
   const id=document.getElementById(user.results[0].id.value)
   id.addEventListener('click',()=>{
    showModalUser(user)
   })
 }

 UserList(users);
 UserList(user2);
 UserList(user3);

})()




