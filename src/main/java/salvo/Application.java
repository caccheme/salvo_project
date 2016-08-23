package salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import salvo.model.*;

@SpringBootApplication
public class Application {

	//	private Player jack, chloe, kim, david, michelle;
	private Game game1, game2, game3, game4, game5, game6, game7, game8;
	private GamePlayer gp1, gp2, gp3, gp4, gp5, gp6, gp7, gp8, gp9, gp10, gp11, gp12, gp13, gp14;
	private Ship ship1, ship2, ship3, ship4, ship5, ship6, ship7, ship8, ship9, ship10, ship11, ship12,
		ship13, ship14, ship15, ship16, ship17, ship18, ship19, ship20, ship21, ship22, ship23, ship24,
		ship25, ship26, ship27;
	private Salvo salvo1, salvo2, salvo3, salvo4, salvo5, salvo6, salvo7, salvo8, salvo9,
		salvo10, salvo11, salvo12, salvo13, salvo14, salvo15, salvo16, salvo17, salvo18,
		salvo19, salvo20, salvo21;

	public static void main(String[] args) {
		SpringApplication.run(Application.class);
	}

	@Bean
	public CommandLineRunner demo(PlayerRepository playerRepository,
								  GameRepository game_repository,
								  GamePlayerRepository gp_repository,
								  ShipRepository ship_repository,
								  ShipLocationRepository sl_repository,
								  SalvoRepository salvo_repository,
								  SalvoLocationRepository salvo_loc_repo,
								  GameScoreRepository score_repo) {
		return (args) -> {
			// save a couple of players
			Player jack = playerRepository.save(new Player("j.bauer@ctu.gov", "24"));
			Player chloe = playerRepository.save(new Player("c.obrian@ctu.gov", "42"));
			Player kim = playerRepository.save(new Player("kim_bauer@gmail.com", "kb"));
			Player tony = playerRepository.save(new Player("t.almeida@ctu.gov", "mole"));

			// save empty games
			game1 = game_repository.save(new Game());
			game2 = game_repository.save(new Game());
			game3 = game_repository.save(new Game());
			game4 = game_repository.save(new Game());
			game5 = game_repository.save(new Game());
			game6 = game_repository.save(new Game());
			game8 = game_repository.save(new Game());

//			 save players to games by making new GamePlayer objects
			// jack and chloe to game1
			gp1 = gp_repository.save(new GamePlayer(game1, jack));
				// save new ships to jack, game 1
				ship1 = ship_repository.save(new Ship("destroyer", gp1));
					// cell locations of ship1 destroyer for jack in game1
					sl_repository.save(new ShipLocation(ship1, "H2"));
					sl_repository.save(new ShipLocation(ship1, "H3"));
					sl_repository.save(new ShipLocation(ship1, "H4"));

				ship2 = ship_repository.save(new Ship("submarine", gp1));
					//cell locations of ship2 submarine for jack in game1
					sl_repository.save(new ShipLocation(ship2, "E1"));
					sl_repository.save(new ShipLocation(ship2, "F1"));
					sl_repository.save(new ShipLocation(ship2, "G1"));

				ship3 = ship_repository.save(new Ship("patrol boat", gp1));
					//cell locations of ship3 patrol boat for jack in game1
					sl_repository.save(new ShipLocation(ship3, "B4"));
					sl_repository.save(new ShipLocation(ship3, "B5"));
			gp2 = gp_repository.save(new GamePlayer(game1, chloe));
				// save new ships to chloe, game 1
				ship4 = ship_repository.save(new Ship("destroyer", gp2));
					//cell locations of ship4 destroyer for chloe in game1
					sl_repository.save(new ShipLocation(ship4, "B5"));
					sl_repository.save(new ShipLocation(ship4, "C5"));
					sl_repository.save(new ShipLocation(ship4, "D5"));

				ship5 = ship_repository.save(new Ship("patrol boat", gp2));
					//cell locations of ship5 destroyer for chloe in game1
					sl_repository.save(new ShipLocation(ship5, "F1"));
					sl_repository.save(new ShipLocation(ship5, "F2"));

			//jack and chloe to game 2
			gp3 = gp_repository.save(new GamePlayer(game2, jack));
				// save ships to jack, game 2
				ship6 = ship_repository.save(new Ship("destroyer", gp3));
					//cell locations of ship6 cruiser for jack in game2
					sl_repository.save(new ShipLocation(ship6, "B5"));
					sl_repository.save(new ShipLocation(ship6, "C5"));
					sl_repository.save(new ShipLocation(ship6, "D5"));

				ship7 = ship_repository.save(new Ship("patrol boat", gp3));
					//cell locations of ship7 patrol boat for jack in game2
					sl_repository.save(new ShipLocation(ship7, "C6"));
					sl_repository.save(new ShipLocation(ship7, "C7"));

			gp4 = gp_repository.save(new GamePlayer(game2, chloe));
				//save new ships to chloe, game2
				ship8 = ship_repository.save(new Ship("submarine", gp4));
					//cell locations of ship8 submarine for chloe in game2
					sl_repository.save(new ShipLocation(ship8, "A2"));
					sl_repository.save(new ShipLocation(ship8, "A3"));
					sl_repository.save(new ShipLocation(ship8, "A4"));

				ship9 = ship_repository.save(new Ship("patrol boat", gp4));
					//cell locations of ship9 patrol boat for chloe in game2
					sl_repository.save(new ShipLocation(ship9, "G6"));
					sl_repository.save(new ShipLocation(ship9, "H6"));

			//chloe and tony to game3
			gp5 = gp_repository.save(new GamePlayer(game3, chloe));
				//save new ships to chloe, game3
				ship10 = ship_repository.save(new Ship("destroyer", gp5));
					//cell locations of ship10 destroyer for chloe in game 3
					sl_repository.save(new ShipLocation(ship10, "B5"));
					sl_repository.save(new ShipLocation(ship10, "C5"));
					sl_repository.save(new ShipLocation(ship10, "D5"));

				ship11 = ship_repository.save(new Ship("patrol boat", gp5));
					//cell locations of ship11 patrol boat for chloe in game3
					sl_repository.save(new ShipLocation(ship11, "C6"));
					sl_repository.save(new ShipLocation(ship11, "C7"));

			gp6 = gp_repository.save(new GamePlayer(game3, tony));
				//save new ships to tony, game3
				ship12 = ship_repository.save(new Ship("submarine", gp6));
					//cell locations of ship12 submarine for tony in game3
					sl_repository.save(new ShipLocation(ship12, "A2"));
					sl_repository.save(new ShipLocation(ship12, "A3"));
					sl_repository.save(new ShipLocation(ship12, "A4"));

				ship13 = ship_repository.save(new Ship("patrol boat", gp6));
					//cell locations of ship13 patrol boat for tony in game3
					sl_repository.save(new ShipLocation(ship13, "G6"));
					sl_repository.save(new ShipLocation(ship13, "H6"));

			// jack and chloe to game4
			gp7 = gp_repository.save(new GamePlayer(game4, jack));
				//save new ships to jack, game4
				ship16 = ship_repository.save(new Ship("submarine", gp7));
					//cell locations of ship16 for jack in game4
					sl_repository.save(new ShipLocation(ship16, "A2"));
					sl_repository.save(new ShipLocation(ship16, "A3"));
					sl_repository.save(new ShipLocation(ship16, "A4"));

				ship17 = ship_repository.save(new Ship("patrol boat", gp7));
					//cell locations of ship17 for jack in game4
					sl_repository.save(new ShipLocation(ship17, "G6"));
					sl_repository.save(new ShipLocation(ship17, "H6"));

			gp8 = gp_repository.save(new GamePlayer(game4, chloe));
				//save new ships to chloe, game4
				ship14 = ship_repository.save(new Ship("destroyer", gp8));
					//cell locations of ship14 destroyer for chloe in game4
					sl_repository.save(new ShipLocation(ship14, "B5"));
					sl_repository.save(new ShipLocation(ship14, "C5"));
					sl_repository.save(new ShipLocation(ship14, "D5"));

				ship15 = ship_repository.save(new Ship("patrol boat", gp8));
					//cell locations of ship15 patrol boat for chloe in game4
					sl_repository.save(new ShipLocation(ship15, "C6"));
					sl_repository.save(new ShipLocation(ship15, "C7"));

			// tony and jack to game5
			gp9 = gp_repository.save(new GamePlayer(game5, tony));
				//save new ships to tony, game5
				ship18 = ship_repository.save(new Ship("destroyer", gp9));
					//cell locations of ship18 for tony in game5
					sl_repository.save(new ShipLocation(ship18, "B5"));
					sl_repository.save(new ShipLocation(ship18, "C5"));
					sl_repository.save(new ShipLocation(ship18, "D5"));

				ship19 = ship_repository.save(new Ship("patrol boat", gp9));
					//cell locations of ship19 for tony	 in game5
					sl_repository.save(new ShipLocation(ship19, "C6"));
					sl_repository.save(new ShipLocation(ship19, "C7"));

			gp10 = gp_repository.save(new GamePlayer(game5, jack));
				//save new ships to jack, game5
				ship20 = ship_repository.save(new Ship("submarine", gp10));
					//cell locations of ship20 for jack in game5
					sl_repository.save(new ShipLocation(ship20, "A2"));
					sl_repository.save(new ShipLocation(ship20, "A3"));
					sl_repository.save(new ShipLocation(ship20, "A4"));

				ship21 = ship_repository.save(new Ship("patrol boat", gp10));
					//cell locations of ship21 for jack in game5
					sl_repository.save(new ShipLocation(ship21, "G6"));
					sl_repository.save(new ShipLocation(ship21, "H6"));

			// kim to game6
			gp11 = gp_repository.save(new GamePlayer(game6, kim));
				//save new ships to kim, game6
				ship22 = ship_repository.save(new Ship("destroyer", gp11));
					//cell locations of ship22 for kim in game6
					sl_repository.save(new ShipLocation(ship22, "B5"));
					sl_repository.save(new ShipLocation(ship22, "C5"));
					sl_repository.save(new ShipLocation(ship22, "D5"));

				ship23 = ship_repository.save(new Ship("patrol boat", gp11));
					//cell locations of ship23 for kim in game6
					sl_repository.save(new ShipLocation(ship23, "C6"));
					sl_repository.save(new ShipLocation(ship23, "C7"));

			// tony to game7
			gp12 = gp_repository.save(new GamePlayer(game7, tony));

			// kim and tony to game8
			gp13 = gp_repository.save(new GamePlayer(game8, kim));
				//save new ships to kim, game8
				ship24 = ship_repository.save(new Ship("destroyer", gp13));
					//cell locations of ship24 for kim in game8
					sl_repository.save(new ShipLocation(ship24, "B5"));
					sl_repository.save(new ShipLocation(ship24, "C5"));
					sl_repository.save(new ShipLocation(ship24, "D5"));

				ship25 = ship_repository.save(new Ship("patrol boat", gp13));
					//cell locations of ship25 for kim in game8
					sl_repository.save(new ShipLocation(ship25, "C6"));
					sl_repository.save(new ShipLocation(ship25, "C7"));

			gp14 = gp_repository.save(new GamePlayer(game8, tony));
				//save new ships to tony, game8
				ship26 = ship_repository.save(new Ship("submarine", gp14));
					//cell locations of ship26 for tony in game8
					sl_repository.save(new ShipLocation(ship26, "A2"));
					sl_repository.save(new ShipLocation(ship26, "A3"));
					sl_repository.save(new ShipLocation(ship26, "A4"));

				ship27 = ship_repository.save(new Ship("patrol boat", gp14));
					//cell locations of ship27 for tony in game8
					sl_repository.save(new ShipLocation(ship27, "G6"));
					sl_repository.save(new ShipLocation(ship27, "H6"));



			//create salvo for Jack(gp1) game1 turn 1&2
			salvo1 = salvo_repository.save(new Salvo(gp1, 1));
				//create salvo locations for Jack(gp1) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo1, "B5"));
				salvo_loc_repo.save(new SalvoLocation(salvo1, "C5"));
				salvo_loc_repo.save(new SalvoLocation(salvo1, "F1"));
			salvo2 = salvo_repository.save(new Salvo(gp1, 2));
				//create salvo locations for Jack(gp1) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo2, "F2"));
				salvo_loc_repo.save(new SalvoLocation(salvo2, "D5"));

			// create salvo for Chloe(gp2) game1 turn 1&2
			salvo3 = salvo_repository.save(new Salvo(gp2, 1));
				//create salvo locations for Chloe(gp2) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo3, "B4"));
				salvo_loc_repo.save(new SalvoLocation(salvo3, "B5"));
				salvo_loc_repo.save(new SalvoLocation(salvo3, "B6"));
			salvo4 = salvo_repository.save(new Salvo(gp2, 2));
				//create salvo locations for Chloe(gp2) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo4, "E1"));
				salvo_loc_repo.save(new SalvoLocation(salvo4, "H3"));
				salvo_loc_repo.save(new SalvoLocation(salvo4, "A2"));

			//create salvo for Jack(gp3) game2 turn 1&2
			salvo5 = salvo_repository.save(new Salvo(gp3, 1));
				//create salvo locations for Jack(gp3) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo5, "A2"));
				salvo_loc_repo.save(new SalvoLocation(salvo5, "A4"));
				salvo_loc_repo.save(new SalvoLocation(salvo5, "G6"));
			salvo6 = salvo_repository.save(new Salvo(gp3, 2));
				//create salvo locations for Jack(gp3) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo6, "A3"));
				salvo_loc_repo.save(new SalvoLocation(salvo6, "H6"));

			// create salvo for Chloe(gp4) game2 turn 1&2
			salvo7 = salvo_repository.save(new Salvo(gp4, 1));
				//create salvo locations for Chloe(gp2) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo7, "B5"));
				salvo_loc_repo.save(new SalvoLocation(salvo7, "D5"));
				salvo_loc_repo.save(new SalvoLocation(salvo7, "C7"));
			salvo8 = salvo_repository.save(new Salvo(gp4, 2));
				//create salvo locations for Chloe(gp2) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo8, "C5"));
				salvo_loc_repo.save(new SalvoLocation(salvo8, "C6"));

			//create salvo for Chloe(gp5) game3 turn 1&2
			salvo9 = salvo_repository.save(new Salvo(gp5, 1));
				//create salvo locations for Chloe(gp5) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo9, "G6"));
				salvo_loc_repo.save(new SalvoLocation(salvo9, "H6"));
				salvo_loc_repo.save(new SalvoLocation(salvo9, "A4"));
			salvo10 = salvo_repository.save(new Salvo(gp5, 2));
				//create salvo locations for Chloe(gp5) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo10, "A2"));
				salvo_loc_repo.save(new SalvoLocation(salvo10, "A3"));
				salvo_loc_repo.save(new SalvoLocation(salvo10, "D8"));

			// create salvo for Tony(gp6) game3 turn 1&2
			salvo11 = salvo_repository.save(new Salvo(gp6, 1));
				//create salvo locations for Tony(gp6) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo11, "H1"));
				salvo_loc_repo.save(new SalvoLocation(salvo11, "H2"));
				salvo_loc_repo.save(new SalvoLocation(salvo11, "H3"));
			salvo12 = salvo_repository.save(new Salvo(gp6, 2));
				//create salvo locations for Tony(gp6) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo12, "E1"));
				salvo_loc_repo.save(new SalvoLocation(salvo12, "F2"));
				salvo_loc_repo.save(new SalvoLocation(salvo12, "G3"));

			//create salvo for Chloe(gp8) game4 turn 1&2
			salvo13 = salvo_repository.save(new Salvo(gp8, 1));
				//create salvo locations for Chloe(gp8) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo13, "A3"));
				salvo_loc_repo.save(new SalvoLocation(salvo13, "A4"));
				salvo_loc_repo.save(new SalvoLocation(salvo13, "F7"));
			salvo14 = salvo_repository.save(new Salvo(gp8, 2));
				//create salvo locations for Chloe(gp8) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo14, "A2"));
				salvo_loc_repo.save(new SalvoLocation(salvo14, "G6"));
				salvo_loc_repo.save(new SalvoLocation(salvo14, "H6"));

			// create salvo for Jack(gp7) game4 turn 1&2
			salvo15 = salvo_repository.save(new Salvo(gp2, 1));
				//create salvo locations for Jack(gp7) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo15, "B5"));
				salvo_loc_repo.save(new SalvoLocation(salvo15, "C6"));
				salvo_loc_repo.save(new SalvoLocation(salvo15, "H1"));
			salvo16 = salvo_repository.save(new Salvo(gp2, 2));
				//create salvo locations for Jack(gp7) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo16, "C5"));
				salvo_loc_repo.save(new SalvoLocation(salvo16, "C7"));
				salvo_loc_repo.save(new SalvoLocation(salvo16, "D5"));

			//create salvo for Tony(gp9) game5 turn 1&2
			salvo17 = salvo_repository.save(new Salvo(gp9, 1));
				//create salvo locations for Tony(gp9) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo17, "A1"));
				salvo_loc_repo.save(new SalvoLocation(salvo17, "A2"));
				salvo_loc_repo.save(new SalvoLocation(salvo17, "A3"));
			salvo18 = salvo_repository.save(new Salvo(gp9, 2));
				//create salvo locations for Tony(gp9) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo18, "G6"));
				salvo_loc_repo.save(new SalvoLocation(salvo18, "G7"));
				salvo_loc_repo.save(new SalvoLocation(salvo18, "G8"));

			// create salvo for Jack(gp10) game5 turn 1,2,&3
			salvo19 = salvo_repository.save(new Salvo(gp10, 1));
				//create salvo locations for Jack(gp10) turn 1
				salvo_loc_repo.save(new SalvoLocation(salvo19, "B5"));
				salvo_loc_repo.save(new SalvoLocation(salvo19, "B6"));
				salvo_loc_repo.save(new SalvoLocation(salvo19, "C7"));
			salvo20 = salvo_repository.save(new Salvo(gp10, 2));
				//create salvo locations for Jack(gp10) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo20, "C6"));
				salvo_loc_repo.save(new SalvoLocation(salvo20, "D6"));
				salvo_loc_repo.save(new SalvoLocation(salvo20, "E6"));
			salvo21 = salvo_repository.save(new Salvo(gp10, 3));
				//create salvo locations for Jack(gp10) turn 2
				salvo_loc_repo.save(new SalvoLocation(salvo21, "H1"));
				salvo_loc_repo.save(new SalvoLocation(salvo21, "H8"));




			//create winning '1' gameScore for jack in game1
			score_repo.save(new GameScore(game1, jack, 1));

			//create losing '0' gameScore for chloe in game1
			score_repo.save(new GameScore(game1, chloe, 0));

			//create tie scores '0.5' for game2 for jack and chloe
			score_repo.save(new GameScore(game2, jack, 0.5));
			score_repo.save(new GameScore(game2, chloe, 0.5));

			//create winning score for chloe in game3
			score_repo.save(new GameScore(game3, chloe, 1));

			//create losing score for tony in game3
			score_repo.save(new GameScore(game3, tony, 0));

			//create tie scores for jack and chloe in game4
			score_repo.save(new GameScore(game4, jack, 0.5));
			score_repo.save(new GameScore(game4, chloe, 0.5));

		};
	}

}