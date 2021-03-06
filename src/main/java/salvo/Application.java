package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import salvo.model.*;

import java.util.Arrays;


@SpringBootApplication
public class Application extends SpringBootServletInitializer{

	//	private Player jack, chloe, kim, david, michelle;
	private Game game1, game2, game3, game4, game5, game6;
	private GamePlayer gp1, gp2, gp3;

	public static void main(String[] args) {
		SpringApplication.run(Application.class);
	}

	@Bean
	public CommandLineRunner demo(PlayerRepository playerRepository,
								  GameRepository game_repository,
								  GamePlayerRepository gp_repository,
								  ShipRepository ship_repository,
								  SalvoRepository salvo_repository,
								  GameScoreRepository score_repo) {
		return (args) -> {
			// save a couple of players
			Player jack = playerRepository.save(new Player("j.bauer@ctu.gov", "24"));
			Player chloe = playerRepository.save(new Player("c.obrian@ctu.gov", "42"));
			Player kim = playerRepository.save(new Player("kim_bauer@gmail.com", "kb"));
			Player david = playerRepository.save(new Player("palmer@whitehouse.gov", "whatev"));
			Player michelle = playerRepository.save(new Player("m.dessler@ctu.gov", "newPass"));
			Player tim = playerRepository.save(new Player("t.almeida@ctu.gov", "mole"));

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
			ship_repository.save(new Ship("cruiser", gp1, Arrays.asList("H2", "H3", "H4")));
			ship_repository.save(new Ship("destroyer", gp1, Arrays.asList("E1", "F1")));
			ship_repository.save(new Ship("destroyer", gp1, Arrays.asList("B4", "B5")));

			// save new ships to chloe, game 1
			ship_repository.save(new Ship("cruiser", gp2, Arrays.asList("B5", "C5", "D5")));
			ship_repository.save(new Ship("destroyer", gp2, Arrays.asList("F1", "F2")));

			// save one ship to jack, game 2
			ship_repository.save(new Ship("cruiser", gp3, Arrays.asList("B5", "C5", "D5")));

			//create salvo for Jack(gp1) and Chloe(gp2) turn 1 & 2 of game1
			salvo_repository.save(new Salvo(gp1, 1, Arrays.asList("B5", "C5", "F1")));
			salvo_repository.save(new Salvo(gp1, 2, Arrays.asList("F2", "D5")));
			salvo_repository.save(new Salvo(gp2, 1, Arrays.asList("B4", "B5", "B6")));
			salvo_repository.save(new Salvo(gp2, 2, Arrays.asList("E1", "H3", "A2")));

			//create winning '1' gameScore for jack in game1
			score_repo.save(new GameScore(game1, jack, 1));

			//create losing '0' gameScore for chloe in game1
			score_repo.save(new GameScore(game1, chloe, 0));

			//create tie scores '0.5' for game2 for jack and chloe
			score_repo.save(new GameScore(game2, jack, 0.5));
			score_repo.save(new GameScore(game2, chloe, 0.5));

			//create winning score for chloe in game3
			score_repo.save(new GameScore(game3, chloe, 1));

			//create losing score for tim in game3
			score_repo.save(new GameScore(game3, tim, 0));

			//create tie scores for jack and chloe in game4
			score_repo.save(new GameScore(game4, jack, 0.5));
			score_repo.save(new GameScore(game4, chloe, 0.5));

		};
	}

}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

	@Autowired
	PlayerRepository playerRepository;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService());
	}

	@Bean
	UserDetailsService userDetailsService() {
		return new UserDetailsService() {

			@Override
			public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
				Player person = playerRepository.findOneByEmail(name);
				if (person != null) {

					return new User(person.getEmail(), person.getPassword(), AuthorityUtils.createAuthorityList("USER"));
				} else {
					throw new UsernameNotFoundException("Unknown user: " + name);
				}
			}
		};
	}
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.csrf().disable()
				.authorizeRequests()
				//allow access to games.html when not logged in
				.antMatchers("/games.html","/api/games", "/js/games.js",
								"/signup.html*","/api/players/**" , "/js/signup.js").permitAll()
				.anyRequest().authenticated()
				.and()
				.formLogin();
	}
}