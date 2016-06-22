package salvo.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// old repository code
//public interface GamePlayerRepository extends PagingAndSortingRepository<GamePlayer, Long> {
//
//    List<GamePlayer> findById(@Param("id") long id);
//
//}

@RepositoryRestResource
public interface GamePlayerRepository extends JpaRepository<GamePlayer, Long> {

}