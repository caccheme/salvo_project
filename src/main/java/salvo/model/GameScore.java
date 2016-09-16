package salvo.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class GameScore {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private Date finishDate;
    private double score;

    //one player to many scores
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player; //player reference

    //one game to many scores
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game; //game reference

    public GameScore() { finishDate = new Date(); }

    public GameScore(Game game, Player player, double score) {
        this.game = game;
        this.player = player;
        this.score = score;
    }

    public Date getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(Date date) {
        this.finishDate = date;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

}