package salvo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Player {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	long id;
	private String email;
	private String password;

	@OneToMany(mappedBy="player", fetch=FetchType.EAGER)
	Set<GamePlayer> games;

	@OneToMany(mappedBy="player", fetch=FetchType.EAGER)
	Set<GameScore> scores;

	public Player() { }


	public Player(String email, String password) {
		this.email = email;
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {return password;}

	public void setPassword(String password) {this.password = password; }

	@JsonIgnore
	public Set<GamePlayer> getGames() {
		return games;
	}

	@JsonIgnore
	public Set<GameScore> getScores() {
		return scores;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
