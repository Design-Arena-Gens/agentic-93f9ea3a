/*
 * ESP32-CAM Offline Face Recognition System
 * Activates relay when face is recognized
 * Uses ESP-WHO library for face detection and recognition
 */

#include "esp_camera.h"
#include "esp_timer.h"
#include "fb_gfx.h"
#include "fd_forward.h"
#include "fr_forward.h"

// Pin definitions for AI-Thinker ESP32-CAM
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// Relay pin
#define RELAY_PIN         12  // GPIO 12 for relay control
#define LED_PIN            4  // Built-in LED

// Face recognition parameters
#define ENROLL_CONFIRM_TIMES 5
#define FACE_ID_SAVE_NUMBER 7

static mtmn_config_t mtmn_config = {0};
static face_id_list id_list = {0};

void setup() {
  Serial.begin(115200);
  Serial.println("\n\nESP32-CAM Face Recognition System");

  // Initialize relay and LED pins
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // Relay off by default
  digitalWrite(LED_PIN, LOW);

  // Camera configuration
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // Frame size and quality
  if(psramFound()){
    config.frame_size = FRAMESIZE_QVGA;  // 320x240
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // Initialize camera
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }

  // Initialize face detection
  mtmn_config = mtmn_init_config();

  Serial.println("Camera initialized successfully");
  Serial.println("\nCommands:");
  Serial.println("'e' - Enroll new face");
  Serial.println("'d' - Delete all faces");
  Serial.println("'l' - List enrolled faces");
  Serial.println("\nSystem ready for face recognition...\n");
}

void loop() {
  // Check for serial commands
  if (Serial.available()) {
    char command = Serial.read();
    if (command == 'e') {
      enroll_face();
    } else if (command == 'd') {
      delete_all_faces();
    } else if (command == 'l') {
      list_faces();
    }
  }

  // Capture image
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    delay(1000);
    return;
  }

  // Convert to RGB888
  dl_matrix3du_t *image_matrix = dl_matrix3du_alloc(1, fb->width, fb->height, 3);
  if (!image_matrix) {
    esp_camera_fb_return(fb);
    Serial.println("Failed to allocate memory for image matrix");
    delay(1000);
    return;
  }

  fmt2rgb888(fb->buf, fb->len, fb->format, image_matrix->item);

  // Detect face
  box_array_t *boxes = face_detect(image_matrix, &mtmn_config);

  if (boxes) {
    Serial.printf("Faces detected: %d\n", boxes->len);

    if (boxes->len > 0) {
      // Get face embeddings
      dl_matrix3du_t *aligned_face = dl_matrix3du_alloc(1, FACE_WIDTH, FACE_HEIGHT, 3);
      if (align_face(boxes, image_matrix, aligned_face) == ESP_OK) {

        // Get face ID
        int8_t face_id = recognize_face(&id_list, aligned_face);

        if (face_id >= 0) {
          Serial.printf("✓ Face recognized! ID: %d\n", face_id);
          digitalWrite(RELAY_PIN, HIGH);  // Activate relay
          digitalWrite(LED_PIN, HIGH);
          delay(3000);  // Keep relay on for 3 seconds
          digitalWrite(RELAY_PIN, LOW);
          digitalWrite(LED_PIN, LOW);
        } else {
          Serial.println("✗ Unknown face - Relay remains OFF");
          digitalWrite(RELAY_PIN, LOW);
          digitalWrite(LED_PIN, LOW);
        }

        dl_matrix3du_free(aligned_face);
      }
    }

    free(boxes);
  } else {
    digitalWrite(RELAY_PIN, LOW);  // No face detected, relay off
    digitalWrite(LED_PIN, LOW);
  }

  dl_matrix3du_free(image_matrix);
  esp_camera_fb_return(fb);

  delay(100);  // Small delay between captures
}

void enroll_face() {
  Serial.println("\n=== Face Enrollment Mode ===");
  Serial.println("Position your face in front of camera...");

  int enroll_count = 0;
  dl_matrix3du_t *aligned_face = NULL;

  while (enroll_count < ENROLL_CONFIRM_TIMES) {
    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      delay(500);
      continue;
    }

    dl_matrix3du_t *image_matrix = dl_matrix3du_alloc(1, fb->width, fb->height, 3);
    if (!image_matrix) {
      esp_camera_fb_return(fb);
      continue;
    }

    fmt2rgb888(fb->buf, fb->len, fb->format, image_matrix->item);
    box_array_t *boxes = face_detect(image_matrix, &mtmn_config);

    if (boxes && boxes->len == 1) {
      if (!aligned_face) {
        aligned_face = dl_matrix3du_alloc(1, FACE_WIDTH, FACE_HEIGHT, 3);
      }

      if (align_face(boxes, image_matrix, aligned_face) == ESP_OK) {
        enroll_count++;
        Serial.printf("Enrollment capture %d/%d\n", enroll_count, ENROLL_CONFIRM_TIMES);

        if (enroll_count == ENROLL_CONFIRM_TIMES) {
          int8_t face_id = enroll_face_id(&id_list, aligned_face);
          if (face_id >= 0) {
            Serial.printf("✓ Face enrolled successfully! ID: %d\n", face_id);
            Serial.printf("Total enrolled faces: %d\n", id_list.count);
          } else {
            Serial.println("✗ Face enrollment failed");
          }
        }
      }
      free(boxes);
    } else if (boxes && boxes->len > 1) {
      Serial.println("Multiple faces detected. Please ensure only one face is visible.");
      free(boxes);
    } else {
      Serial.println("No face detected. Please position your face in front of camera.");
    }

    dl_matrix3du_free(image_matrix);
    esp_camera_fb_return(fb);
    delay(500);
  }

  if (aligned_face) {
    dl_matrix3du_free(aligned_face);
  }

  Serial.println("=== Enrollment Complete ===\n");
}

void delete_all_faces() {
  delete_face_all(&id_list);
  Serial.println("✓ All enrolled faces deleted");
}

void list_faces() {
  Serial.printf("\nEnrolled faces: %d / %d\n", id_list.count, FACE_ID_SAVE_NUMBER);
  if (id_list.count == 0) {
    Serial.println("No faces enrolled yet");
  }
  Serial.println();
}

box_array_t* face_detect(dl_matrix3du_t *image_matrix, mtmn_config_t *config) {
  return face_detect_with_threshold(image_matrix, config, 0.5, 0.3, 5);
}

int8_t recognize_face(face_id_list *l, dl_matrix3du_t *aligned_face) {
  if (l->count == 0) {
    return -1;  // No faces enrolled
  }

  return recognize_face_with_threshold(l, aligned_face, 0.5);
}

int8_t enroll_face_id(face_id_list *l, dl_matrix3du_t *aligned_face) {
  if (l->count >= FACE_ID_SAVE_NUMBER) {
    Serial.println("Maximum number of faces reached. Delete some faces first.");
    return -1;
  }

  return enroll_face(l, aligned_face);
}
