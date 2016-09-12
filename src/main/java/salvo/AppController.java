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

import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")
public class AppController {


        //-------------------Retrieve All Games and the games' players-----------------------------------

        @Autowired
        private GameRepository repo;
        @Autowired
        private GamePlayerRepository gp_repository;
        @Autowired
        private PlayerRepository playerRepository;

        @RequestMapping("/gamePlayer/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("gamePlayer_name", gamePlayer.getPlayer().getEmail());

                return dto;
        }
        @RequestMapping("/salvoes")
        public List<Object> getAllSalvoes() {
                return  gp_repository
                        .findAll()
                        .stream()
                        .map(g -> makeSalvoDTO(g))
                        .collect(toList());
        }

        @RequestMapping("/gpScores/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerScoresDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                //collect score data for one gamePlayer only
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("email", gamePlayer.getPlayer().getEmail());
                dto.put("scores", getPlayerScores(gamePlayer.getPlayer().getScores()));

                return dto;
        }

        //all scores for all gamePlayers
        @RequestMapping("/scores")
        public List<Object> getAllScores() {
                return  gp_repository
                        .findAll()
                        .stream()
                        .map(g -> makeScoresDTO(g))
                        .collect(toList());
        }

        @RequestMapping("/gpSalvoLocations/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerSalvoLocationDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                //collect salvo location info for one gamePlayer only
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("salvoLocations", getSalvoLocations(gamePlayer.getSalvoes()));
                return dto;
        }

        @RequestMapping("/gpShipLocations/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerShipLocationDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                //collect info for one gamePlayer only
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("shipLocations", getShipLocations(gamePlayer.getShips()));
                return dto;
        }

        //to get ships data connected with gamePlayer ID for Game Grid
        @RequestMapping("/ships")
        public List<Object> getAllShips() {
                return  gp_repository
                        .findAll()
                        .stream()
                        .map(g -> makeShipDTO(g))
                        .collect(toList());
        }

        //get games list info, including players and scores
        @RequestMapping("/games")
        public Map<String, Object> getGames() {
                Map<String, Object> dto = new LinkedHashMap<>();

                String name = getCurrentUsername();

                if (name != null) {
                        Player currentPlayer = playerRepository.findOneByEmail(getCurrentUsername());
                        Long currentId = currentPlayer.getId();

                        dto.put("player", getCurrentPlayer(playerRepository.findOne(currentId)));
                }
                dto.put("games", getAllGames());
                return dto;
        }

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
//                        return makeResponse(null, HttpStatus.UNAUTHORIZED);
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

        private Map<String, Object> makeAccountDTO(GamePlayer user){
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("user_name", user.getPlayer().getEmail());
                dto.put("user_password", user.getPlayer().getPassword());

                return  dto;
        }



        private Map<String, Object> makeSalvoDTO(GamePlayer gamePlayer) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                dto.put("game_id", gamePlayer.getGame().getId());
                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("salvo_locations", makeLocationList(gamePlayer.getSalvoes()));

                return dto;
        }

        private List<List<String>> makeLocationList(Set<Salvo> salvoes) {
                return salvoes
                        .stream()
                        .sorted(Comparator.comparing(Salvo::getId))
                        .map(s -> getCellList(s.getSalvoLocations()))
                        .collect(toList());
        }

        private List<String> getCellList(Set<SalvoLocation> salvoLocations){
                return salvoLocations
                        .stream()
                        .sorted(Comparator.comparing(SalvoLocation::getId))
                        .map(sL -> sL.getSalvoLocationCell())
                        .collect(toList());
        }

        private List<Double> getPlayerScores(Set<GameScore> scores) {
                return scores
                        .stream()
                        .sorted(Comparator.comparing(GameScore::getId))
                        .map(s -> s.getScore())
                        .collect(toList());
        }


        private Map<String, Object> makeScoresDTO(GamePlayer gamePlayer) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                dto.put("email", gamePlayer.getPlayer().getEmail());
                dto.put("scores", makeScoresListDTO(gamePlayer.getPlayer().getScores()));

                return dto;
        }

        private List<Double> makeScoresListDTO(Set<GameScore> scores) {
                return scores.stream().map(s -> s.getScore()).collect(toList());
        }

        private List<List<String>> getSalvoLocations(Set<Salvo> salvoes) {
                return salvoes
                        .stream()
                        .map(s -> makeSalvoLocationsList(s.getSalvoLocations()))
                        .collect(toList());
        }

        private List<String> makeSalvoLocationsList(Set<SalvoLocation> salvoLocations) {
                return salvoLocations
                        .stream()
                        .map(s -> s.getSalvoLocationCell())
                        .collect(toList());
        }


        private List<List<String>> getShipLocations(Set<Ship> ships) {
                return ships
                        .stream()
                        .map(ship -> ship.getShipLocations())
                        .collect(toList());
        }

//        private List<String> makeShipLocationsList(List<String> shipLocations) {
//                return shipLocations
//                        .stream()
//                        .map(sL -> sL.getShipLocationCell())
//                        .collect(toList());
//        }

        private Map<String, Object> makeShipDTO(GamePlayer gamePlayer) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("shipLocations", makeShipLocationsDTO(gamePlayer.getShips()));

                return dto;
        }

        private List<List<String>> makeShipLocationsDTO(Set<Ship> ships) {
                return ships.stream().map(s -> s.getShipLocations()).collect(toList());
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
                dto.put("date_created", game.getCreationDate());
                dto.put("players", makePlayerDTO(game.getPlayers(), game.getScores()));

                return dto;
        }

        private Map<String, Object> makePlayerDTO(Set<GamePlayer> players, Set<GameScore> scores) {
                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("player", getPlayerEmails(players));
                dto.put("score", getScoresArray(scores));

                return  dto;
        }

        private List<String> getPlayerEmails(Set<GamePlayer> players){
                return players
                        .stream()
                        .sorted(Comparator.comparing(GamePlayer::getId))
                        .map(p -> p.getPlayer().getEmail())
                        .collect(toList());
        }

        private List<Double> getScoresArray(Set<GameScore> scores) {
                return scores
                        .stream()
                        .sorted(Comparator.comparing(GameScore::getId))
                        .map(score -> score.getScore())
                        .collect(toList());
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

