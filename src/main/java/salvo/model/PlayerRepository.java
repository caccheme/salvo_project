package salvo.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// old repository code
//public interface PlayerRepository extends PagingAndSortingRepository<Player, Long> {
//
//	List<Player> findById(@Param("id") long id);
//
//}

@RepositoryRestResource
public interface PlayerRepository extends JpaRepository<Player, Long> {

}