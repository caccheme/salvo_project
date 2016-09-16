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

 //one gamePlayer to one score   //pretending it's one to many...
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer; //gamePlayer reference

    //one game to many scores
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game; //game reference

    public GameScore() { finishDate = new Date(); }

    public GameScore(Game game, GamePlayer gamePlayer, double score) {
        this.game = game;
        this.gamePlayer = gamePlayer;
        this.score = score;
    }

    public Date getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(Date date) {
        this.finishDate = date;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(Player player) {
        this.gamePlayer = gamePlayer;
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
