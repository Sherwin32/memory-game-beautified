var game = new Game(24);//Should give it other numCards later
$(document).ready(function() {
	game.reset(24);
	console.log("I'm in");
	console.log(game);
	$('.box').on('click', onClickAction);
	$('#restartBtn').on('click', restart);
	$('#resetScoreBtn').on('click', resetScore);

});

function resetScore(){
	$('.player-info').addClass('zoomOutUp');
	setTimeout(function(){
		$('#score').text("0");
		$('#steps').text("0");
		$('.player-info').removeClass('zoomOutUp');		
	}, 1000);

}

function stepPlusOne(){
	var steps = parseInt($('#steps').text());
	$('#steps').text(steps+1);
}

function restart(){
	$('.box').addClass('hinge');
	setTimeout(function(){
		$('.box').removeClass('hinge');
		$('.box').addClass('fadeIn');
		setTimeout(function(){
			$('.box').removeClass('fadeIn');
		},1000);
	}, 2300);
	gamae = new Game(24);
	game.reset(24);
	$('.box').removeClass('flipInY');
}

function onClickAction(){
	var thisIndex = $(this).attr("index");
	//if this card is not matched yet and not clicked yet
	if(!game.cards[thisIndex-1].isMatched && !game.cards[thisIndex-1].isFaceUp && !game.current_guess.card2.index){
		
		//if this is the first card flipped
		if(!game.current_guess.card1.isFaceUp && !game.current_guess.card2.isFaceUp){
			console.log("valid step")
			game.current_guess.card1.cardAttr = thisIndex;
			game.current_guess.card1.isFaceUp = true;
			game.cards[thisIndex-1].flipOver(1);
		}else{ //if this is the second card flipped
			stepPlusOne();
			game.current_guess.card2.cardAttr = thisIndex;
			game.current_guess.card2.isFaceUp = true;
			game.cards[thisIndex-1].flipOver(2);
			console.log(game.current_guess);
			// game.current_guess.isMatch();
			if(game.current_guess.isMatch()){

				game.removeCard();
				if(game.hasWon()){
					game.celebrate();
				}
			}else{
				game.flipBack();
			}
		}	
	}
	
}

function Card(attr, index){
	//Number matching the exact box in html file
	this.index = index;
	//String for image url
	this.faceImage = `img/${attr}.jpg`;
	//boolean that shows if the card is face up
	this.isFaceUp = false;
	//boolean that shows if the card is matched
	//so that we shouldn't be able to make any changes to it
	this.isMatched = false;
	//String that binds this card to the box with the same card attribute in index.html
	//Which means it determins the face-up image of this card
	this.cardAttr = attr;
	//A function to flip over a card
	this.flipOver = function(cardNum){ // cardNum indicates if it's the 1st one or 2nd one
		if(this.isFaceUp){
			$(`.box[index="${this.index}"]`).css('background-image', 'url("img/dog-v-cat.jpg")');
			$(`.box[index="${this.index}"]`).removeClass('flipInY');
			this.isFaceUp = false;
		}else{
			$(`.box[index="${this.index}"]`).css('background-image', `url("${this.faceImage}")`);
			$(`.box[index="${this.index}"]`).addClass('flipInY');
			this.isFaceUp = true;
			if(cardNum===1){
				game.current_guess.card1 = this;
				console.log("game.current_guess.card1.index")
				console.log(game.current_guess.card1.index)
			}else if(cardNum===2){
				game.current_guess.card2 = this;
			}
		}
	}
}

function Pair(){
	this.card1 = new Card();
	this.card2 = new Card();
	this.addCard = function(){

	}
	this.isMatch = function(){
		if(this.card1.cardAttr === this.card2.cardAttr){
			game.cards[this.card1.index-1].isMatched = true;
			game.cards[this.card2.index-1].isMatched = true;
			console.log("isMatch!");
			return true;
		}else{
			return false;
		}
	}
}

function Game(numCards){
	this.numCards = numCards;
	this.current_guess = new Pair();
	this.cards = [];
	
	this.reset = function(numCards){
		this.numCards = numCards;
		this.cards = [];
		var cardAttrTemp = this.randomize();
		for(var i=0; i<numCards; i++){
			this.cards.push(new Card(cardAttrTemp[i], i+1));
			$(`.box[index="${i+1}"]`).attr("card", cardAttrTemp[i]);
		}
		$('.box').css('background-image', 'url("img/dog-v-cat.jpg")');
	}
	this.randomize = function(){
		var tempArray = []
		for(var i=1; i<=this.numCards/2; i++){
			tempArray.push(i);
			tempArray.push(i);
		}
		return shuffle(tempArray);
	}
	this.removeCard = function(){
		setTimeout(function(){
			$(`.box[card="${game.cards[(game.current_guess.card1.index)-1].cardAttr}"]`).css('background-image', '');
			$(`.box[card="${game.cards[(game.current_guess.card1.index)-1].cardAttr}"]`).css('background-color', 'transparent');
			console.log("reset pair")
			game.current_guess = new Pair();
		},400)

	}
	this.flipBack = function(){
		setTimeout(function(){
				game.cards[(game.current_guess.card1.index)-1].flipOver();
				game.cards[(game.current_guess.card2.index)-1].flipOver();
				console.log("reset pair")
				game.current_guess = new Pair();
			},600)
	}
	this.hasWon = function(){
		for(var i=0; i<this.numCards; i++){
			if(!this.cards[i].isMatched){
				return false;
			}
		}
		return true;
	}
	this.celebrate = function(){
		$('h1').text("You Won!!!")
		$('h1').removeClass("tada");
		$('h1').addClass("flip");
		setTimeout(function(){
			restart();
			$('h1').text("Memory Game!")
			$('h1').removeClass("flip");
			$('h1').addClass("tada");
		}, 2000);
		var score = parseInt($('#score').text());
		$('#score').text(score+1);
	}
}

//Input an array and shuffle it
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

