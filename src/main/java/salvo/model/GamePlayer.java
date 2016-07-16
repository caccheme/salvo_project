package salvo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;
    private Date joinDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player; //player reference

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game; //game reference

    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    Set<Ship> ships;

    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    Set<Salvo> salvoes;

    public GamePlayer() { joinDate = new Date(); }

    public GamePlayer(Game game, Player player) {
        this.game = game;
        this.player = player;
    }

    public Date getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Date date) {
        this.joinDate = date;
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

    @JsonIgnore //to prevent infinite loop
    public Set<Ship> getShips() {
        return ships;
    }

    @JsonIgnore //to prevent infinite loop
    public Set<Salvo> getSalvoes() {
        return salvoes;
    }

    @Override
    public String toString() {
        return String.format(
                "GamePlayer[id=%d, game='%s', player='%s']",
                id, game, player);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}