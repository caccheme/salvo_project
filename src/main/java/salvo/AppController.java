package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import salvo.model.*;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")
public class AppController {


        //-------------------Retrieve All Games and the games' players-----------------------------------

        @Autowired
        private GameRepository repo;
        @Autowired
        private GamePlayerRepository gp_repository;

//works to get game objects list without player info attached
//        @RequestMapping("/games")
//        public List<Game> getAllGames(Map<String, Object> games) {
//                return repo.findAll().stream().collect(Collectors.toList());
////                repo.findAll().stream().map(Game::getId).collect(Collectors.toList()); //to get list of id's
//        }

        @RequestMapping("/gamePlayers")
        public List<GamePlayer> getAllGamePlayers(Map<String, Object> games) {
                return gp_repository.findAll().stream().collect(Collectors.toList());
//                repo.findAll().stream().map(Game::getId).collect(Collectors.toList()); //to get list of id's
        }

        @RequestMapping("/salvoes")
        public List<Object> getAllSalvoes() {
                return  gp_repository
                        .findAll()
                        .stream()
                        .map(g -> makeSalvoDTO(g))
                        .collect(toList());
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
                        .collect(Collectors.toList());
        }

        private List<String> getCellList(Set<SalvoLocation> salvoLocations){
                return salvoLocations
                        .stream()
                        .sorted(Comparator.comparing(SalvoLocation::getId))
                        .map(sL -> sL.getSalvoLocationCell())
                        .collect(Collectors.toList());
        }

        @RequestMapping("/gpScores/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerScoresDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                //collect score data for one gamePlayer only
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("player", gamePlayer.getPlayer().getEmail());
                dto.put("scores", getPlayerScores(gamePlayer.getPlayer().getScores()));

                return dto;
        }

        private List<Double> getPlayerScores(Set<GameScore> scores) {
                return scores
                        .stream()
                        .sorted(Comparator.comparing(GameScore::getId))
                        .map(s -> s.getScore())
                        .collect(Collectors.toList());
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

        private Map<String, Object> makeScoresDTO(GamePlayer gamePlayer) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("gamePlayer_email", gamePlayer.getPlayer().getEmail());
                dto.put("gamePlayer_scores", makeScoresListDTO(gamePlayer.getPlayer().getScores()));

                return dto;
        }

        private List<Double> makeScoresListDTO(Set<GameScore> scores) {
                return scores.stream().map(s -> s.getScore()).collect(Collectors.toList());
        }

        @RequestMapping("/gpSalvoLocations/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerSalvoLocationDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                //collect salvo location info for one gamePlayer only
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("salvoLocations", getSalvoLocations(gamePlayer.getSalvoes()));
                return dto;
        }

        private List<List<String>> getSalvoLocations(Set<Salvo> salvoes) {
                return salvoes
                        .stream()
                        .map(s -> makeSalvoLocationsList(s.getSalvoLocations()))
                        .collect(Collectors.toList());
        }

        private List<String> makeSalvoLocationsList(Set<SalvoLocation> salvoLocations) {
                return salvoLocations
                        .stream()
                        .map(s -> s.getSalvoLocationCell())
                        .collect(Collectors.toList());
        }

        @RequestMapping("/gpShipLocations/{gamePlayer_Id}")
        public Map<String, Object> makeGamePlayerShipLocationDTO(@PathVariable Long gamePlayer_Id) {
                Map<String, Object> dto = new LinkedHashMap<>();

                //collect info for one gamePlayer only
                GamePlayer gamePlayer = gp_repository.findOne(gamePlayer_Id);
                dto.put("shipLocations", getShipLocations(gamePlayer.getShips()));
                return dto;
        }

        private List<List<String>> getShipLocations(Set<Ship> ships) {
                return ships
                        .stream()
                        .map(ship -> makeShipLocationsList(ship.getShipLocations()))
                        .collect(Collectors.toList());
        }

        private List<String> makeShipLocationsList(Set<ShipLocation> shipLocations) {
                return shipLocations
                        .stream()
                        .map(sL -> sL.getShipLocationCell())
                        .collect(Collectors.toList());
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

        private Map<String, Object> makeShipDTO(GamePlayer gamePlayer) {
                Map<String, Object> dto = new LinkedHashMap<String, Object>();

                dto.put("gamePlayer_id", gamePlayer.getId());
                dto.put("shipLocations", makeShipLocationsDTO(gamePlayer.getShips()));

                return dto;
        }

        private List<Set<ShipLocation>> makeShipLocationsDTO(Set<Ship> ships) {
                return ships.stream().map(s -> s.getShipLocations()).collect(Collectors.toList());
        }

        //get games list info, including players and scores
        @RequestMapping("/games")
        public List<Object> getAllGames() {
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
                        .collect(Collectors.toList());
        }

        private List<Double> getScoresArray(Set<GameScore> scores) {
                return scores
                        .stream()
                        .sorted(Comparator.comparing(GameScore::getId))
                        .map(score -> score.getScore())
                        .collect(Collectors.toList());
        }

}