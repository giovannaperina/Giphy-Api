
jQuery(document).ready(function($) {
   
    var apiKey = 'Ff3dLqi82sQ2JyoYMtMsAOJdaIm4SkHb';
    var queryURL = 'https://api.giphy.com/v1/gifs/search?limit=10&api_key=' + apiKey;
    
    var currentOffset = 0;
    var currentTerm = "";

    var topics = ['Goat', 'Dogs', 'Cats', 'Horses'];
    var favorites = [];
   
    
    $('#gifs-form').submit(function(e){
        e.preventDefault();
        
        var searchTerm = $('#gifs-input').val();
        
        if(searchTerm.trim()) {
            topics.push(searchTerm);
            $('#gifs-input').val('');
            generateButtons();
            
            currentTerm = searchTerm;
            currentOffset = 0;
            
            loadGifs();
            
        }
        
    });
    
    $('#times-ten, #load-more button').click(function() {
        currentOffset = currentOffset + 10;
        loadGifs();
    });
    
    $('body').on('dblclick', '#buttons-view button', function(){
        var btnIndex = $(this).data('index');
        topics.splice(btnIndex, 1);
        generateButtons();
    });
    
    $('body').on('click', '#buttons-view button', function(){
        var searchTerm = $(this).text();
        currentOffset = 0;
        currentTerm = searchTerm;
        loadGifs();
    });
    
    $('body').on('dblclick', '.gif-image', function() {
       var currentState = $(this).data('state');
       var stillImage = $(this).data('still');
       var animatedImage = $(this).data('animated');
       
       if(currentState == 'still') {
           $(this).attr('src', animatedImage);
           $(this).attr('data-state', 'animated');
           $(this).data('state', 'animated');
       } else {
           $(this).attr('src', stillImage);
           $(this).attr('data-state', 'still');
           $(this).data('state', 'still');
       }
       
    });
    
    $('body').on('click', '.heart', function() {
        
        var $gifImage = $(this).parent().parent().find('.gif-image');
        
        var stillImage =    $gifImage.data('still');
        var animatedImage =  $gifImage.data('animated');
        var rating = $gifImage.data('rating');
        
        var favoriteItem = {
            stillImage: stillImage,
            animatedImage: animatedImage,
            rating: rating
        };
        
        if( localStorage.getItem('favorites') ) {
            favorites = JSON.parse(localStorage.getItem('favorites'));
        }
        
        favorites.push(favoriteItem);
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        if( $(this).hasClass('favorited') ) {
            $(this).attr('src', 'assets/images/heart_outline-icon.png').removeClass('favorited');
        } else {
            $(this).attr('src', 'assets/images/heart-icon.png').addClass('favorited');
        }
        
    });
    
    function loadGifs() {
        
        var searchTerm = currentTerm;
        var offset = currentOffset;
        
        $.ajax({
            url: queryURL + '&q=' + searchTerm + '&offset=' + offset,
            method: 'GET'
        })
        .then(function(response) {
            var gifs = response.data;
            
            console.log(gifs);
            
            $('#times-ten, #load-more').removeClass('hide');
            
            if(currentOffset == 0) {
                $('#gifs-list').html('');
            }
            
            for(var i = 0; i < gifs.length; i++) {
                
                var stillImage =    gifs[i].images.original_still.url;
                var animatedImage =  gifs[i].images.original.url;
                var rating = gifs[i].rating;
                
                var gifSquare = (`
                    
                    <div class="square">
                        <img class="gif-image" data-still="${ stillImage }" data-animated="${ animatedImage }" data-rating="${ rating }" data-state="still" src="${ stillImage }">
                        <div class="heart-holder"><img class="heart" data-index="${ i }" src="assets/images/heart_outline-icon.png" /></div>
                        <p class="gif-rating"><span>${ rating }</span></p>
                        <div class="download-holder">
                            <a download="${animatedImage}" href="${animatedImage}">
                                <img class="download" src="assets/images/download-icon.png" />
                            </a>
                        </div>
                    </div>
                    
                `);
                
                $('#gifs-list').append(gifSquare);
                
            }
            
        });
    }
    
    function loadFavoritesPage() {
        if( localStorage.getItem('favorites') ) {
            favorites = JSON.parse(localStorage.getItem('favorites'));
            
            for(var i = 0; i < favorites.length; i++) {
                
                var stillImage =    favorites[i].stillImage;
                var animatedImage =  favorites[i].animatedImage;
                var rating = favorites[i].rating;
                
                
                
                var gifSquare = (`
                    
                    <div class="square">
                        <img class="gif-image" data-still="${ stillImage }" data-animated="${ animatedImage }" data-rating="${ rating }" data-state="still" src="${ stillImage }">
                        <p class="gif-rating"><span>${ rating }</span></p>
                        <div class="download-holder">
                            <a download="${animatedImage}" href="${animatedImage}">
                                <img class="download" src="assets/images/download-icon.png" />
                            </a>
                        </div>
                    </div>
                    
                `);
                
                $('#favorited-list').append(gifSquare);
                
            }
        }
    }
    loadFavoritesPage();


    function generateButtons() {
        $('#buttons-view').html('');
        
        for(var i = 0; i < topics.length; i++) {
            $('#buttons-view').append('<button data-index="'+ i +'">'+ topics[i] +'</button>');
        }
    }
    generateButtons();
    
    $('#about a p').popover('show');
    
    setTimeout(function() {
        $('#about a p').popover('hide');
    }, 3000);

});

