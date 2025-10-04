-- TTG Daily Workload Database Schema

CREATE TABLE statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    at_risk BOOLEAN DEFAULT 0
);

CREATE TABLE daily_counts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day DATE NOT NULL,
    status_key VARCHAR(64) NOT NULL,
    count INT NOT NULL,
    INDEX(day),
    FOREIGN KEY (status_key) REFERENCES statuses(`key`)
);
