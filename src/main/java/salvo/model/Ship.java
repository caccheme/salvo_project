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

    @Override
    public String toString() {
        return String.format(
                "Ship[id=%d, shipType='%s']",
                id, shipType);
    }

}