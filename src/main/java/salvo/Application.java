package salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import salvo.model.*;

@SpringBootApplication
public class Application {

	private Player jack, chloe, kim, david, michelle;
	private Game game1, game2, game3;

	public static void main(String[] args) {
		SpringApplication.run(Application.class);
	}

	@Bean
	public CommandLineRunner demo(PlayerRepository playerRepository,
								  GameRepository game_repository, GamePlayerRepository gp_repository) {
		return (args) -> {
			// save a couple of players
			Player jack = playerRepository.save(new Player("j.bauer@ctu.gov"));
			Player chloe = playerRepository.save(new Player("c.obrian@ctu.gov"));
			Player kim = playerRepository.save(new Player("kim_bauer@gmail.com"));
			Player david = playerRepository.save(new Player("palmer@whitehouse.gov"));
			Player michelle = playerRepository.save(new Player("m.dessler@ctu.gov"));

			// save three empty games
			game1 = game_repository.save(new Game());
			game2 = game_repository.save(new Game());
			game3 = game_repository.save(new Game());

//			 save first 2 players to game1 by making new GamePlayer objects
			gp_repository.save(new GamePlayer(game1, jack));
			gp_repository.save(new GamePlayer(game1, chloe));

//			save player1 to game 2 by making new GamePlayer
			gp_repository.save(new GamePlayer(game2, jack));


		};
	}

}
