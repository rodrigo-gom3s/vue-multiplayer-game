exports.createGameEngine = () => {
    const initGame = (gameFromDB) => {
        gameFromDB.gameStatus = null
        // null -> game has not started yet 
        // 0 -> game has started and running
        // 1 -> player 1 is the winner
        // 2 -> player 2 is the winner
        //obtem 1 ou 2 para gerar aleatoriamente quem  começa
        gameFromDB.currentPlayer = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        // null -> game has not ended
        // 1 -> player 1 is the winner
        // 2 -> player 2 is the winner
        gameFromDB.size = gameFromDB.board_id.board_rows * gameFromDB.board_id.board_cols;
        gameFromDB.pairsFoundPlayerOne = 0;
        gameFromDB.pairsFoundPlayerTwo = 0;
        gameFromDB.playerWhoReachfirstTheMaximumPairs = 0
        gameFromDB.flippedPair = []
        gameFromDB.decisionOfGame = 0
        gameFromDB.noOneCanPlay = false
        gameFromDB.board = []
        gameFromDB.turn = 1
        gameFromDB.total_time =0 

        const pairs = generateRandomPairs(gameFromDB.size);

        for (var i = 0; i < gameFromDB.size ; i++) {
            gameFromDB.board.push({
                id: i,
                pair_id: pairs[i],
                src: `/cards/${pairs[i]}.png`,
                flipped: false,
                matched: false
            })
        }
        
        gameFromDB.board = transformToXY(gameFromDB.board, gameFromDB.board_id.board_rows, gameFromDB.board_id.board_cols)
        
        
        return gameFromDB
    }

    // ------------------------------------------------------
    // Actions / Methods
    // ------------------------------------------------------
    // Check if the board is complete and change the gameStatus accordingly
    const changeGameStatus = (game) => {
        if(isBoardComplete(game)){
            if(game.pairsFoundPlayerOne > game.pairsFoundPlayerTwo){
                game.gameStatus = 1
            }else if(game.pairsFoundPlayerOne < game.pairsFoundPlayerTwo){
                game.gameStatus = 2
            }else{
                game.gameStatus = game.playerWhoReachfirstTheMaximumPairs
            }
            
        }else{
            game.gameStatus = 0
        }
    }
    
    const isBoardComplete = (game) => {
            return (game.pairsFoundPlayerOne + game.pairsFoundPlayerTwo) == game.size/2 ? true : false
    }

    // returns whether the game as ended or not
    const gameEnded = (game) => game.gameStatus > 0

    // Plays a specific piece of the game (defined by its index)
    // Returns true if the game play is valid or an object with an error code and message otherwise
    const play = (game, index, time, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId != game.player2SocketId)){
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            }
        }
        if (((game.currentPlayer == 1) && (playerSocketId != game.player1SocketId))
            ||
            ((game.currentPlayer == 2) && (playerSocketId != game.player2SocketId))){
            return {
                errorCode: 12,
                errorMessage: 'Invalid play: It is not your turn!'
            }
        } 

        if(game.noOneCanPlay){
            return {
                errorCode: 13,
                errorMessage: 'Invalid play: No one can play now. wait until matched cleared or until cards are flipped downside'
            }
        }

        //actualizar tempo
        game.total_time = time
        //logica do jogo em ação 
        let card = game.board[index.row][index.col]
        if(card == null){
            return {
                errorCode: 14,
                errorMessage: 'Invalid play: choosed card that is not in the board'
            }
        }
        if (card.flipped) {
            return {
                errorCode: 15,
                errorMessage: 'Invalid play: card already flipped'
            }
        }
        if (card.matched) {
            return {
                errorCode: 16,
                errorMessage: 'Invalid play: card already matched'
            }
        }
        flipCard(card)

        game.flippedPair.push(card)

        if (game.flippedPair.length === 2) {
            
            game.noOneCanPlay = true
            game.turn = game.turn + 1

            if (game.flippedPair[0].pair_id === game.flippedPair[1].pair_id 
                    && game.flippedPair[0].id !== game.flippedPair[1].id) {
                //tou a fazer else if no caso se for para acrescentar mais 1 player
                if(game.currentPlayer === 1){
                    game.pairsFoundPlayerOne = game.pairsFoundPlayerOne + 1;
                    if(game.pairsFoundPlayerOne > game.pairsFoundPlayerTwo){
                        game.playerWhoReachfirstTheMaximumPairs = game.currentPlayer
                    }
                }else if(game.currentPlayer === 2){
                    game.pairsFoundPlayerTwo = game.pairsFoundPlayerTwo + 1;
                    if(game.pairsFoundPlayerTwo > game.pairsFoundPlayerOne){
                        game.playerWhoReachfirstTheMaximumPairs = game.currentPlayer
                    }
                }
                game.decisionOfGame = 2;


                /*setTimeout(() => {
                  flippedPair[0].matched = true
                  flippedPair[1].matched = true
                  flippedPair.splice(0, 2)
                  resetTurn()
                }, 2000);*/
            }else{
                game.decisionOfGame = 3;
              /*setTimeout(() => {
                flippedPair[0].flipped = false
                flippedPair[1].flipped = false
                flippedPair.splice(0, 2)
                resetTurn()
            }, 2000);*/
            }

            game.currentPlayer = game.currentPlayer === 1 ? 2 : 1
            
        }else{
            game.decisionOfGame = 1;
        }

        
        changeGameStatus(game)
        return true
    }

    // One of the players quits the game. The other one wins the game
    const quit = (game, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId != game.player2SocketId)){
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            }
        }
        game.gameStatus = playerSocketId == game.player1SocketId ? 2 : 1
        game.status = 'ended'
        return true
    }

    // Check if socket can close the game (game must have ended and player must belong to game)
    const close = (game, playerSocketId) => {
        if ((playerSocketId != game.player1SocketId) && (playerSocketId != game.player2SocketId)){
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            }
        }
        if (!gameEnded(game)) {
            return {
                errorCode: 14,
                errorMessage: 'Cannot close a game that has not ended!'
            }
        }
        return true
    }

    //########################MEU ENGINE
    //nao deve ser preciso esta função mas acho necessário saber que 
    //startGame(board_rows.value , board_cols.value)

    // state encapsulated and managed by the composable:
    //funcao privada
    const generateRandomPairs = (pairsOfCards) => {
        //min e max de imagem de cartas. cada numero é um par de cartas
        const min = 1;
        const max = 40;
        const uniqueNumbers = new Set();
      
        // Gera `x` números únicos
        while (uniqueNumbers.size < pairsOfCards /2 ) {
          //linha a seguir devo conseguir reduzir
          const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
          uniqueNumbers.add(randomNumber);
        }
      
        // Converte os números únicos em um array com pares (duplicados)
        const pairsArray = [...uniqueNumbers, ...uniqueNumbers];
      
      
        // Embaralha o array de pares
        for (let i = pairsArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pairsArray[i], pairsArray[j]] = [pairsArray[j], pairsArray[i]];
        }
      
        return pairsArray;
    }
    
    //funcao privada
    const transformToXY = (array, rows, cols) => {
        /*if (array.length !== rows * cols) {
          throw new Error("The size of the array must be equal to x * y");
        }*/
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix.push(array.slice(i * cols, i * cols + cols));
        }

        //adicionar os os rows e as colunas às cartas
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                matrix[i][j].row = i;
                matrix[i][j].col = j;
            }
        }
        return matrix;
    }

    /*const resetTurn = () =>{
        lastMoveDone.value = formattedTime.value;
        isMyTurn.value = true;
    }*/

    //esta função faz return de 3 valores
    // 1 se ainda só virou 1 carta
    // 2 se virou 2 cartas e é matched
    // 3 se virou 2 cartas e não é matched
    const flipCard = (card) => {
    
        card.flipped = !card.flipped
    
    }
    const cardsMatched = (game) =>{
        game.flippedPair[0].matched = true
        game.flippedPair[1].matched = true
        game.flippedPair.splice(0, 2)
        game.decisionOfGame = 0
        game.noOneCanPlay = false
        changeGameStatus(game)
    }

    const cardsFlipped = (game) =>{
        game.flippedPair[0].flipped = false 
        game.flippedPair[1].flipped = false
        game.flippedPair.splice(0, 2)
        game.decisionOfGame = 0
        game.noOneCanPlay = false
    }

    const removeSocketInformation = (game, socketId) =>{

        if(game.player1SocketId == socketId){
            game.player1SocketId = null
        }

        if(game.player2SocketId == socketId){
            game.player2SocketId = null
        }
    }
    
    return {
        initGame,
        gameEnded,
        play,
        quit,
        close,
        cardsMatched,
        cardsFlipped,
        removeSocketInformation,
    }
}