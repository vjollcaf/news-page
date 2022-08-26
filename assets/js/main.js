'use strict';
let defaults = {
        per_page : 40,
        page: 1,
        catId: 206 
}
let api_url =`https://balkaninsight.com/wp-json/wp/v2/posts?page=1&_embed=1&categories=`;
let post_url = `https://balkaninsight.com/wp-json/wp/v2/posts`;

const loader = document.getElementById('loader');
let posts = document.getElementById('posts');
let article = document.getElementsByClassName(`.post__content`)
let btn_load = document.querySelector('button');
const singlePost = document.getElementById('singlePost');
let singlePostContainer = document.getElementById("singlePost__container");

const renderPosts =  function(listOfPosts){ 
        hideButtonLoad()
        let html = '';
        listOfPosts.forEach((post,i) => {   
                let img = post._embedded[`wp:featuredmedia`]?.[0]?.link || '' ;
                const date = post.date.split('T');  
          html += `
         <article class="post">
         <div class="post__content">
             <div>
             <h2 class="post__title">${post.title.rendered}</h2>
             <a  class="post__link" href="/single.html?postId=${post.id}"><img class="post__img" src="${img}" alt="This is an image"> </img></a>  
             <p class="post__date">${date[0]}</p>
             <p class="post__description">${post.excerpt.rendered}</p>
             </div>
         </div>
         </article>
         `;        
        })
        posts.insertAdjacentHTML('beforeend', html);
        btn_load.style.visibility= 'visibile';     
 }

 const renderSinglePost = async function(article){
        let html = '';
        const date = article.date.split('T');
        let img = article._embedded["wp:featuredmedia"][0].link;

         html = `
        <article class="post" id="singlePost">
                <div class="post__content">
                        <h2 class="post__title">${article.id}</h2>
                        <img class="post__img" src="${img}" alt="This is an image"></img>
                        <p class="post__date">${date[0]}</p>
                        <p class="post__description">${article.content.rendered}</p>
                </div>
        </article>
        `
        singlePost.insertAdjacentHTML('beforeend', html);
}


let singlePostId = window.location.search.split('?postId=').join('')

const fetchSinglePost = async function(singlePostId){
        try{
        const singlePost = await fetch(`https://balkaninsight.com/wp-json/wp/v2/posts/${singlePostId}?_embed=1 `)
        const postData = await singlePost.json();
        
         renderSinglePost(postData);
        }catch(err){
                console.error(err);
        }
}
const fetchPosts = async function(per_page = defaults.per_page, page = defaults.page, catID = defaults.catId){   
        showLoad();
         try{
             const posts = await fetch(`${post_url}?per_page=${per_page}&page=${page}&_embed=1&categories=${catID}`)
             const data = await posts.json() 
             renderPosts(data);
             showButtonLoad();
             hideLoad();
         }catch(err){
                console.error(`‼🔴${err}`);
         }
}
if(singlePost){
        hideButtonLoad();
        fetchSinglePost(singlePostId);
}else{
        fetchPosts(40,1,206);
}

btn_load.addEventListener('click',  async function(e){
        showLoad();
        defaults.page++;
        

        fetchPosts(defaults.per_page,defaults.page ,defaults.catId);
        hideButtonLoad();
        
     })

function showLoad(){
  loader.classList.add('display');
}
function hideLoad(){
        loader.classList.remove('display');
}

function showButtonLoad(){
   btn_load.classList.add('display');
}
function hideButtonLoad(){
        btn_load.classList.remove('display');
     }
     

function getPosts(countryID){
       defaults.page = 1;
       defaults.catId = countryID;
       showLoad()
       hideButtonLoad();
       if(posts){
         posts.innerHTML = '';
        }

       fetchPosts(defaults.per_page, defaults.page,countryID);

}

