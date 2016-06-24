package salvo.model;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private Date creationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player; //player reference

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game; //game reference

    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    Set<Ship> ships;

    public GamePlayer() { }

    public GamePlayer(Game game, Player player) {
        Date creationDate = new Date();
        this.game = game;
        this.player = player;
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

    public Set<Ship> getShips() {
        return ships;
    }

    @Override
    public String toString() {
        return String.format(
                "GamePlayer[id=%d, game='%s', player='%s']",
                id, game, player);
    }

}