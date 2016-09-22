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

        private ResponseEntity<Map<String, Object>> makeResponse (Map<String, Object> dto, HttpStatus status){
                ResponseEntity result = new ResponseEntity(dto, status);

                return result;
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