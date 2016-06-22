package salvo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    long id; //changed to this for step 3 list id's part of task 2
    private Date creationDate;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GamePlayer> players;

    public Game() {
        creationDate = new Date();
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date date) {
        this.creationDate = date;
    }

    public Game(long id, Date date) {
        this.id = id;
        this.creationDate = date;
    }

//    public Object getGame(Game game){ return game;}

    @Override
    public String toString() {
        String result = String.format(
                "Game [id=%d, date='%s']%n",
                id, creationDate);
        return result;
    }

    @JsonIgnore
    public Set<GamePlayer> getPlayers() {
        return players;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
