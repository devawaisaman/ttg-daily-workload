-- TTG Daily Workload Database Schema

CREATE TABLE registration (
    registration_id INT PRIMARY KEY
);

CREATE TABLE registration_status_history (
    registration_status_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    status VARCHAR(128) NOT NULL,
    date_created DATE NOT NULL,
    INDEX(registration_id),
    INDEX(date_created),
    FOREIGN KEY (registration_id) REFERENCES registration(registration_id)
);

