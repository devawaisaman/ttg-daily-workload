-- TTG Daily Workload Database Schema

-- Registration table (from TABLES(REGISTRATIONS).csv)
CREATE TABLE registration (
    registration_id INT PRIMARY KEY
);

-- Registration status history table (from TABLES(REGISTRATION STATUS HISTORY).csv)
CREATE TABLE registration_status_history (
    registration_status_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    status VARCHAR(128) NOT NULL,
    date_created DATE NOT NULL,
    INDEX(registration_id),
    INDEX(date_created),
    INDEX(status),
    FOREIGN KEY (registration_id) REFERENCES registration(registration_id)
);
