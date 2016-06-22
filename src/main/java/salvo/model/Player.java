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

//	//commented out all firstName, lastName and Name code per Chris's update to player_id and player_email
//	private String firstName;
//	private String lastName;

	@OneToMany(mappedBy="player", fetch=FetchType.EAGER)
	Set<GamePlayer> games;

	public Player() { }

//	public String getFirstName() {
//		return firstName;
//	}
//
//	public void setFirstName(String _firstName) {
//		firstName = _firstName;
//	}
//
//	public String getLastName() {
//		return lastName;
//	}
//
//	public void setLastName(String _lastName) {
//		lastName = _lastName;
//	}
//
//	public Player(String _firstName, String _lastName) {
//		firstName = _firstName;
//		lastName = _lastName;
//	}

	public Player(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@JsonIgnore
	public Set<GamePlayer> getGames() {
		return games;
	}

	@Override
	public String toString() {
		return String.format(
			"Player[id=%d, email='%s']",
			id, email);
	}

//	public String getName() {
//		return firstName + " " + lastName;
//	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
