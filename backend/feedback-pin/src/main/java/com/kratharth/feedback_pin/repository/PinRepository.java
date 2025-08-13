package com.kratharth.feedback_pin.repository;
import com.kratharth.feedback_pin.entity.Pin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PinRepository extends JpaRepository<Pin, String> {

    // Find pins by emailId
    List<Pin> findByEmailId(String emailId);

    // Find pins by path (url)
    List<Pin> findByPath(String path);

    // Find pins by emailId and path
    List<Pin> findByEmailIdAndPath(String emailId, String path);

    List<Pin> findByIdAndEmailIdAndPath(String id, String emailId, String path);

    // Delete operations
    @Modifying
    @Transactional
    void deleteByEmailIdAndPath(String emailId, String path);

    // Count operations for verification
    long countByEmailIdAndPath(String emailId, String path);
}