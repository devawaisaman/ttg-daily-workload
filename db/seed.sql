-- TTG Daily Workload Seed Data

-- Insert statuses
INSERT INTO statuses (`key`, name, at_risk) VALUES
('documents_received', 'Documents Received', 0),
('received_title', 'Received Title', 0),
('send_docs_to_ttg', 'Send Docs to TTG', 0),
('on_hold_qa', 'On Hold QA', 1),
('ttg_sent_to_county', 'TTG Sent to County', 0),
('successfully_sent_to_dmv', 'Successfully Sent to DMV', 0),
('ws_correction_requested', 'WS Correction Requested', 0),
('ws_correction_complete', 'WS Correction Complete', 0),
('post_audit', 'Post Audit', 0);

-- Insert mock daily counts for 2025-10-03
INSERT INTO daily_counts (day, status_key, count) VALUES
('2025-10-03', 'documents_received', 60),
('2025-10-03', 'received_title', 20),
('2025-10-03', 'send_docs_to_ttg', 40),
('2025-10-03', 'on_hold_qa', 25),
('2025-10-03', 'ttg_sent_to_county', 76),
('2025-10-03', 'successfully_sent_to_dmv', 23),
('2025-10-03', 'ws_correction_requested', 15),
('2025-10-03', 'ws_correction_complete', 10),
('2025-10-03', 'post_audit', 72);
