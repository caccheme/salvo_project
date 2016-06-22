package salvo.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// old repository code
//public interface GameRepository extends PagingAndSortingRepository<Game, Long> {
//
//    List<Game> findById(@Param("id") long id);
//
//}

@RepositoryRestResource
public interface GameRepository extends JpaRepository<Game, Long> {

}