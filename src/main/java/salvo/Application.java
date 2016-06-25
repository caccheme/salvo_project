package salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import salvo.model.*;

@SpringBootApplication
public class Application {

	private Player jack, chloe, kim, david, michelle;
	private Game game1, game2, game3, game4, game5, game6;

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
			Player tim = playerRepository.save(new Player("t.almeida@ctu.gov"));

			// save empty games
			game1 = game_repository.save(new Game());
			game2 = game_repository.save(new Game());
			game3 = game_repository.save(new Game());
			game4 = game_repository.save(new Game());
			game5 = game_repository.save(new Game());
			game6 = game_repository.save(new Game());

//			 save players to games by making new GamePlayer objects
			gp_repository.save(new GamePlayer(game1, jack));
			gp_repository.save(new GamePlayer(game1, chloe));

			gp_repository.save(new GamePlayer(game2, jack));
			gp_repository.save(new GamePlayer(game2, chloe));

			gp_repository.save(new GamePlayer(game3, chloe));
			gp_repository.save(new GamePlayer(game3, tim));

			gp_repository.save(new GamePlayer(game4, jack));
			gp_repository.save(new GamePlayer(game4, chloe));

			gp_repository.save(new GamePlayer(game5, tim));
			gp_repository.save(new GamePlayer(game5, jack));

			gp_repository.save(new GamePlayer(game6, david));



		};
	}

}
