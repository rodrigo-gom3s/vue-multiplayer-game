// tictactoe game engine as a Composable
import { ref, computed } from 'vue'

// by convention, composable function names start with "use"
export function useMemoryGame(board_rows, board_cols) {
    // state encapsulated and managed by the composable:
    const status = ref(null)
    // null -> game has not ended
    // 1 -> player 1 is the winner
    // 2 -> player 2 is the winner
    // 3 -> draw
    let size = board_rows * board_cols
    let currentPlayer = ref(1)
    let board = ref([0, 0, 0, 0, 0, 0, 0, 0, 0])
    const cardsImages = ref([])
    const pairsFound = ref(0);
    const gameWon = computed(() => {
        return pairsFound.value == size/2 ? true : false
    })


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
      
    const transformToXY = (array, rows, cols) => {
        if (array.length !== rows * cols) {
          throw new Error("The size of the array must be equal to x * y");
        }
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix.push(array.slice(i * cols, i * cols + cols));
        }
        return matrix;
    }

    const startGame = () =>{
        const pairs = generateRandomPairs(size);

        for (var i = 0; i < size ; i++) {
            cardsImages.value.push({
                id: i,
                pair_id: pairs[i],
                src: `/cards/${pairs[i]}.png`,
                flipped: false,
                matched: false
            })
        }
        
        cardsImages.value = transformToXY(cardsImages.value, board_rows, board_cols)
    
    }

      

    // expose managed state and methods as return value
    // These properties and methods will be "directly" available on 
    // the component that uses this composable 
    return {
        status,
        currentPlayer,
        cardsImages,
        pairsFound,
        gameWon,
        startGame
    }
}

