package salvo.model;


import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class ShipLocation {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
    private String shipLocationCell;

    public ShipLocation() { }

    public ShipLocation(String shipType) {
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

    @Override
    public String toString() {
        return String.format(
                "Ship[id=%d, shipLocationCell='%s']",
                id, shipLocationCell);
    }

}