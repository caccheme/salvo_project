package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import salvo.model.*;

import java.util.*;

import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")
public class SalvoController {


        //-------------------Retrieve All Games and the games' players-----------------------------------

        @Autowired
        private GameRepository repo;
        @Autowired
        private GamePlayerRepository gp_repository;
        @Autowired
        private PlayerRepository playerRepository;
        @Autowired
        private ShipRepository shipRepository;

        @RequestMapping(value = "/games", method = RequestMethod.GET)
        public Map<String, Object> getGames() {
                Map<String, Object> dto = new LinkedHashMap<>();

                String name = getCurrentUsername();//DRY this out

                if (name != null) {
                        Player currentPlayer = playerRepository.findOneByEmail(getCurrentUsername());
                        Long currentId = currentPlayer.getId();

                        dto.put("player", getCurrentPlayer(playerRepository.findOne(currentId)));
                }
                dto.put("games", getAllGames());
                return dto;
        }

        @RequestMapping(value = "/games", method= RequestMethod.POST) //game created with a POST to /api/games.
        public ResponseEntity<Map<String, Object>> createGame() {
                Map<String, Object> dto = new LinkedHashMap<>();
                ResponseEntity result;

                String name = getCurrentUsername();// gets the current user
                Player currentUser = playerRepository.findOneByEmail(name);
                if (name == null){ //if there is no current user:
                        result = makeResponse(null, HttpStatus.UNAUTHORIZED);// send unauthorized response
                }
                else { //if there is a current user:
                        Game newGame = repo.save(new Game()); //create & save a new game & gamePlayer for currentUser
                        GamePlayer newGamePlayer = gp_repository.save(new GamePlayer(newGame, currentUser));

                        dto.put("gpid", newGamePlayer.getId()); //create JSON containing new gamePlayer ID

                        result = makeResponse(dto, HttpStatus.OK);

                }
                return result;
        }

        @RequestMapping(value = "/game/{game_id}/players", method= RequestMethod.POST) //join game with a POST
        public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long game_id) {
                Map<String, Object> dto = new LinkedHashMap<>();
                ResponseEntity result = new ResponseEntity(null, null);

                String name = getCurrentUsername();// gets the current user
                Player currentUser = playerRepository.findOneByEmail(name);
                Game game = repo.findOne(game_id);

                if (name == null){ //if there is no current user:
                        result = makeResponse(null, HttpStatus.UNAUTHORIZED);// send unauthorized response
                }
                else{ //if there is a current user:
                        if (game == null){ //game doesn't exist
                                dto.put("text", "No such game");
                                result = makeResponse(dto, HttpStatus.FORBIDDEN);
                        }
                        else { //game exists     //
                                if (game.getPlayers().toArray().length < 2 //game has less than two players
                                        && game.getPlayers().contains(currentUser) != true){ //user not already part of game
                                        GamePlayer newGamePlayer = gp_repository.save(new GamePlayer(game, currentUser));
                                        dto.put("gpid", newGamePlayer.getId());

                                        result = makeResponse(dto, HttpStatus.OK);
                                }
                                else { //game full
                                        dto.put("text", "Game is full.");
                                        result = makeResponse(dto, HttpStatus.FORBIDDEN);
                                }
                        }
                }
                return result;
        }


        @RequestMapping(value="/players/{email}/{password}", method=RequestMethod.POST)
        public ResponseEntity<Map<String, Object>> createUser(@PathVariable String email,
                                                              @PathVariable String password) {
                Map<String, Object> dto = new LinkedHashMap<>();

                Player player = new Player(email, password);
                playerRepository.save(player);

                dto.put("email", player.getEmail());
                dto.put("password", player.getPassword());
                return makeResponse(dto, HttpStatus.OK);
        }

        @RequestMapping("/game_view/{gamePlayer_Id}")
        public ResponseEntity<Map<String, Object>> getGameViewData(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();
                ResponseEntity result = new ResponseEntity(null, null);

                String currentPlayer = getCurrentUsername();
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                String gpPlayer = gamePlayer.getPlayer().getEmail();

                if (gp_repository.findOne(gamePlayer_Id) == null || gamePlayer_Id == null){
                        result = makeResponse(null, HttpStatus.FORBIDDEN);
                }
                if (gpPlayer != currentPlayer){
                        result = makeResponse(null, HttpStatus.UNAUTHORIZED);
                }
                //if admin...then can see it even if not gamePlayer...///extra work to do later

                if (gpPlayer == currentPlayer){
                        Game game = gp_repository.findOne(gamePlayer_Id).getGame();

                        dto.put("game_id", game.getId());
                        dto.put("game_created", game.getCreationDate());
                        dto.put("main_player", gamePlayer.getPlayer().getEmail());
                        dto.put("gamePlayers", getPlayerInfo(game.getPlayers()));
                        dto.put("main_player_ships", collectShipData(gamePlayer.getShips()));

                        result = makeResponse(dto, HttpStatus.OK);
                }

                return result;
        }

//        Required request body is missing:
// public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>>
// salvo.SalvoController.placeGamePlayerShips(java.lang.Long,salvo.model.Ship)

        @RequestMapping("/games/players/{gamePlayer_Id}/ships")
        public ResponseEntity<Map<String, Object>> placeGamePlayerShips(@PathVariable Long gamePlayer_Id,
                                                                        @RequestBody List<Ship> ships) {
                Map<String, Object> dto = new LinkedHashMap<>();
                ResponseEntity result = new ResponseEntity(null, null);

                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                String currentPlayer = getCurrentUsername();
                Player player = playerRepository.findOneByEmail(currentPlayer);

                //no current user logged in OR no gamePlayer with given ID OR
                //the current user is not the game player the ID references
                // then unauthorized:
                if (player == null || gp_repository.findOne(gamePlayer_Id) == null ||
                        player != gp_repository.findOne(gamePlayer_Id).getPlayer())
                {
                        result = makeResponse(null, HttpStatus.UNAUTHORIZED);
                }

                //A Forbidden response should be sent if the user already has all ships placed.
                if (gamePlayer.getShips().toArray().length == 5){
                        result = makeResponse(null, HttpStatus.FORBIDDEN);
                }

                //else of above two...
                if (player != null && gp_repository.findOne(gamePlayer_Id) != null &&
                        player == gp_repository.findOne(gamePlayer_Id).getPlayer()
                        && gamePlayer.getShips().toArray().length < 5)
                {
                        ships.iterator().forEachRemaining(s -> s.setGamePlayer(gamePlayer));
                        ships.iterator().forEachRemaining(s -> shipRepository.save(s));
                        dto.put("ships", collectShipData(gamePlayer.getShips()));

                        result = makeResponse(dto, HttpStatus.CREATED);
                }

                return result;
        }

        private ResponseEntity<Map<String, Object>> makeResponse (Map<String, Object> dto, HttpStatus status){
                ResponseEntity result = new ResponseEntity(dto, status);

                return result;
        }

        private List<Object> getPlayerInfo(Set<GamePlayer> gamePlayers){
                return gamePlayers
                        .stream()
                        .sorted(Comparator.comparing(GamePlayer::getId))
                        .map(gp -> makePlayerDTO2(gp))
                        .collect(toList());
        }

        private Map<String, Object> makePlayerDTO2(GamePlayer gamePlayer){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("player_info", makePlayerShipSalvoDTO(gamePlayer.getPlayer(), gamePlayer));

                return dto;
        }

        private Map<String, Object> makePlayerShipSalvoDTO(Player player, GamePlayer gamePlayer){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("player_id", player.getId());
                dto.put("email", player.getEmail());
                dto.put("salvoes", collectSalvoData(gamePlayer.getSalvoes()));


                return dto;
        }

        private List<Object> collectSalvoData(Set<Salvo> salvoes){
                return salvoes
                        .stream()
                        .sorted(Comparator.comparing(Salvo::getId))
                        .map(s -> makeSalvoObject(s))
                        .collect(toList());
        }

        private Map<String, Object> makeSalvoObject(Salvo salvo){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("turn", salvo.getTurn());
                dto.put("locations", salvo.getSalvoLocations());

                return dto;
        }

        private List<Object> collectShipData(Set<Ship> ships){
                return ships
                        .stream()
                        .sorted(Comparator.comparing(Ship::getId))
                        .map(s -> makeShipObject(s))
                        .collect(toList());
        }

        private Map<String, Object> makeShipObject(Ship ship){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("type", ship.getShipType());
                dto.put("locations", ship.getShipLocations());

                return dto;
        }

        private Map<String, Object> getCurrentPlayer(Player player) {
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("id", player.getId());
                dto.put("name", player.getEmail());

                return dto;
        }

        private List<Object> getAllGames() {
                return  repo
                        .findAll()
                        .stream()
                        .map(g -> makeGameDTO(g))
                        .collect(toList());
        }

        private Map<String, Object> makeGameDTO(Game game) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                dto.put("game_id", game.getId());
                dto.put("game_created", game.getCreationDate());
                dto.put("gamePlayers", getGamePlayers(game.getPlayers()));

                return dto;
        }

        private List<Object> getGamePlayers(Set<GamePlayer> players){
                return players
                        .stream()
                        .sorted(Comparator.comparing(GamePlayer::getId))
                        .map(p -> makeNewGamePlayerDTO(p))
                        .collect(toList());
        }

        private Map<String, Object> makeNewGamePlayerDTO(GamePlayer gamePlayer){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("player_id", gamePlayer.getPlayer().getId());
                dto.put("player_email", gamePlayer.getPlayer().getEmail());
                dto.put("score",  findScore(gamePlayer.getGame().getScores(), gamePlayer.getPlayer().getId()));

                return dto;
        }

        private Object findScore(Set<GameScore> scores, Long playerId){
                GameScore score = scores.stream().filter(s -> s.getPlayer().getId() == playerId)
                        .findFirst().orElse(null);

                if (score != null){
                        return score.getScore();
                }
                return null;
        }

        private String getCurrentUsername() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
                        return null;
                } else {
                        Object principal = auth.getPrincipal();
                        return (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername() : principal.toString();
                }
        }

}