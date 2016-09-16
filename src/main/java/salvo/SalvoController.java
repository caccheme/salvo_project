package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import salvo.model.*;

import java.util.*;
import java.util.stream.Collectors;

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

        @RequestMapping("/games")
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

        @RequestMapping("/game_view/{gamePlayer_Id}")
        public Map<String, Object> getGameViewData(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                Game game = gp_repository.findOne(gamePlayer_Id).getGame();

 //put in a check that there is a gameplayer with the gamePlayer_Id before showing page (null pointer otherwise)

                String name = getCurrentUsername();//DRY this out...function getPlayer(..return this or null (can't look at view))


                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);


                //should send back response entity Status.FORBIDDEN is what we want when the gamePlayer_Id == null or isn't a real gamePlayer
                // get currentPlayer (Object) and check that it is the same as gamePlayer.getPlayer()
                //if it is the same then they can see the page (Status.OK) otherwise (Status.UNAUTHORIZED)
                //if admin...then can see it even if not gamePlayer...
                //inside this all the dto code
                //response entity will be wrapped around the map you are returning Response Entity{Map<String,Object>, STATUS...}
//                if (){
//
//                }

                dto.put("game_id", game.getId());
                dto.put("game_created", game.getCreationDate());
                dto.put("main_player", gamePlayer.getPlayer().getEmail());
                dto.put("gamePlayers", getPlayerInfo(game.getPlayers()));
                dto.put("main_player_ships", collectShipData(gamePlayer.getShips()));

                return dto;
        }

        private List<Object> getPlayerInfo(Set<GamePlayer> gamePlayers){
                return gamePlayers
                        .stream()
                        .sorted(Comparator.comparing(GamePlayer::getId))
                        .map(gp -> makePlayerDTO2(gp))
                        .collect(Collectors.toList());
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
                        .collect(Collectors.toList());
        }

        private Map<String, Object> makeSalvoObject(Salvo salvo){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("turn", salvo.getTurn());
                dto.put("locations", salvo.getSalvoLocations());

                return dto;
        }

        //new
        @RequestMapping("/gpGames/{gamePlayer_Id}")
        public Map<String, Object> makeNewScoresDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();
//let's get the user and if there isn't one: can't see this
//then check that user can only see their own game page (is the gamePlayer player the same as the currentUser logged in?)
                //collect score data for one gamePlayer only

                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);

                Set<GamePlayer> games = gamePlayer.getPlayer().getGames();
                List<Set<GameScore>> scores = games.stream().map(g -> g.getGame().getScores()).collect(toList());

                dto.put("email", gamePlayer.getPlayer().getEmail());
                dto.put("scores", scores);

                return dto;
        }

//        //superfluous...see above public method makeNewSocreDTO...need to rename this...
//        //get the logged in user, get the GamePlayer with the ID in the /rest URL, and see if they're consistent
//        @RequestMapping(path = "/game/{gamePlayerId}", method = RequestMethod.POST)
//        //gamePlayerId should come from URL, name should come from Player info
//        public ResponseEntity<Map<String, Object>> checkUser(@RequestParam long gamePlayerId) {
//                //get gamePlayer record from ID of URL
//                GamePlayer gamePlayer = gp_repository.findOne(gamePlayerId);
//                String player_name = gamePlayer.getPlayer().getEmail();
//                if (player_name != getCurrentUsername()) {
//                        return makeResponse(null, HttpStatus.UNAUTHORIZED); //looking for this kind of return
//                }
//                else {
//                        Map<String, Object> dto = new LinkedHashMap<String, Object>();
//                        return makeResponse(makeAccountDTO(gamePlayer), HttpStatus.OK);
//                }
//        }

        //        function to make a ResponseEntity with a Map<String, Object>...still working on the below as sub methods for the above...
        private ResponseEntity<Map<String, Object>> makeResponse (Map<String, Object> dto, HttpStatus status){


                return null; //placeholder for now...not sure what this will give....
        }

        //new
        private Map<String, Object> makeAccountDTO(GamePlayer user){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("user_name", user.getPlayer().getEmail());
                dto.put("user_password", user.getPlayer().getPassword());

                return  dto;
        }

        //new
        private Map<String, Object> makeGamePlayer(GamePlayer gamePlayer){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("email", gamePlayer.getPlayer().getEmail());
                dto.put("gamePlayerId", gamePlayer.getId());
                dto.put("ships", collectShipData(gamePlayer.getShips()));

                return dto;
        }

        private List<Object> collectShipData(Set<Ship> ships){
                return ships
                        .stream()
                        .sorted(Comparator.comparing(Ship::getId))
                        .map(s -> makeShipObject(s))
                        .collect(Collectors.toList());
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
                        .collect(Collectors.toList());
        }

        private List<Object> getScores(Set<GameScore> scores, Long playerId){
                return scores
                        .stream()
                        .filter(s -> s.getPlayer().getId() == playerId)
                        .map(s -> makeNewScoreDTO(s))
                        .collect(Collectors.toList());
        }

        private Map<String, Object> makeNewGamePlayerDTO(GamePlayer gamePlayer){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("player",  getScores(gamePlayer.getGame().getScores(), gamePlayer.getPlayer().getId()));

                return dto;
        }

        private Map<String, Object> makeNewScoreDTO(GameScore score){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("id", score.getPlayer().getId());
                dto.put("email", score.getPlayer().getEmail());
                dto.put("score", score.getScore());

                return dto;
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