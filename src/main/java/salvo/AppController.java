package salvo;

import org.springframework.beans.factory.annotation.Autowired;
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
        @Autowired
        private PlayerRepository p_repository;

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
                dto.put("players", makePlayerList(game.getPlayers()));

                return dto;
        }

        private List<Player> makePlayerList(Set<GamePlayer> gamePlayers) {
                return gamePlayers
                        .stream()
                        .map(gamePlayer -> gamePlayer.getPlayer())
                        .sorted(Comparator.comparing(Player::getId))
                        .collect(Collectors.toList());
        }

}