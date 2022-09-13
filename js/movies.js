const baseUrl =  "https://api.themoviedb.org/3/";
const API_KEY = "6ecb3c9eae671fa03e06b15bbda19db8";

var pageNumber = 1;
var movieNameInput;
var genreID;

// GET THE NAME OF MOVIE IF SEARCHED FROM NAVBAR
var params = new URLSearchParams(window.location.search);
var movieNameFromURL = params.get("query");
// console.log(movieNameFromURL);

var params = new URLSearchParams(window.location.search);
const genreIDFromURL = params.get("id");
// console.log(genreIDFromURL)


$("document").ready(function() {
    // if no name is passed get all movies
    if(!movieNameFromURL && !genreIDFromURL){
        $("#displayMovies").removeClass("filter-by-genre");
        $("#listOfGenres").val("0");
        $("#displayMovies").removeClass("results-by-name");
        $("#displayMovies").addClass("allMovies");
        fetchAllMovies(pageNumber);
    }
    // else get the name and pass it to url
    else{
        if(movieNameFromURL){
            movieNameInput = movieNameFromURL;
            movieNameFromURL = movieNameFromURL.replaceAll("-", " ");
            $("#searchField").attr("placeholder", `Showing results for - "` + movieNameFromURL.toUpperCase() +`"`);
            $("#displayMovies").removeClass("filter-by-genre");
            $("#listOfGenres").val("0");
            $("#displayMovies").removeClass("allMovies");
            $("#displayMovies").addClass("results-by-name");
            fetchMovieByName(pageNumber);
        }
        if(genreIDFromURL){
            $("#displayMovies").removeClass("allMovies");
            $("#displayMovies").removeClass("results-by-name");
            $("#displayMovies").addClass("filter-by-genre");
            genreID = genreIDFromURL;
            $("#listOfGenres option[value='0']").removeAttr("selected");
            $("#listOfGenres option[value= "+ genreID +"]").attr('selected', 'selected');
            getMoviesByGenre(pageNumber);
        }
    }
});

$("#listOfGenres").on("change", function(){
    genreID = $("#listOfGenres").val();
    $("option").removeAttr("selected");
    $("option[value= "+ genreID +"]").attr('selected', 'selected');
    $("#searchField").val("");
    $("#displayMovies").html("");
    $("#displayMovies").removeClass("results-by-name");
    $("#displayMovies").removeClass("allMovies");
    $("#displayMovies").addClass("filter-by-genre");
    getMoviesByGenre(pageNumber);
});

$(".showMoreMoviesBtn").on("click", function(){
    if($("#displayMovies").hasClass("results-by-name")){
        pageNumber++;
        fetchMovieByName(pageNumber);
    }
    else if($("#displayMovies").hasClass("filter-by-genre")){
        pageNumber++;
        getMoviesByGenre(pageNumber);
    }
    else if($("#displayMovies").hasClass("allMovies")){
        pageNumber++;   
        fetchAllMovies(pageNumber);
    }
});


async function fetchAllMovies(pageNo){
    let response = await fetch(baseUrl + 'movie/top_rated?api_key=' + API_KEY + '&page=' + pageNo);
    // console.log(baseUrl + '?api_key=' + API_KEY + '&page=' + pageNo);

    if(response.status === 200){
        let data = await response.json();
        // console.log(data.results);

        checkIfNextPage(data);

        for(var i = 0; i < data.results.length; i++){
            $("#displayMovies").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4" id="${data.results[i].title}">
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
        console.log(data);

        if(data.results.length === 0){
            alert("Sorry cannot find " + movieNameInput);
        }

        checkIfNextPage(data);

        for(var i = 0; i < data.results.length; i++){
            $("#displayMovies").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4" id="${data.results[i].title}">
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
    if(genreID == 0){
        fetchAllMovies(pageNumber);
    }
    let response = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&with_genres=" + genreID + "&page=" + pageNo);

    if(response.status === 200){
        var data = await response.json();
        // console.log("GENRES")
        // console.log(data.results);

        checkIfNextPage(data)

        for(var i = 0; i < data.results.length; i++){
            $("#displayMovies").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4" id="${data.results[i].title}">
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

setTimeout(() => {
    $(".showMoreMoviesBtn").removeClass("d-none");
}, 1000);

$("#searchFieldBtn").on("click", function(){
    movieNameInput = $("#searchField").val();
    $("#searchField").attr("placeholder", " ");
    $("#displayMovies").html("");
    $("#displayMovies").removeClass("filter-by-genre");
    $("#listOfGenres").val("0");
    $("#displayMovies").removeClass("allMovies");
    $("#displayMovies").addClass("results-by-name");
    var query = movieNameInput.replaceAll(" ", '-')
    window.location = '../html/movies.html?query=' + query;
    fetchMovieByName(pageNumber);
});

$("#searchField").on('keypress',function(e) {
    if(e.which === 13) {
        movieNameInput = $("#searchField").val();
        $("#searchField").attr("placeholder", " ");
        $("#displayMovies").html("");
        $("#displayMovies").removeClass("filter-by-genre");
        $("#listOfGenres").val("0");
        $("#displayMovies").removeClass("allMovies");
        $("#displayMovies").addClass("results-by-name");
        window.location = '../html/movies.html?query=' + movieNameInput.replaceAll(' ', '-').toLowerCase();
    }
});
