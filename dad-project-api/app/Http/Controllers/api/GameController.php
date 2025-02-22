<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\GameResource;
use App\Http\Resources\UserResource;
use App\Models\Game;
use App\Models\User;
use App\Models\Transaction;
use App\Models\MultiplayerGamesPlayed;
use App\Http\Requests\GetSingleplayerGamesRequest;
use App\Http\Requests\GetMultiplayerGamesRequest;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Http\Requests\JoinGameRequest;
use App\Http\Requests\UpdateGameMultiplayerRequest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;



class GameController extends Controller
{
    //returns singleplayer games
    public function index(Request $request)
    {
        if($request->user()->type == 'A')
        {
            return GameResource::collection(Game::where('type', 'S')->orderBy('created_at', 'desc')->paginate(10));
        }
        else
        {
            return GameResource::collection(Game::where('type', 'S')->where('created_user_id', $request->user()->id)->orderBy('created_at', 'desc')->paginate(10));
        }
    }

    //returns multiplayer games
    public function multiplayerGames(Request $request)
    {
        if($request->user()->type == 'A')
        {
            return GameResource::collection(Game::where('type', 'M')->orderBy('created_at', 'desc')->paginate(10));
        }
        else
        {
            $ids = MultiplayerGamesPlayed::where('user_id', $request->user()->id)->pluck('game_id')->toArray();
            return GameResource::collection(Game::where('type', 'M')->whereIntegerInRaw('id', $ids)->orderBy('created_at', 'desc')->paginate(10));
        }
    }

    public function show(Game $game)
    {
        return new GameResource($game);
    }
    
    public function store(StoreGameRequest $request)
    {
        
        $validated = $request->validated();
        $game = null;

        if($validated['type'] == 'S'){
            if($validated['board_id'] == 1){
                $game = new Game();
                $game->fill($validated);
                $game->status = 'PL';
                $game->began_at = now();
                $game->ended_at = null;
                $game->save();
            }else{
                $user = User::findOrFail($validated['created_user_id']);
                if($user->brain_coins_balance < 1){
                    return response()->json([
                        'message' => 'User needs to have 1 brain coins to play a single player game in this board'
                    ], 400);
                }

                $game = new Game();
                $game->fill($validated);
                $game->status = 'PL';
                $game->began_at = now();
                $game->ended_at = null;
                $user->brain_coins_balance--;

                if($game->save() && $user->save()){
                    
                    $transaction = new Transaction();
                    $transaction->user_id = $user->id;
                    $transaction->game_id = $game->id;
                    $transaction->brain_coins = -1;
                    $transaction->type = 'I';
                    $transaction->transaction_datetime = now();
                    $transaction->save();               
                }else{
                    return response()->json([
                        'message' => 'error at creating the game'
                    ], 400);
                }
            }
        }else{
            $user = User::findOrFail($validated['created_user_id']);
            if($user->brain_coins_balance < 5){
                return response()->json([
                    'message' => 'User needs to have 5 brain coins to play a Multi player game'
                ], 400);
            }

            $user_player_2 = User::findOrFail($validated['second_player_user_id']);

            $game = new Game();
            $game->fill($validated);
            $game->status = 'PL';
            $game->began_at = now();
            $game->ended_at = null;
            $user->brain_coins_balance -= 5;
            $user_player_2->brain_coins_balance -= 5;

            if($game->save() && $user->save()){
                
                $transaction = new Transaction();
                $transaction->user_id = $user->id;
                $transaction->game_id = $game->id;
                $transaction->brain_coins = -5;
                $transaction->type = 'I';
                $transaction->transaction_datetime = now();
                $transaction->save();    
                
            }

            if($user_player_2->save()){
                $transaction_player2 = new Transaction();
                $transaction_player2->user_id = $user_player_2->id;
                $transaction_player2->game_id = $game->id;
                $transaction_player2->brain_coins = -5;
                $transaction_player2->type = 'I';
                $transaction_player2->transaction_datetime = now();
                $transaction_player2->save();  
            }

            $multiplayerGame = new MultiplayerGamesPlayed();

            $multiplayerGame->user_id = $user->id;
            $multiplayerGame->game_id = $game->id;
            $multiplayerGame->save();

            $multiplayerGame_player2 = new MultiplayerGamesPlayed();

            $multiplayerGame_player2->user_id = $user_player_2->id;
            $multiplayerGame_player2->game_id = $game->id;
            $multiplayerGame_player2->save();
        }
        #$task = Task::create($request->validated());
        return new GameResource($game);
    }

    public function update(UpdateGameRequest $request, Game $game)
    {
        //pode ser preciso melhor proteções
        if($game->status == 'I'){
            return response()->json([
                'message' => 'Can´t update game has already ended'
            ], 400);
        }
        $validated = $request->validated();

        /*if($game->created_user_id != $validated['winner_user_id']){
            if($game->status == 'E' || $game->status == 'I'){
                return response()->json([
                    'message' => 'Can´t update game has already ended'
                ], 400);
            }
        }*/
        
        //fazer singleplayer coisa de update
        $game->status = $validated['status'];
        $game->ended_at = now();
        $game->total_time = $validated['total_time'];
        $game->total_turns_winner = $validated['turns'];


        $game->save();
        

        return new GameResource($game);
    }

    public function updateMulti(UpdateGameMultiplayerRequest $request, Game $game)
    {
        //pode ser preciso melhor proteções
        if($game->status == 'I'){
            return response()->json([
                'message' => 'Can´t update game has already ended'
            ], 400);
        }
        $validated = $request->validated();

        /*if($game->created_user_id != $validated['winner_user_id']){
            if($game->status == 'E' || $game->status == 'I'){
                return response()->json([
                    'message' => 'Can´t update game has already ended'
                ], 400);
            }
        }*/
        
        if($game->type != 'M'){
            return response()->json([
                'message' => 'The game that you want to update must be multiplayer'
            ], 400);
        }
        
        if($game->winner_user_id != null){
            return response()->json([
                'message' => 'Can´t update game has already ended'
            ], 400);
        }

        $multiplayerGame = MultiplayerGamesPlayed::where('game_id', $game->id)
            ->where('user_id', $validated['creator_user_id'])->get()[0];
        
        $multiplayerGame_player2 = MultiplayerGamesPlayed::where('game_id', $game->id)
            ->where('user_id', $validated['player2_user_id'])->get()[0];

        //guardar jogo principal
        $game->status = $validated['status'];
        $game->ended_at = now();
        $game->total_turns_winner = $validated['turns'];
        if($validated['status'] == 'E'){
            $game->total_time = $validated['total_time'];
        }else{
            $game->total_time = null;
        }
        
        $game->winner_user_id = $validated['winner_user_id'];
        $game->save();
        
        if($multiplayerGame->user_id == $validated['winner_user_id']){
            //actualizar o multi do que ganhou
            //dar as coins ao user que ganhou
            $user = User::findOrFail($validated['winner_user_id']);
            $user->brain_coins_balance += 8;
            $user->save();

            $transaction = new Transaction();
            $transaction->user_id = $user->id;
            $transaction->game_id = $game->id;
            $transaction->brain_coins = 8;
            $transaction->type = 'I';
            $transaction->transaction_datetime = now();
            $transaction->save(); 
            $multiplayerGame->player_won = 1;

            $multiplayerGame->pairs_discovered = $validated['player1_pairs_discovered'];
            $multiplayerGame->save();

            $multiplayerGame_player2->player_won = 0;
            $multiplayerGame_player2->pairs_discovered = $validated['player2_pairs_discovered'];
            $multiplayerGame_player2->save();

            //actualizar do que perdeu
        }else{
            //actualizar o multi do que ganhou
            //dar as coins ao user que ganhou
            $user = User::findOrFail($validated['player2_user_id']);
            $user->brain_coins_balance += 8;
            $user->save();

            $transaction = new Transaction();
            $transaction->user_id = $user->id;
            $transaction->game_id = $game->id;
            $transaction->brain_coins = 8;
            $transaction->type = 'I';
            $transaction->transaction_datetime = now();
            $transaction->save(); 
            $multiplayerGame_player2->player_won = 1;

            $multiplayerGame_player2->pairs_discovered = $validated['player2_pairs_discovered'];
            $multiplayerGame_player2->save();

            $multiplayerGame->player_won = 0;
            $multiplayerGame->pairs_discovered = $validated['player1_pairs_discovered'];
            $multiplayerGame->save();
            
        }

        
        return new GameResource($game);
    }

    public function join(JoinGameRequest $request, Game $game)
    {
        if($game->status != 'PE'){
            return response()->json([
                'message' => 'Can only join a peding game'
            ], 400);
        }

        $validated = $request->validated();

        $userExists = $game->multiplayerGamesPlayed()->where('user_id', $validated['user_id'])->exists();

        if($userExists){
            return response()->json([
                'message' => "Can´t join the same game twice"
            ], 400); 
        }
        
        $multiplayerGame = new MultiplayerGamesPlayed();

        $multiplayerGame->user_id = $validated['user_id'];
        $multiplayerGame->game_id = $game->id;
        $multiplayerGame->save();

        $game->status = 'PL';
        $game->save();

        return new GameResource($game);
    }
    /*public function destroy(Game $game)
    {
        #$game->multiplayerGamesPlayed()->delete();
        $game->delete();
        return response()->json(null, 204);
    }*/
    
}
