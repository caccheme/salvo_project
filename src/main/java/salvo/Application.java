package salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import salvo.model.*;

@SpringBootApplication
public class Application {

//	private Player jack, chloe, kim, david, michelle;
	private Game game1, game2, game3, game4, game5, game6;
	private GamePlayer gp1, gp2, gp3, gp4, gp5;
	private Ship ship1, ship2, ship3, ship4, ship5, ship6, ship7;
	private ShipLocation sL1, sL2, sL3, sL4, sL5, sL6;

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
			Player kim = playerRepository.save(new Player("kim_bauer@gmail.com"));
			Player david = playerRepository.save(new Player("palmer@whitehouse.gov"));
			Player michelle = playerRepository.save(new Player("m.dessler@ctu.gov"));
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

			// create new shiplocation objects to hold all cell location of ships
			// cell locations of ship1 cruiser for jack in game1
			sl_repository.save(new ShipLocation(ship1, "H2"));
			sl_repository.save(new ShipLocation(ship1, "H3"));
			sl_repository.save(new ShipLocation(ship1, "H4"));

			//cell locations of ship2 destroyer for jack in game1
			sl_repository.save(new ShipLocation(ship2, "E1"));
			sl_repository.save(new ShipLocation(ship2, "F1"));

			//cell locations of ship3 destroy for jack in game1
			sl_repository.save(new ShipLocation(ship3, "B4"));
			sl_repository.save(new ShipLocation(ship3, "B5"));

			//cell locations of ship4 cruiser for chloe in game1
			sl_repository.save(new ShipLocation(ship4, "B5"));
			sl_repository.save(new ShipLocation(ship4, "C5"));
			sl_repository.save(new ShipLocation(ship4, "D5"));

			//cell locations of ship5 destroyer for chloe in game1
			sl_repository.save(new ShipLocation(ship5, "F1"));
			sl_repository.save(new ShipLocation(ship5, "F2"));

			//cell locations of ship6 cruiser for jack in game2
			sl_repository.save(new ShipLocation(ship6, "B5"));
			sl_repository.save(new ShipLocation(ship6, "C5"));
			sl_repository.save(new ShipLocation(ship6, "D5"));

		};
	}

}
