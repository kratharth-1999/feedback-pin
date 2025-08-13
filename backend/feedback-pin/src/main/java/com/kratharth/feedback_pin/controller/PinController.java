package com.kratharth.feedback_pin.controller;

import com.kratharth.feedback_pin.dto.ApiResponse;
import com.kratharth.feedback_pin.entity.Pin;
import com.kratharth.feedback_pin.repository.PinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")

public class PinController {
    @Autowired
    private PinRepository pinRepository;

    // GET /pins with query params: id, url, emailId
    @GetMapping("/pins")
    public ResponseEntity<ApiResponse<Pin>> getPins(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String url,
            @RequestParam(required = false) String emailId) {
        
        try {
            List<Pin> pins = new ArrayList<>();
            
            // Simplified logic: build query based on provided parameters
            boolean hasId = id != null && !id.trim().isEmpty();
            boolean hasEmailId = emailId != null && !emailId.trim().isEmpty();
            boolean hasUrl = url != null && !url.trim().isEmpty();
            
            if (hasId && hasEmailId && hasUrl) {
                pins = pinRepository.findByIdAndEmailIdAndPath(id, emailId, url);
            } else if (hasId) {
                pinRepository.findById(id).ifPresent(pins::add);
            } else if (hasEmailId && hasUrl) {
                pins = pinRepository.findByEmailIdAndPath(emailId, url);
            } else if (hasEmailId) {
                pins = pinRepository.findByEmailId(emailId);
            } else if (hasUrl) {
                pins = pinRepository.findByPath(url);
            } else {
                pins = pinRepository.findAll();
            }
            
            return ResponseEntity.ok(ApiResponse.success(pins, "Pins retrieved successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error(500, "Error retrieving pins: " + e.getMessage()));
        }
    }

    // POST /pin - Upsert operation (insert or update)
    @PostMapping("/pin")
    public ResponseEntity<ApiResponse<Object>> upsertPin(@RequestBody Pin pin) {
        try {
            // ID is always required
            if (isNullOrEmpty(pin.getId())) {
                return badRequest("Pin ID is required");
            }
            
            Optional<Pin> existingPin = pinRepository.findById(pin.getId());
            
            if (existingPin.isPresent()) {
                // UPDATE: ID exists, update provided fields
                Pin existing = existingPin.get();
                boolean updated = false;
                
                if (!isNullOrEmpty(pin.getEmailId())) {
                    existing.setEmailId(pin.getEmailId());
                    updated = true;
                }
                if (!isNullOrEmpty(pin.getPath())) {
                    existing.setPath(pin.getPath());
                    updated = true;
                }
                if (!isNullOrEmpty(pin.getFeedback())) {
                    existing.setFeedback(pin.getFeedback());
                    updated = true;
                }
                if (pin.getX() != null) {
                    existing.setX(pin.getX());
                    updated = true;
                }
                if (pin.getY() != null) {
                    existing.setY(pin.getY());
                    updated = true;
                }
                
                if (!updated) {
                    return badRequest("At least one field must be provided for update");
                }
                
                pinRepository.save(existing);
                return ResponseEntity.ok(ApiResponse.successMessage("Pin updated successfully"));
                
            } else {
                // INSERT: ID doesn't exist, all required fields must be provided
                String validationError = validateForInsert(pin);
                if (validationError != null) {
                    return badRequest(validationError);
                }
                
                // Set creation timestamp if not provided
                if (pin.getCreatedAt() == null) {
                    pin.setCreatedAt(System.currentTimeMillis());
                }
                
                pinRepository.save(pin);
                return ResponseEntity.ok(ApiResponse.successMessage("Pin created successfully"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.errorMessage(500, "Error processing pin: " + e.getMessage()));
        }
    }
    
    // Helper methods
    private boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
    
    private String validateForInsert(Pin pin) {
        if (isNullOrEmpty(pin.getEmailId())) return "Email ID is required for new pin";
        if (isNullOrEmpty(pin.getPath())) return "Path (URL) is required for new pin";
        if (isNullOrEmpty(pin.getFeedback())) return "Feedback is required for new pin";
        if (pin.getX() == null) return "X coordinate is required for new pin";
        if (pin.getY() == null) return "Y coordinate is required for new pin";
        return null;
    }
    
    private ResponseEntity<ApiResponse<Object>> badRequest(String message) {
        return ResponseEntity.badRequest().body(ApiResponse.errorMessage(400, message));
    }

    // DELETE /pin - Only supports: id OR (emailId + url)
    @DeleteMapping("/pins")
    public ResponseEntity<ApiResponse<Object>> deletePin(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String url,
            @RequestParam(required = false) String emailId) {
        
        try {
            boolean hasId = !isNullOrEmpty(id);
            boolean hasEmailId = !isNullOrEmpty(emailId);
            boolean hasUrl = !isNullOrEmpty(url);

            /**
             * Caters to 2 scenarios
             * when id is sent in query param - delete one
             * when an email + url pair is sent in query params - delete all
             */
            if (hasId) {
                // Delete by ID
                if (!pinRepository.existsById(id)) {
                    return ResponseEntity.status(404)
                            .body(ApiResponse.errorMessage(404, "Pin with ID '" + id + "' not found"));
                }
                pinRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.successMessage("Pin deleted successfully"));
                
            } else if (hasEmailId && hasUrl) {
                // Delete by email + url
                long deletedCount = pinRepository.countByEmailIdAndPath(emailId, url);
                if (deletedCount == 0) {
                    return ResponseEntity.status(404)
                            .body(ApiResponse.errorMessage(404, "No pins found for emailId '" + emailId + "' and URL '" + url + "'"));
                }
                pinRepository.deleteByEmailIdAndPath(emailId, url);
                String message = deletedCount == 1 ? "Pin deleted successfully" : deletedCount + " pins deleted successfully";
                return ResponseEntity.ok(ApiResponse.successMessage(message));
                
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.errorMessage(400, "Required: either 'id' OR both 'emailId' and 'url'"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.errorMessage(500, "Error deleting pin(s): " + e.getMessage()));
        }
    }
}
