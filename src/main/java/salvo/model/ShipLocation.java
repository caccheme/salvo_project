package salvo.model;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ShipLocation {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
//    private String shipLocationCell;

    @ElementCollection
    @Column(name="shipLocationCell")
    private List<String> shipLocationCells = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="ship_id")
    private Ship ship;

    public ShipLocation() { }

    public ShipLocation(Ship ship, List<String> shipLocationCells) {
        this.ship = ship;
        this.shipLocationCells = shipLocationCells;
    }

    public List<String> getShipLocationCells() {
        return shipLocationCells;
    }

    public void setShipLocationCells(List<String> shipLocationCells) {
        this.shipLocationCells = shipLocationCells;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Ship getShip() {
        return ship;
    }

    public void setShip(Ship ship) {
        this.ship = ship;
    }

    @Override
    public String toString() {
        return String.format(
                "Ship[id=%d, shipLocationCells='%s']",
                id, shipLocationCells);
    }

}