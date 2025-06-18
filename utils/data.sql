INSERT INTO users (username, email, name, password, role) VALUES
('nvlinh', 'nvlinh@example.com', 'Nguyễn Văn Linh', 'hashed_pwd_1', 'employee'),
('ptnga', 'ptnga@example.com', 'Phạm Thị Nga', 'hashed_pwd_2', 'employee'),
('lqvinh', 'lqvinh@example.com', 'Lê Quang Vinh', 'hashed_pwd_3', 'employee'),
('tdloan', 'tdloan@example.com', 'Trần Diễm Loan', 'hashed_pwd_4', 'employee'),
('ltbao', 'ltbao@example.com', 'Lý Tuấn Bảo', 'hashed_pwd_5', 'employee');

--
INSERT INTO leave_balances (user_id, year, total_days, used_days, carried_over_days) VALUES
(1, 2025, 12, 3, 1),  -- Linh đã nghỉ 3 ngày, cộng dồn 1 ngày từ 2024
(2, 2025, 12, 0, 0),  -- Nga chưa nghỉ
(3, 2025, 12, 5, 2),  -- Vinh nghỉ 5 ngày, còn dư 2
(4, 2025, 12, 1, 0),  -- Loan nghỉ 1 ngày
(5, 2025, 12, 6, 0);  -- Bảo nghỉ khá nhiều
--
INSERT INTO leave_requests (user_id, reason, leave_dates, approved_days, status) VALUES
(1, 'Nghỉ cưới bạn thân', ARRAY['2025-07-12', '2025-07-13']::DATE[], ARRAY['2025-07-12']::DATE[], 'approved'),
(3, 'Nghỉ chăm con', ARRAY['2025-08-01', '2025-08-02']::DATE[], NULL, 'pending');