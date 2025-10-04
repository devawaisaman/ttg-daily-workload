-- TTG Daily Workload Seed Data

-- Insert registration IDs
INSERT INTO registration (registration_id) VALUES
(74523),
(84752),
(86098),
(86345),
(86783),
(89168),
(89175),
(90895),
(91610),
(92794);

-- Insert registration status history
INSERT INTO registration_status_history (registration_id, status, date_created) VALUES
(74523, 'Documents Received', '2024-04-19'),
(74523, 'TTG sent to county', '2024-04-19'),
(84752, 'On Hold- QA', '2024-07-24'),
(84752, 'Send Docs to TTG', '2024-07-24'),
(86098, 'On Hold- QA', '2024-08-06'),
(86098, 'On Hold- QA', '2024-09-04'),
(86345, 'Send Docs to TTG', '2024-08-09'),
(86345, 'Documents Received', '2024-08-19'),
(86783, 'On Hold- QA', '2024-08-14'),
(86783, 'Send Docs to TTG', '2024-08-14'),
(89168, 'Send Docs to TTG', '2024-09-06'),
(89175, 'On Hold- QA', '2024-09-06'),
(89175, 'On Hold- QA', '2024-09-06'),
(89175, 'On Hold- QA', '2024-11-20');

