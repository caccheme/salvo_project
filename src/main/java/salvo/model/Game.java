package salvo.model;

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

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GameScore> scores;

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

    public Set<GamePlayer> getPlayers() {
        return players;
    }

    public Set<GameScore> getScores() { return scores; }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
