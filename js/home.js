const baseUrl =  "https://api.themoviedb.org/3/";
const API_KEY = "6ecb3c9eae671fa03e06b15bbda19db8";

$("document").ready(function(){
    fetchPopularMovies();
    fetchTrendingMovies();
});

async function fetchPopularMovies() {
    let response = await fetch(baseUrl + 'movie/popular?api_key=' + API_KEY + '&page=1');

    if (response.status === 200) {
        let data = await response.json();
        // console.log(data.results)
        
        for(var i = 0; i < 8; i++){
            var imgPath = data.results[i].backdrop_path;

            $(".popular-movies-lists").prepend(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4" id="${data.results[i].title}">
                    <div class="movie-card-wrapper p-2" id="${data.results[i].id}">
                        <div class="movie-image">
                            <img class="movie-poster" src="https://image.tmdb.org/t/p/original${imgPath}" alt="${data.results[i].title}">
                        </div>
                        <div class="movie-desc d-flex flex-column p-3 ps-0 pb-0">
                            <span class="text-white movie-name viewDetailBtn">${data.results[i].title}</span>
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

async function fetchTrendingMovies() {
    let response = await fetch(baseUrl + 'trending/movie/week?api_key=' + API_KEY);
    
    if (response.status === 200) {
        let data = await response.json();
        console.log(data.results)
        
        for(var i = 0; i < 8; i++){
            var imgPath = data.results[i].backdrop_path;

            $(".trending-movies-lists").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-4" id="${data.results[i].title}">
                    <div class="movie-card-wrapper p-2" id="${data.results[i].id}">
                        <div class="movie-image">
                            <img class="movie-poster" src="https://image.tmdb.org/t/p/original${imgPath}" alt="${data.results[i].title}">
                        </div>
                        <div class="movie-desc d-flex flex-column p-3 ps-0 pb-0">
                            <span class="text-white movie-name viewDetailBtn">${data.results[i].title}</span>
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

$("#exploreMovies").on("click", function(){
    window.location = '../html/movies.html';
});

$("#exploreTvShows").on("click", function(){
    window.location = '../html/tv-shows.html';
});

setTimeout(()=> {
    $("#showAllRecentMoviesBtn").removeClass("d-none");
    $("#showAllTrendingMoviesBtn").removeClass("d-none");
}, 1000);


$(document).on('click', '#showAllRecentMoviesBtn', function() { 
    window.location = '../html/popular-movies.html';
});

$(document).on('click', '#showAllTrendingMoviesBtn', function() {
    window.location = '../html/trending-movies.html';
});

$(document).on('click', '#view-all-btn', function() { 
    window.location = '../html/popular-movies.html';
});


