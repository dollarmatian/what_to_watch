document.addEventListener('DOMContentLoaded', function(){
    const movieDisplay = document.getElementById('movieCard')
    movieDisplay.style.display = "none"
    const watchlistDisplay = document.getElementById('watchlist-div')
    watchlistDisplay.style.display = 'none'
    const searchDisplay = document.getElementById('searchDisplay')
    searchDisplay.style.display = 'flex'
    // if (document.getElementById('view-watchlist') != null){
    const getWatchlistItem = document.getElementById('view-watchlist')
    // getWatchlistItem.style.display = 'none'
    getWatchlistItem.addEventListener('click',  ()=> getWatchlist())

// comments.forEach(comment => {
// console.log("element"+comment["user"])
// });
// document.getElementById('searchSelectionsSubmit').style.display = 'None'
const addItemComment = document.getElementById('addItemComment')
// addItemComment.style.display = 'none'
addItemComment.addEventListener('click', function () {
        netflixId = this.dataset.itemId
        commentBody = document.getElementById('itemComment').value
        document.getElementById('itemComment').value = ""
        console.log('triggered')
        fetch(`/addItemComment/${netflixId}`,{
            method: 'POST',
            body: JSON.stringify({
                body: commentBody
              })
            
          })
        //   getComments(netflixId)
          .then(response => response.json())
          .then(comments => getComments(comments))
        //   .then(comments =>
        // comments.forEach(comment => {
        // console.log("user"+comment.user+"comment"+comment.comment+comment.timestamp)
        // })) 

        // .then(body => console.log(body.comments))
        // let comments = [{comment:"dude", user:"nate"}, {comment:"try", user:"dog"}]
        // console.log(comments)
})


const addWatchlistItem = document.getElementById('addWatchlistItem')
addWatchlistItem.addEventListener('click', function () {watchlistRequest(this)})


const ratingsSearchItem = document.getElementById('ratingsSearch')
const ratingSearchValue = document.getElementById('ratingSearchValue')
ratingSearchValue.innerHTML = ratingsSearchItem.value
ratingsSearchItem.addEventListener('change',()=>{
    console.log(ratingsSearchItem.value)
    ratingSearchValue.innerHTML = ratingsSearchItem.value
})
const releasedSearchItem = document.getElementById('releasedSearch')
const releasedSearchValue = document.getElementById('releasedSearchValue')
releasedSearchValue.innerHTML = releasedSearchItem.value
releasedSearchItem.addEventListener('change',()=>{
    releasedSearchValue.innerHTML = releasedSearchItem.value
})

// Start Random Search based on settings
document.getElementById('searchSelectionsSubmit').addEventListener('click',(evt)=>{
    evt.preventDefault()
    console.log("searched")

    // get values of elements in form
    const country = document.getElementById('countryCodeSearch').value;
    const type = document.getElementById('typeSearch').value;
    const genre = document.getElementById('genreSearch').value;
    const ratings = document.getElementById('ratingsSearch').value;
    const released = document.getElementById('releasedSearch').value;
    const endYear = 2020
    const ratingHigh = 10
    let page = 1
    let searchItem = []

    console.log(country,type,genre,ratings,released)

    let genreCodeSearch = '0'

    if (type == 'Series'){
        if (genre == '801362'){
            genreCodeSearch = '10673'
        }
        else if(genre == '6548'){
            genreCodeSearch = '10375'
        }
        else if (genre == '5763' ){
            genreCodeSearch = '11714'
                    }
        else if(genre == '108533'){
            genreCodeSearch = '1372'
        }
        else if(genre == '8933'){
            genreCodeSearch = '89811'
        }
    }

    let baseQuery = `https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=-!${released}%2C${endYear}-!0%2C5-!${ratings}%2C${ratingHigh}-!${genreCodeSearch}-!${type}-!Any-!Any-!gt100-!%7Bdownloadable%7D&t=ns&cl=${country}&st=adv&ob=Date&p=${page}&sa=and`

    fetch(`${baseQuery}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
      "x-rapidapi-key": rapid_api_key
    }
  })

  .then(res => res.json())
  .then(result => { 
      page = Math.round(Math.random()*Math.floor(result.COUNT / 100))
      baseQuery = `https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=-!${released}%2C${endYear}-!0%2C5-!${ratings}%2C${ratingHigh}-!${genreCodeSearch}-!${type}-!Any-!Any-!gt100-!%7Bdownloadable%7D&t=ns&cl=${country}&st=adv&ob=Date&p=${page}&sa=and`
      fetch(`${baseQuery}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
          "x-rapidapi-key": rapid_api_key
        }
      })
      .then(res => res.json())
      .then(result => {
          searchItem = result.ITEMS[Math.round(Math.random() * result.ITEMS.length)]
          console.log(searchItem)
          storeItem(searchItem)
        // getComments(searchItem.netflixid)
        displayItem(searchItem)
          

      })
      .catch(err => {
        console.log(err);
      });
  })
  
  .catch(err => {
    console.log(err);
  });


} )



})

{/* <option selected value="0">Any</option>
<option value={movieSeries === 'Movie'?'801362':'10673'}>Action</option>
<option value={movieSeries === 'Movie'?'6548':'10375'}>Comedy</option>
<option value={movieSeries === 'Movie'?'5763':'11714'}>Drama</option>
<option value={movieSeries === 'Movie'?'108533':'1372'}>Sci-Fi</option>
<option value={movieSeries === 'Movie'?'8933':'89811'}>Thriller</option> */}

function storeItem(item) {
    // console.log(item)
    netflixId = item.netflixid
    fetch(`/addItem/${netflixId}`,{
        method: 'POST',
        body: JSON.stringify({
          body: item
        })
      })
      .then(response => response.json())
      .then(result => {
          getComments(result.comments)
          const isOnWatchlist = document.getElementById('addWatchlistItem') 
          console.log("WACHLISTED?"+result.isWatchlisted)
          isOnWatchlist.dataset.isWatchlisted = result.isWatchlisted
        //   displayItem(searchItem)
        }
        )
// .then(data => {
//     console.log(data)
    // isWatchlisted = res.data
    // console.log(isWatchlisted)
 
    // })
}

function getComments(comments){
    const user_id = JSON.parse(document.getElementById('user_id').textContent);
    

    const commentListDiv = document.getElementById('commentListDiv')
    commentListDiv.innerHTML = ``
    // fetch(`/getItemComments/${item}`, {
    //     "method": "GET",
    //      })
    // .then(response => response.json())
    // .then(data => console.log(data))

   comments.forEach(comment => {
        const li = document.createElement("LI")
        li.setAttribute("id", `comment-${comment.id}`)
        let deleteButton = ``
        if (comment.user_id == user_id){
            deleteButton = `<button onClick="deleteComment(${comment.id})" >Delete</button>`
        }

        li.innerHTML = `<div>${comment.user} | ${comment.timestamp}  ${deleteButton}</div><p>${comment.comment}</p>`

        commentListDiv.append(li)
    })

    // console.log("user"+comment.user+"comment"+comment.comment+comment.timestamp)
}

//display movie item from search or watchlist click
function displayItem(item){
   
    itemDiv = `<div>
    <div><img  src="${item.image}"></div>
    <div>
        <h2>${item.title}</h2>
        <h3>${item.released}</h3>
        <h4>${item.runtime}</h4>
        <h4>IMDB Rating: ${item.rating}</h4>
       
    </div>
    <div>
        <p>${item.synopsis}</p>
    </div>

    </div>`

    document.getElementById('addWatchlistItem').dataset.itemId = netflixId
    document.getElementById('addItemComment').dataset.itemId = netflixId
    document.getElementById('watchNow').href = `https://www.netflix.com/watch/${netflixId}`
    document.getElementById('movieView').innerHTML = itemDiv
    document.getElementById('itemComment').value = ""
    const movieDisplay = document.getElementById('movieCard')
const watchlistDisplay = document.getElementById('watchlist-div')
const searchDisplay = document.getElementById('searchDisplay')
    movieDisplay.style.display = "flex"
    watchlistDisplay.style.display = 'none'
    searchDisplay.style.display = 'none'
}

function deleteComment(item){
    document.getElementById(`comment-${item}`).style.display = "none"
    fetch(`/addItemComment/${item}`, {
        "method": "DELETE",
         })
  
}

function watchlistRequest (element){
    let isWatchlisted = element.dataset.isWatchlisted
    const netflixId = element.dataset.itemId
  console.log(isWatchlisted)
    if (isWatchlisted == 'true'){
        fetch(`/addWatchlistItem/${netflixId}`,{
            method: 'DELETE',
            
          })
          const confirmDelete = `Add to Watchlist`
        element.textContent = confirmDelete
        console.log('deleted!')
        isWatchlisted = false
    } else {

    fetch(`/addWatchlistItem/${netflixId}`,{
        method: 'PUT',
        
      })
      console.log('added!')
      isWatchlisted = true
      const confirmAdd = `Remove from Watchlist`
    element.textContent = confirmAdd
    } 

}

function getWatchlist(){
    const user_id = JSON.parse(document.getElementById('user_id').textContent);
    const watchlistDiv = document.getElementById('watchlist-div')
    watchlistDiv.innerHTML = ``
    fetch(`/viewWatchlist/${user_id}`)
    .then(response=>   response.json())
    .then(watchlist => watchlist.forEach(item => 
        // {console.log(item)
    {
        const li = document.createElement("LI")
        li.setAttribute("id", `watchlistItem-${item.netflixId}`)
        li.setAttribute("class", `watchlistItem`)
      
        // let deleteButton = ``
        // if (comment.user_id == user_id){
            //     deleteButton = `<button onClick="deleteComment(${comment.id})" >Delete</button>`
            // }
            // ${deleteButton}
            const hello = 'hello'
            li.innerHTML = `
            <div><img src="${item.image}">
            </div >
            <div class="item-data">
            <div class="item-headers">
            <div><a class="nav-link" href="#" onclick="getItem(${item.id})"><h4>${item.title}</h4></a>
            <h5>${item.release_year}</h5>
            </div>
            <div>    
                <h5>${item.runtime}</h5>
                <h5>IMDB Rating: ${item.imdb_rating}</h5>
              </div>
              </div>
              <div>
                <p>${item.description}</p>
              </div>
              <div class="buttons">
              <a target="_blank" href="https://www.netflix.com/watch/${item.netflixId}" data-itemId="${item.netflixId}" class="watchNow"><button>Watch Now</button></a> 
              
              <button data-itemId="${item.netflixId}" onClick="watchlistListRemove(this)"
      
                 
                 data-isWatchlisted="true" class="addWatchlistItem">
              Remove from WatchList
              </button>
          
              </div>
            </div>
            `
            // this.dataset.item-id
            // {
                // document.getElementById('watchlistItem-${item.netflixId}').style.display = "none" ;
            //     
            //     watchlistRequest(this)
            // }
            watchlistDiv.append(li)
        }))
        const movieDisplay = document.getElementById('movieCard')
        const watchlistDisplay = document.getElementById('watchlist-div')
        const searchDisplay = document.getElementById('searchDisplay')  
        // const searchDisplay = document.getElementById('searchSelectionsForm')  
        movieDisplay.style.display = "none"
        watchlistDisplay.style.display = 'flex'
        searchDisplay.style.display = "none"
        // searchDisplay.setAttribute('class', 'watchlistSearchBar')
        // searchDisplay.style.flexDirection = 'row'
        // searchDisplay.style.width = '100vw'
}

function watchlistListRemove (element){
                document.getElementById(`watchlistItem-${element.dataset.itemid}`).style.display = "none" ;
                element.dataset = {
                    "isWatchlisted": "true",
                    "itemId": element.dataset.itemid
                }
                watchlistRequest(element)
}

function getItem(itemId){
    fetch(`/getItem/${itemId}`)
    .then(response =>response.json())
    .then(item => {

        displayListItem(item.item)
        getComments(item.comments)
    })
}

function displayListItem(item){
    itemDiv = `<div>
    <div><img src="${item.image}"></div>
    <div>
        <h2>${item.title}</h2>
        <h3>${item.release_year}</h3>
        <h4>${item.runtime}</h4>
        <h4>IMDB Rating: ${item.imdb_rating}</h4>
       
    </div>
    <div>
        <p>${item.description}</p>
    </div>
    
    </div>`

    const watchlistButton = document.getElementById('addWatchlistItem')
    watchlistButton.dataset.itemId = item.netflixId
    watchlistButton.dataset.isWatchlisted = true
    watchlistButton.textContent = 'Remove from Watchlist'
    document.getElementById('addItemComment').dataset.itemId = item.netflixId
    document.getElementById('watchNow').href = `https://www.netflix.com/watch/${item.netflixId}`
    document.getElementById('movieView').innerHTML = itemDiv
   
    const movieDisplay = document.getElementById('movieCard')
const watchlistDisplay = document.getElementById('watchlist-div')
const searchDisplay = document.getElementById('searchDisplay')  
    movieDisplay.style.display = "flex"
    watchlistDisplay.style.display = 'none'
    searchDisplay.style.display = 'none'
    
}



