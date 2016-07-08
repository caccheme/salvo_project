package salvo.model;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class ShipLocation {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
    private String shipLocationCell;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="ship_id")
    private Ship ship;

    public ShipLocation() { }

    public ShipLocation(Ship ship, String shipLocationCell) {
        this.ship = ship;
        this.shipLocationCell = shipLocationCell;
    }

    public String getShipLocationCell() {
        return shipLocationCell;
    }

    public void setShipLocationCell(String shipLocationCell) {
        this.shipLocationCell = shipLocationCell;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @JsonIgnore //prevent infinite looping
    public Ship getShip() {
        return ship;
    }

    public void setShip(Ship ship) {
        this.ship = ship;
    }

    @Override
    public String toString() {
        return String.format(
                "Ship[id=%d, shipLocationCell='%s']",
                id, shipLocationCell);
    }

}