'use strict';
let defaults = {
        baseUrl: `https://balkaninsight.com/wp-json/wp/v2/posts?`,
        per_page : 10,
        page: 1,
        catId: 206 
}
let api_url =`https://balkaninsight.com/wp-json/wp/v2/posts?page=1&_embed=1&categories=`;
// let post_url = `https://balkaninsight.com/wp-json/wp/v2/posts?per_page=10&_embed=1`;

const loader = document.getElementById('loader');
let posts = document.getElementById('posts');
let article = document.getElementsByClassName(`.post__content`)
let btn_load = document.querySelector('button');
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
        btn_load.style.opacity= 1;      
 }


 const renderSinglePost = async function(article){
        let html = '';
        console.log(article);
        const date = article.date.split('T');
        let img = article._embedded["wp:featuredmedia"][0].link;


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



let singlePostId = window.location.search.split('?postId=').join('')

const fetchSinglePost = async function(singlePostId){
        try{
        const singlePost = await fetch(`${defaults.baseUrl}${singlePostId}?_embed=1 `)
        const postData = await singlePost.json();
         renderSinglePost(postData);
        }catch(err){
                console.error(err);
        }
}
const fetchPosts = async function(per_page = defaults.per_page, page = defaults.page, catID = defaults.catId){   
        showLoad();
         try{
               
             const posts = await fetch(`https://balkaninsight.com/wp-json/wp/v2/posts/?per_page=${per_page}&page=${page}&_embed=1&categories=${parseInt(catID)}`)
             const data = await posts.json()  
             let currentUrll = window.location.href;
             getURLParams(currentUrll);
             renderPosts(data);
             hideLoad();
         }catch(err){
                console.error(`‼🔴${err}`);
         }
}


if(singlePost){
        fetchSinglePost(singlePostId);
}else{
        const per_pageCheck = window.location;
        const url = window.location.href;
        const newUrl = window.location.origin + `/?per_page=${defaults.per_page}&page=${defaults.page}&_embed=1&categories=${defaults.catId}`;
        history.pushState({}, null, newUrl);

        fetchPosts(5,1,206);
}

btn_load.addEventListener('click',  async function(e){
        showLoad();
        defaults.page++;
        fetchPosts(10,defaults.page,defaults.catId);
        
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
       history.pushState({}, null, newUrl);
        fetchPosts(10,1,val);
}

function update_query_parameters(per_page,page,catID) {
       let url = window.location.href;
        url = window.location.href
           .replace(RegExp("([?&]"+per_page+"(?=[=&#]|$)[^#&]*|(?=#|$))"), "&"+page+"="+encodeURIComponent(catID))
           .replace(/^([^?&]+)&/, "$1?");
        return url;
     }


//const url = new URL(window.location);
// window.history.pushState({}, '', url);




//      const myKeysValues = window.location.search;
//      const urlParams = new URLSearchParams(myKeysValues);

//      const per__pageKey = urlParams.get('per_page');
//      const pageKey = urlParams.get('page');
//      const catIdKey = urlParams.get('categories');


// update_query_parameters(per__pageKey,pageKey,catIdKey);
const getURLParams = function(currentUrll){
        let getCurrentUrl = window.location.search;
        const urlParams = new URLSearchParams(getCurrentUrl);

        const per__pageKey = urlParams.get('per_page');
        const pageKey = urlParams.get('page');
        const catIdKey = urlParams.get('categories');
        console.log(per__pageKey);
        console.log(pageKey);
        console.log();
}





///////////// just testing
function updateParams(per_page,page,catId){
        const url  = new URL(window.location);
        
        const updatedUrl = `/?per_page=${per_page}&page=${page}&_embed=1&categories=${catId}`
        window.history.pushState({}, '', updatedUrl);

}

updateParams(20,3,211);
