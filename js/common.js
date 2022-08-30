$("#navSearchBtn").on("click", function(){
    var navSearchValue = $("#navSearchField").val();
    if(navSearchValue == ""){
        alert("Please enter valid name")
    }else{
        // alert(navSearchValue);
        window.location = 'movies.html?moviename=' + navSearchValue;
    }
});

// ON CLICK OF MOVIE NAME
$(document).on('click', '.viewDetailBtn', function() { 
    var movieId = $(this).parent().parent().attr("id");
    window.location = 'details.html?id=' + movieId ;
});

function formatDate(releaseDate){
    var dateToFormat = new Date(releaseDate);
    var dd = String(dateToFormat.getDate()).padStart(2, '0');
    var mm = dateToFormat.toLocaleString('default', { month: 'long' });
    var yyyy = dateToFormat.getFullYear();
    var formattedDate = mm + ' ' + dd + ', ' + yyyy;
    return formattedDate;
}