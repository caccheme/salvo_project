package salvo.model;

import javax.persistence.*;

@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
    private String shipType;

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

    @Override
    public String toString() {
        return String.format(
                "Ship[id=%d, shipType='%s']",
                id, shipType);
    }

}