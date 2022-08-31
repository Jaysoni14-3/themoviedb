const baseUrl = "https://api.themoviedb.org/3/movie/";
const API_KEY = "6ecb3c9eae671fa03e06b15bbda19db8";

const movieID = window.location.search.substring(1).substring(3);
var movieName;
// console.log(movieID);

$("document").ready(function(){
    getMovieDetails();
    getSimilarMovies();
    getCastDetails();
});

async function getMovieDetails() {
    
    let response = await fetch(baseUrl + movieID + '?api_key=' + API_KEY + '&language=en-US');

    if (response.status === 200) {
        let data = await response.json();
        console.log("MOVIE DETAILS");
        console.log(data);
        document.title = "Movie Details: "+ data.title;

        $("#nameOfMovie").text(data.title + "  ");

        var imagePath;
        if(data.belongs_to_collection){
            imagePath = data.belongs_to_collection.backdrop_path;
        }else{
            imagePath = data.backdrop_path;
        }

        $(".movie-details").prepend(
            `<div class="col-12 col-md-6">
                <img src="https://image.tmdb.org/t/p/original${imagePath}" alt=${data.title}>
            </div>
            
            <div class="col-12 col-md-6 px-3 mt-3 mt-md-0">
                <h1 id="movieName" class="text-white details-page-movie-name">${data.title}</h1>
                <div class="movie-descriptions mt-3">
                    <div class="movie-descriptions-top d-flex align-items-center mt-2">
                        <p class="adult">${data.adult? "18+" : "4+"}</p>
                        <p class="release-date">${getYear(data.release_date)}</p>
                        <p class="duration">${getTime(data.runtime)}</p>
                        <p class="genre detail-genre" role="button" id="${data.genres[0].id}">${data.genres[0].name}</p>
                    </div>
                    <div class="movie-descriptions-center">
                        <p class="ratings"><span class="detail-label">Ratings : </span> ${data.vote_average} / 10</p>
                        <div class="language d-flex"><span class="detail-label me-2">Language :</span><p class="language-spoken mb-0"></p></div>
                        <p class="overview mt-3"><span class="detail-label">overview : </span> ${data.overview}</p> 
                        <p class="released-status"><span class="detail-label">Released-status : </span> ${data.status}</p>
                        <div class="allGenres d-flex"><span class="detail-label me-2">Genres : </span><div id="allGenres"></div></div>
                    </div>
                </div>
            </div>`
        );

        if(data.runtime == 0){
            $(".duration").css("display", "none");
        }

        // GET ALL THE LANGUAGES SPOKEN IN THE MOVIE
        for(var i = 0; i < data.spoken_languages.length; i++){
            $(".language-spoken").append('<span class="me-3">'+data.spoken_languages[i].english_name+'</span>');
        }

        for(var i = 0; i < data.genres.length; i++){
            $("#allGenres").append('<span class="me-3 detail-label text-white">'+ data.genres[i].name +'</span>')
        }

    }
}

async function getCastDetails(){
    let response = await fetch(baseUrl + movieID + '/credits?api_key=' + API_KEY + '&language=en-US');

    if (response.status === 200) {
        let data = await response.json();
        // console.log("CAST DETAILS");
        // console.log(data);  

        // CAST
        for(var i = 0; i < data.cast.length; i++){
            $("#cast-names").append(`<p class="crew-cast-name col-6 col-sm-4 col-md-3 col-lg-2" role="button" id="${data.cast[i].original_name}">${data.cast[i].original_name}</p>`);
        }

        // CREW
        for(var i = 0; i < data.cast.length; i++){
            $("#crew-names").append(`<p class="crew-cast-name col-12 col-sm-6 col-md-4 col-lg-3" role="button" id="${data.crew[i].original_name}">${data.crew[i].original_name}<span class="text-secondary"> <br> - ${data.crew[i].job}</span></p>`);
        }

    }

}

async function getSimilarMovies(){
    let response = await fetch(baseUrl + movieID + '/recommendations?api_key=' + API_KEY + '&language=en-US');

    if (response.status === 200) {
        let data = await response.json();
        // console.log("SIMILAR MOVIES");
        // console.log(data);

        for(var i = 0; i < 4; i++){
            var imgPath = data.results[i].backdrop_path;

            $(".similar-movies").append(
                `<div class="col-12 col-md-4 col-lg-3 similar-movie-card py-2 mb-4">
                    <div class="similar-movie-card-wrapper m-2" id="${data.results[i].id}">
                        <div class="similar-movie-image">
                            <img class="similar-movie-poster" src="https://image.tmdb.org/t/p/original${imgPath}" alt="${data.results[i].title}">
                        </div>
                        <div class="similar-movie-desc pb-0">
                            <div class="d-flex flex-column">
                                <span class="text-white similar-movie-name">${data.results[i].title}</span>
                            </div>
                        </div>
                    </div>
                </div>`
            );

        }
    
    }
    $(".similar-movie-poster").each(function() {  
        var nullImage = "https://image.tmdb.org/t/p/originalnull";  
        imgsrc = this.src;
        if(imgsrc === nullImage){
            $(this).parent().parent().parent().addClass("d-none");
            $(this).prop("src", "../images/no-image.jpg");
        }
    }); 
}

$("#cast-tab").on("click", function(){
    $("#castOrCrew").text("Cast")
});
$("#crew-tab").on("click", function(){
    $("#castOrCrew").text("Crew")
});

$(document).on('click', '.crew-cast-name', function() { 
    var namevalue = $(this).attr("id");
    window.open("https://www.google.com/search?q="+ namevalue);
});

$(document).on('click', '.detail-genre', function() { 
    var genreID = $(".detail-genre").attr("id");
    window.location = 'movies.html?id=' + genreID;
});

$(document).on('click', '.similar-movie-card', function() { 
    var selectedMovieID = $(this).children().attr("id");
    window.location = 'details.html?id=' + selectedMovieID;
});

function getYear(releaseDate){
    var dateToFormat = new Date(releaseDate);
    var year = dateToFormat.getFullYear();
    return year;
}

function getTime(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    m = m < 10 ? '0' + m : m; 
    return h + 'h ' + m + 'm';
}