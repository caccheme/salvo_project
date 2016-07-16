package salvo.model;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class SalvoLocation {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    long id;
    private String salvoLocationCell;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="salvo_id")
    private Salvo salvo;

    public SalvoLocation() { }

    public SalvoLocation(Salvo salvo, String salvoLocationCell) {
        this.salvo = salvo;
        this.salvoLocationCell = salvoLocationCell;
    }

    public String getSalvoLocationCell() {
        return salvoLocationCell;
    }

    public void setSalvoLocationCell(String salvoLocationCell) {
        this.salvoLocationCell = salvoLocationCell;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @JsonIgnore //prevent infinite looping
    public Salvo getSalvo() {
        return salvo;
    }

    public void setSalvo(Salvo salvo) {
        this.salvo = salvo;
    }

}