
$("#navSearchBtn").on("click", function(){
    var navSearchValue = $("#navSearchField").val();
    if(navSearchValue == ""){
        alert("Please enter valid name")
    }else{
        navSearchValue = navSearchValue.replaceAll(" ", "-");
        window.location = '../html/movies.html?query=' + navSearchValue;
    }
});

function formatDate(releaseDate){
    var dateToFormat = new Date(releaseDate);
    var dd = String(dateToFormat.getDate()).padStart(2, '0');
    var mm = dateToFormat.toLocaleString('default', { month: 'long' });
    var yyyy = dateToFormat.getFullYear();
    var formattedDate = mm + ' ' + dd + ', ' + yyyy;
    return formattedDate;
}


$("#navSearchField").on('keypress', function(e) {
    if(e.which === 13) {
        navSearchValue = $("#navSearchField").val();
        if(navSearchValue == ""){
            return;
        }else{
            window.location = '../html/movies.html?query=' + navSearchValue;
        }
    }
});

// ON CLICK OF MOVIE NAME
var movieId;
var movieName;
$(document).on('click', '.movie-card-wrapper', function() { 
    movieId = $(this).attr("id");
    movieName = $(this).parent().attr("id").replaceAll(' ', '-');

    localStorage.setItem("MovieId", movieId);

    window.location = '../html/details.html?movie='+ movieName.toLowerCase();
});

