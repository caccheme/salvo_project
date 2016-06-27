package salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import salvo.model.*;

import java.util.List;

@SpringBootApplication
public class Application {

//	private Player jack, chloe, kim, david, michelle;
	private Game game1, game2, game3, game4, game5, game6;
	private GamePlayer gp1, gp2, gp3, gp4, gp5;
	private Ship ship1, ship2, ship3, ship4, ship5, ship6;
	private List<String> list1, list2, list3, list4, list5, list6;

	public static void main(String[] args) {
		SpringApplication.run(Application.class);
	}

	@Bean
	public CommandLineRunner demo(PlayerRepository playerRepository,
								  GameRepository game_repository,
								  GamePlayerRepository gp_repository,
								  ShipRepository ship_repository,
								  ShipLocationRepository sl_repository) {
		return (args) -> {
			// save a couple of players
			Player jack = playerRepository.save(new Player("j.bauer@ctu.gov"));
			Player chloe = playerRepository.save(new Player("c.obrian@ctu.gov"));
			Player david = playerRepository.save(new Player("palmer@whitehouse.gov"));
			Player tim = playerRepository.save(new Player("t.almeida@ctu.gov"));

			// save empty games
			game1 = game_repository.save(new Game());
			game2 = game_repository.save(new Game());
			game3 = game_repository.save(new Game());
			game4 = game_repository.save(new Game());
			game5 = game_repository.save(new Game());
			game6 = game_repository.save(new Game());

//			 save players to games by making new GamePlayer objects
			// jack and chloe to game1
			gp1 = gp_repository.save(new GamePlayer(game1, jack));
			gp2 = gp_repository.save(new GamePlayer(game1, chloe));

			//jack and chloe to game 2
			gp3 = gp_repository.save(new GamePlayer(game2, jack));
			gp_repository.save(new GamePlayer(game2, chloe));

			//chloe and tim to game3
			gp_repository.save(new GamePlayer(game3, chloe));
			gp_repository.save(new GamePlayer(game3, tim));

			// jack and chloe to game4
			gp_repository.save(new GamePlayer(game4, jack));
			gp_repository.save(new GamePlayer(game4, chloe));

			// tim and jack to game5
			gp_repository.save(new GamePlayer(game5, tim));
			gp_repository.save(new GamePlayer(game5, jack));

			// david to game6
			gp_repository.save(new GamePlayer(game6, david));

			// save new ships to jack, game 1
			ship1 = ship_repository.save(new Ship("cruiser", gp1));
			ship2 = ship_repository.save(new Ship("destroyer", gp1));
			ship3 = ship_repository.save(new Ship("destroyer", gp1));

			// save new ships to chloe, game 1
			ship4 = ship_repository.save(new Ship("cruiser", gp2));
			ship5 = ship_repository.save(new Ship("destroyer", gp2));

			// save one ship to jack, game 2
			ship6 = ship_repository.save(new Ship("cruiser", gp3));

//When below is not commented out it builds fine but creates bean exception on bootRun

//			// create new shiplocation objects to hold all cell location lists of ships
//			// cell locations of ship1 cruiser for jack in game1 add to list1 and put in shipLocation object
//			list1.add("H2");
//			list1.add("H3");
//			list1.add("H4");
//			sl_repository.save(new ShipLocation(ship1, list1));
//
//			//cell locations of ship2 destroyer for jack in game1
//			list2.add("E1");
//			list2.add("F1");
//			sl_repository.save(new ShipLocation(ship2, list2));
//
//			//cell locations of ship3 destroy for jack in game1
//			list3.add("B4");
//			list3.add("B5");
//			sl_repository.save(new ShipLocation(ship3, list3));
//
//			//cell locations of ship4 cruiser for chloe in game1
//			list4.add("B5");
//			list4.add("C5");
//			list4.add("D5");
//			sl_repository.save(new ShipLocation(ship4, list4));
//
//			//cell locations of ship5 destroyer for chloe in game1
//			list5.add("F1");
//			list5.add("F2");
//			sl_repository.save(new ShipLocation(ship5, list5));
//
//			//cell locations of ship6 cruiser for jack in game2
//			list6.add("B5");
//			list6.add("C5");
//			list6.add("D5");
//			sl_repository.save(new ShipLocation(ship6, list6));
		};
	}

}
