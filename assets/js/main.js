'use strict';

let defaults = {
        per_page : 20,
        page: 1,
        catId: 206 
}
    
let api_url =`https://balkaninsight.com/wp-json/wp/v2/posts?page=1&_embed=1&categories=`;
let post_url = `https://balkaninsight.com/wp-json/wp/v2/posts?per_page=10&_embed=1`;

const loader = document.getElementById('loader');
let posts = document.getElementById('posts');
let article = document.getElementsByClassName(`.post__content`)
let btn_load = document.querySelector('button');
const categories = document.getElementsByClassName('categories__link');
const singlePost = document.getElementById('singlePost');
let singlePostContainer = document.getElementById("singlePost__container");


const renderPosts =  function(listOfPosts){
        let html = '';
        listOfPosts.forEach((post,i) => {
                
                let img = post._embedded[`wp:featuredmedia`][0].link;
                const date = post.date.split('T');  
          html += `
         <article class="post">
         <div class="post__content">
             <h2 class="post__title">${post.title.rendered}</h2>
             <a  class="post__link" href="/single.html?postId=${post.id}"><img class="post__img" src="${img}" alt="This is an image"> </img></a>  
             <p class="post__date">${date[0]}</p>
             <p class="post__description">${post.excerpt.rendered}</p>
         </div>
         </article>
         `;        
        })
        posts.insertAdjacentHTML('beforeend', html);
        btn_load.style.opacity= 1;      
 }


 const renderSinglePost = async function(article){
        console.log(`🔴 ${article}`);
        let html = '';article
        const date = article.date.split('T');
        console.log(article.link);
        let img = article._embedded[`wp:featuredmedia`][0].link;
        console.log(article);

         html = `
        <article class="post" id="singlePost">
        <div class="post__content">
            <h2 class="post__title">${article.id}</h2>
            <a  class="post__link" href=""><img class="post__img" src="${img}" alt="This is an image"></img></a>  
            <p class="post__date">${date[0]}</p>
            <p class="post__description">${article.content.rendered}</p>
        </div>
        </article>
        `
     
        singlePost.insertAdjacentHTML('beforeend', html);
}


//have to get the query param to send the postid
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
        // console.log(catID);
         try{
             const posts = await fetch(`https://balkaninsight.com/wp-json/wp/v2/posts?per_page=${per_page}&page=${page}&_embed=1&categories=${parseInt(catID)}`)
             const data = await posts.json()    
             renderPosts(data);
             hideLoad();
         }catch(err){
                console.error(`‼🔴${err}`);
         }
}


if(singlePost){
        fetchSinglePost(singlePostId);
}else{
        fetchPosts(5,1,206);
}

btn_load.addEventListener('click',  async function(e){
        showLoad();
        defaults.page++;
        fetchPosts(10,defaults.page,defaults.catID);
     })

function showLoad(){
  loader.classList.add('display');
}

function hideLoad(){
        loader.classList.remove('display');
}


function getPosts(val){
       posts.innerHTML = '';
       
       const newUrl = window.location.origin + `/?categories=${val}`;
       console.log(newUrl);

       history.pushState({}, null, newUrl);
        fetchPosts(10,1,val);
}










