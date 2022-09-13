const baseUrl = "https://api.themoviedb.org/3/movie/";
const API_KEY = "6ecb3c9eae671fa03e06b15bbda19db8";


var movieID = localStorage.getItem("MovieId");

// const movieID = window.location.search.substring(1).substring(3);
var movieName;

$("document").ready(function(){
    getMovieDetails();
    getSimilarMovies();
    getCastDetails();
    getTrailer();
    getAllImages();
});

async function getMovieDetails(){
    
    let response = await fetch(baseUrl + movieID + '?api_key=' + API_KEY + '&language=en-US');
    // console.log(baseUrl + movieID + '?api_key=' + API_KEY + '&language=en-US');

    if (response.status === 200) {
        let data = await response.json();
        // console.log("MOVIE DETAILS");
        console.log(data);

        document.title = "Movie Details: "+ data.title;
        $("#nameOfMovie").text(data.title + "  ");

        var imagePath;
        if(data.belongs_to_collection){
            imagePath = data.belongs_to_collection.backdrop_path;
        }else{
            imagePath = data.backdrop_path;
        }

        if(imagePath == null){
            imagePath = data.backdrop_path;
        }

        $(".movie-details").prepend(
            `<div class="col-12 col-md-12 col-lg-6" id="${movieID}">
                <div class="movie-detail-image">
                    <img src="https://image.tmdb.org/t/p/original${imagePath}" alt=${data.title}>
                </div>
            </div>

            <div class="col-12 col-md-12 col-lg-6 px-3 mt-3 mt-md-0">
                <h1 id="movieName" class="text-white text-center text-sm-start details-page-movie-name">${data.title}</h1>
                <div class="movie-descriptions mt-3">
                    <div class="movie-descriptions-top d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start mt-2">
                        <p class="adult">${data.adult? "18+" : "4+"}</p>
                        <p class="release-date">${getYear(data.release_date)}</p>
                        <p class="duration">${getTime(data.runtime)}</p>
                        <p class="genre detail-genre text-decoration-underline" role="button" id="${data.genres[0].id}">${data.genres[0].name}</p>
                        <p class="trailer detail-trailer text-decoration-underline" role="button" id="watchTrailer">Trailer</p>
                    </div>
                    <div class="movie-descriptions-center">
                        <p class="ratings"><span class="detail-label">Ratings : </span> ${data.vote_average} / 10</p>
                        <div class="language d-flex flex-wrap"><span class="detail-label">Language : </span><p class="language-spoken mb-0 ms-1"></p></div>
                        <p class="overview mt-3"><span class="detail-label">overview : </span> ${data.overview}</p> 
                        <p class="released-status"><span class="detail-label">Released-status : </span> ${data.status}</p>
                        <div class="allGenres d-flex flex-wrap"><span class="detail-label">Genres : </span><div class="ms-1" id="allGenres"></div></div>
                    </div>
                </div>
            </div>`
        );
        $(".movie-details-outer").css("background-image", "url(https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces"+ imagePath +")");

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

        if(data.cast == ""){
            $(".crew-cast-tab-wrapper .tab-content").text("Cannot find Cast names in our database");
        }
        if(data.crew == ""){
            $(".crew-cast-tab-wrapper .tab-content").text("Cannot find Crew names in our database");
        }

    }

}

async function getSimilarMovies(){
    let response = await fetch(baseUrl + movieID + '/recommendations?api_key=' + API_KEY + '&language=en-US&page=1');

    if (response.status === 200) {
        let data = await response.json();
        // console.log("SIMILAR MOVIES");
        // console.log(data);

        if(data.results.length === 0){
            $(".similar-movies").css("display", "none");
        }

        for(var i = 0; i < 4; i++){

            var imagePath;
            if(data.belongs_to_collection){
                imagePath = data.results[i].belongs_to_collection.backdrop_path;
            }else{
                imagePath = data.results[i].backdrop_path;
            }

            if(imagePath == null){
                imagePath = data.results[i].backdrop_path;
            }

            $(".similar-movies").append(
                `<div class="col-12 col-md-4 col-lg-3 similar-movie-card py-2 mb-4" id="${data.results[i].title}">
                    <div class="similar-movie-card-wrapper m-2" id="${data.results[i].id}">
                        <div class="similar-movie-image">
                            <img class="similar-movie-poster" src="https://image.tmdb.org/t/p/original${imagePath}" alt="${data.results[i].title}">
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

async function getAllImages(){
    let response = await fetch(baseUrl + movieID + '/images?api_key=' + API_KEY + '&language=en-US&include_image_language=en,null');

    if(response.status === 200){
        let data = await response.json();
        var posters = data.posters;
        var backdrops = data.backdrops;

        $("#backdrop-tab").text("Backdrops ("+ backdrops.length +')');
        $("#poster-tab").text("Posters ("+ posters.length +')');

        console.log(data);

        for(var i = 0; i < backdrops.length; i++){
            var imageURL = backdrops[i].file_path;
    
            $("#backdrop-images").append(`
                <div class="poster">
                    <img class="backdrop-img" src="https://image.tmdb.org/t/p/original${imageURL}" alt="">
                </div>
            `);
        }

        for(var i = 0; i < posters.length; i++){
            var imageURL = posters[i].file_path;

            $("#poster-images").append(`
                <div class="poster">
                    <img class="poster-img" src="https://image.tmdb.org/t/p/original${imageURL}" alt="">
                </div>
            `);
        }
       
    }

}

var trailerKeys = [];
async function getTrailer(){
    let response = await fetch(baseUrl + movieID +"/videos?api_key="+ API_KEY +"&language=en-US");

        if (response.status === 200) {
            let data = await response.json();
            var trailerData = data.results;
            // console.log(trailerData);

            if (trailerData.length === 0){
                $("#watchTrailer").addClass("disabled");
            }

            for(var i = 0; i < trailerData.length; i++){
                if(trailerData[i].type === "Trailer"){
                    trailerKeys.push(trailerData[i].key);
                }
            }
        }
        
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

$(document).on('click', '#watchTrailer', function(){
    window.open("https://www.youtube.com/watch?v=" + trailerKeys[0]);
});

$(document).on('click', '.similar-movie-card', function() { 
    var selectedMovieID = $(this).children().attr("id");
    window.location = 'details.html?movie=' + $(this).attr("id").toLowerCase().replaceAll(" ", "-");
    movieID = localStorage.setItem("MovieId", selectedMovieID);
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




//  for(var i = 0; i < posters.length; i++){
//     var imageURL = posters[i].file_path;

//     $(".images-container").append(`
//         <div class="poster">
//             <img class="poster-img" src="https://image.tmdb.org/t/p/w185${imageURL}" alt="">
//         </div>
//     `);
// }

// if(posters.length === 0){
    // for(var i = 0; i < backdrops.length; i++){
    //     var imageURL = backdrops[i].file_path;

    //     $(".images-container").append(`
    //         <div class="poster">
    //             <img class="backdrop-img" src="https://image.tmdb.org/t/p/w342${imageURL}" alt="">
    //         </div>
    // `);
    // }
// }