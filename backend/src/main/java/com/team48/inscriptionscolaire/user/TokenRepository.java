package com.team48.inscriptionscolaire.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    Optional<Token> findByToken(String Token);

    Optional<Token> findByTokenHash(String tokenHash);

    @Query(value = """
          select t from Token t inner join User u
          on t.user.id = u.id
          where u.id = :id and (t.expired = false or t.revoked = false)
          """)
        // La ligne suivante est la plus importante : elle DOIT retourner List<Token>
    List<Token> findAllValidTokenByUser(Integer id);

}
