const baseUrl =  "https://api.themoviedb.org/3/";
const API_KEY = "6ecb3c9eae671fa03e06b15bbda19db8";

var pageNumber = 1;
var movieNameInput;
var genreID;

// GET THE NAME OF MOVIE IF SEARCHED FROM NAVBAR
var params = new URLSearchParams(window.location.search);
const movieNameFromURL = params.get("moviename");
// console.log(movieNameFromURL);

var params = new URLSearchParams(window.location.search);
const genreIDFromURL = params.get("id");
// console.log(genreIDFromURL)


$("document").ready(function() {
    // if no name is passed get all movies
    if(!movieNameFromURL && !genreIDFromURL){
        fetchAllMovies(pageNumber);
    }
    // else get the name and pass it to url
    else{
        if(movieNameFromURL){
            movieNameInput = movieNameFromURL;
            $("#searchField").val(movieNameFromURL);
            $("#displayMovies").addClass("results-by-name");
            fetchMovieByName(pageNumber);
        }
        if(genreIDFromURL){
            genreID = genreIDFromURL;
            getMoviesByGenre(pageNumber);
        }
    }
})


$(".showMoreMoviesBtn").on("click", function(){
    pageNumber++;
    if($("#displayMovies").hasClass("results-by-name")){
        fetchMovieByName(pageNumber);
    }else{
        fetchAllMovies(pageNumber);
    }
});

async function fetchAllMovies(pageNo){
    let response = await fetch(baseUrl + 'movie/top_rated?api_key=' + API_KEY + '&page=' + pageNo);
    console.log(baseUrl + '?api_key=' + API_KEY + '&page=' + pageNo);

    if(response.status === 200){
        let data = await response.json();
        console.log(data.results);

        for(var i = 0; i < data.results.length; i++){
            $("#displayMovies").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4">
                    <div class="movie-card-wrapper p-2" id="${data.results[i].id}">
                        <div class="movie-image">
                            <img class="movie-poster" src="https://image.tmdb.org/t/p/original${data.results[i].backdrop_path}" alt="${data.results[i].title}">
                        </div>
                        <div class="movie-desc d-flex flex-column p-3 ps-0 pb-0">
                            <span class="movie-name viewDetailBtn">${data.results[i].title}</span>
                            <span class="text-secondary movie-rating mt-2"><i class="text-warning fa-solid fa-star me-2"></i>${data.results[i].vote_average}</span>
                            <span class="text-secondary movie-relase-date">Released ${formatDate(data.results[i].release_date)}</span>
                        </div>
                    </div>
                </div>`
            ); 
        }
    }
    $(".movie-poster").each(function() {  
        var nullImage = "https://image.tmdb.org/t/p/originalnull";  
        imgsrc = this.src;
        if(imgsrc === nullImage){
            $(this).parent().addClass("no-image");
            $(this).prop("src", "../images/no-image.jpg");
            $(this).prop("alt", "No Image to display");
        }
    }); 
}

async function fetchMovieByName(pageNo){
    var response = await fetch(baseUrl + 'search/movie?api_key=' + API_KEY + '&query=' + movieNameInput + '&page=' + pageNo);
    // console.log(baseUrl + 'search/movie?api_key=' + API_KEY + '&query=' + movieNameInput + '&page=' + pageNo);

    if(response.status === 200){
        let data = await response.json();
        console.log(data.results);

        for(var i = 0; i < data.results.length; i++){
            $("#displayMovies").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4">
                    <div class="movie-card-wrapper p-2" id="${data.results[i].id}">
                        <div class="movie-image">
                            <img class="movie-poster" src="https://image.tmdb.org/t/p/original${data.results[i].backdrop_path}" alt="${data.results[i].id}">
                        </div>
                        <div class="movie-desc d-flex flex-column p-3 ps-0 pb-0">
                            <span class="movie-name viewDetailBtn">${data.results[i].title}</span>
                            <span class="text-secondary movie-rating mt-2"><i class="text-warning fa-solid fa-star me-2"></i>${data.results[i].vote_average}</span>
                            <span class="text-secondary movie-relase-date">Released ${formatDate(data.results[i].release_date)}</span>
                        </div>
                    </div>
                </div>`
            );
        }
    }
    $(".movie-poster").each(function() {  
        var nullImage = "https://image.tmdb.org/t/p/originalnull";  
        imgsrc = this.src;
        if(imgsrc === nullImage){
            $(this).parent().addClass("no-image");
            $(this).prop("src", "../images/no-image.jpg");
            $(this).prop("alt", "No Image to display");
        }
    }); 
}

async function getMoviesByGenre(pageNo){
    var moviesByGenreURL = ("https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&with_genres=" + genreID + "&page=" + pageNo);
    let response = await fetch(moviesByGenreURL);
    // console.log(moviesByGenreURL);

    if(response.status === 200){
        var data = await response.json();
        console.log("GENRES")
        console.log(data.results);

        for(var i = 0; i < data.results.length; i++){
            $("#displayMovies").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4">
                    <div class="movie-card-wrapper p-2" id="${data.results[i].id}">
                        <div class="movie-image">
                            <img class="movie-poster" src="https://image.tmdb.org/t/p/original${data.results[i].backdrop_path}" alt="${data.results[i].id}">
                        </div>
                        <div class="movie-desc d-flex flex-column p-3 ps-0 pb-0">
                            <span class="movie-name viewDetailBtn">${data.results[i].title}</span>
                            <span class="text-secondary movie-rating mt-2"><i class="text-warning fa-solid fa-star me-2"></i>${data.results[i].vote_average}</span>
                            <span class="text-secondary movie-relase-date">Released ${formatDate(data.results[i].release_date)}</span>
                        </div>
                    </div>
                </div>`
            );
        }
    }
    $(".movie-poster").each(function() {  
        var nullImage = "https://image.tmdb.org/t/p/originalnull";  
        imgsrc = this.src;
        if(imgsrc === nullImage){
            $(this).parent().addClass("no-image");
            $(this).prop("src", "../images/no-image.jpg");
            $(this).prop("alt", "No Image to display");
        }
    });     
}


setTimeout(()=> {
    $(".showMoreMoviesBtn").removeClass("d-none");
}, 1000);


$("#searchFieldBtn").on("click", function(){
    movieNameInput = $("#searchField").val();
    $("#displayMovies").html("");
    $("#displayMovies").addClass("results-by-name");
    fetchMovieByName(pageNumber);
});
