package salvo.model;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
    private String shipType;

    @OneToMany(mappedBy="ship", fetch=FetchType.EAGER)
    Set<ShipLocation> shipLocations;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    public Ship() { }

    public Ship(String shipType) {
        this.shipType = shipType;
    }

    public String getShipType() {
        return shipType;
    }

    public void setShipType(String shipType) {
        this.shipType = shipType;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Set<ShipLocation> getShipLocations() {
        return shipLocations;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    @Override
    public String toString() {
        return String.format(
                "Ship[id=%d, shipType='%s']",
                id, shipType);
    }

}