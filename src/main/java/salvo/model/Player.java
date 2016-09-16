package salvo.model;

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

	public Set<GamePlayer> getGames() {
		return games;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
