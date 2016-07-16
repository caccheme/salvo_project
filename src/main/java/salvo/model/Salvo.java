package salvo.model;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
    private int turn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    @OneToMany(mappedBy="salvo", fetch=FetchType.EAGER)
    Set<SalvoLocation> salvoLocations;

    public Salvo() {}

    public Salvo(GamePlayer gamePlayer, int turn) {
        this.gamePlayer = gamePlayer;
        this.turn = turn;
    }

    public int getTurn() {
        return turn;
    }

    public void setTurn(int turn) {
        this.turn = turn;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public Set<SalvoLocation> getSalvoLocations() {
        return salvoLocations;
    }
}