const baseUrl =  "https://api.themoviedb.org/3/";
const API_KEY = "6ecb3c9eae671fa03e06b15bbda19db8";

var pageNumber = 1;
$("document").ready(function(){
    fetchAllPopularMovies(pageNumber);
});

$("#showMoreBtn").on("click", function(){
    pageNumber++;
    fetchAllPopularMovies(pageNumber);
});

async function fetchAllPopularMovies(pageNo) {
    let response = await fetch(baseUrl + 'movie/popular?api_key=' + API_KEY + '&page='+ pageNo);
    console.log(baseUrl + 'movie/popular?api_key=' + API_KEY + '&page='+ pageNo)

    if (response.status === 200) {
        let data = await response.json();
        console.log(data.results)
    
        for(var i = 0; i < data.results.length; i++){

            $(".latest-movies-lists").append(
                `<div class="col-12 col-md-4 col-lg-3 movie-card py-2 mb-2" id="${data.results[i].title}">
                    <div class="movie-card-wrapper p-2" id="${data.results[i].id}">
                        <div class="movie-image">
                            <img class="movie-poster" src="https://image.tmdb.org/t/p/original${data.results[i].backdrop_path}" alt="${data.results[i].id}">
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

setTimeout(()=> {
    $("#showMoreBtn").removeClass("d-none");
}, 1000);

function formatDate(releaseDate){
    var dateToFormat = new Date(releaseDate);
    var dd = String(dateToFormat.getDate()).padStart(2, '0');
    var mm = dateToFormat.toLocaleString('default', { month: 'long' });
    var yyyy = dateToFormat.getFullYear();
    var formattedDate = mm + ' ' + dd + ', ' + yyyy;
    return formattedDate;
}