INSERT INTO users (username, email, name, password, role) VALUES
('nvlinh', 'nvlinh@gmail.com', 'Nguyễn Văn Linh', '$2a$12$d.b2KZ6bsFwPid.hxw6G3OPZN99NWZt4eKg6freyGkrPXgeNOXhJa', 'manager'),
('ptnga', 'ptnga@gmail.com', 'Phạm Thị Nga', '$2a$12$d.b2KZ6bsFwPid.hxw6G3OPZN99NWZt4eKg6freyGkrPXgeNOXhJa', 'employee'),
('lqvinh', 'lqvinh@gmail.com', 'Lê Quang Vinh', '$2a$12$d.b2KZ6bsFwPid.hxw6G3OPZN99NWZt4eKg6freyGkrPXgeNOXhJa', 'employee'),
('tdloan', 'tdloan@gmail.com', 'Trần Diễm Loan', '$2a$12$d.b2KZ6bsFwPid.hxw6G3OPZN99NWZt4eKg6freyGkrPXgeNOXhJa', 'employee'),
('ltbao', 'ltbao@gmail.com', 'Lý Tuấn Bảo', '$2a$12$d.b2KZ6bsFwPid.hxw6G3OPZN99NWZt4eKg6freyGkrPXgeNOXhJa', 'employee');

--
INSERT INTO leave_balances (user_id, year, total_days, used_days, carried_over_days) VALUES
(1, 2025, 12, 7, 1),  -- Linh đã nghỉ 3 ngày, cộng dồn 1 ngày từ 2024
(2, 2025, 12, 10, 0),  -- Nga chưa nghỉ
(3, 2025, 12, 4, 2),  -- Vinh nghỉ 5 ngày, còn dư 2
(4, 2025, 12, 7, 0),  -- Loan nghỉ 1 ngày
(5, 2025, 12, 2, 0),  -- Bảo nghỉ khá nhiều
(1, 2024, 12, 7, 2),  -- Linh đã nghỉ 3 ngày, cộng dồn 1 ngày từ 2024
(2, 2024, 12, 10, 2),  -- Nga chưa nghỉ
(3, 2024, 12, 4, 2),  -- Vinh nghỉ 5 ngày, còn dư 2
(4, 2024, 12, 7, 2),  -- Loan nghỉ 1 ngày
(5, 2024, 12, 2, 2);  -- Bảo nghỉ khá nhiều


--
INSERT INTO leave_requests (user_id, reason, leave_dates, approved_days, status, reject_reason) VALUES
-- Nguyễn Văn Linh (user_id = 1)
(1, 'Nghỉ cưới bạn thân', ARRAY['2025-07-12', '2025-07-13']::DATE[], ARRAY['2025-07-12']::DATE[], 'approved', NULL),
(1, 'Nghỉ ốm', ARRAY['2025-07-20']::DATE[], NULL, 'pending', NULL),
(1, 'Nghỉ chăm sóc người thân', ARRAY['2025-07-25', '2025-07-26']::DATE[], ARRAY['2025-07-25']::DATE[], 'approved', NULL),
(1, 'Nghỉ việc riêng', ARRAY['2025-10-01']::DATE[], NULL, 'rejected', 'Trùng lịch cao điểm của dự án.'),
(1, 'Nghỉ đám giỗ', ARRAY['2025-12-02']::DATE[], NULL, 'pending', NULL),
(1, 'Nghỉ sinh nhật con', ARRAY['2025-09-25']::DATE[], ARRAY['2025-09-25']::DATE[], 'approved', NULL),
(1, 'Nghỉ chuyển nhà', ARRAY['2025-10-15']::DATE[], NULL, 'pending', NULL),

-- Phạm Thị Nga (user_id = 2)
(2, 'Nghỉ phép năm', ARRAY['2025-06-20', '2025-06-21']::DATE[], ARRAY['2025-06-20', '2025-06-21']::DATE[], 'approved', NULL),
(2, 'Nghỉ du lịch', ARRAY['2025-08-10', '2025-08-12']::DATE[], NULL, 'pending', NULL),
(2, 'Nghỉ học nâng cao', ARRAY['2025-09-15']::DATE[], NULL, 'pending', NULL),
(2, 'Nghỉ kết hôn em gái', ARRAY['2025-10-05', '2025-10-06']::DATE[], ARRAY['2025-10-05', '2025-10-06']::DATE[], 'approved', NULL),
(2, 'Nghỉ chăm con ốm', ARRAY['2025-11-01']::DATE[], NULL, 'pending', NULL),
(2, 'Nghỉ đi khám thai', ARRAY['2025-07-30']::DATE[], ARRAY['2025-07-30']::DATE[], 'approved', NULL),
(2, 'Nghỉ đám cưới bạn', ARRAY['2025-08-22']::DATE[], NULL, 'pending', NULL),
(2, 'Nghỉ việc riêng', ARRAY['2025-09-18']::DATE[], NULL, 'rejected', 'Đã hết ngày phép năm.'),
(2, 'Nghỉ chuyển nhà', ARRAY['2025-12-10']::DATE[], NULL, 'pending', NULL),
(2, 'Nghỉ sinh nhật mẹ', ARRAY['2025-12-20']::DATE[], ARRAY['2025-12-20']::DATE[], 'approved', NULL),

-- Lê Quang Vinh (user_id = 3)
(3, 'Nghỉ chăm con', ARRAY['2025-08-01', '2025-08-02']::DATE[], NULL, 'pending', NULL),
(3, 'Nghỉ việc riêng', ARRAY['2025-09-01']::DATE[], NULL, 'rejected', 'Cần báo trước tối thiểu 5 ngày làm việc.'),
(3, 'Nghỉ kết hôn', ARRAY['2025-10-01', '2025-10-02']::DATE[], NULL, 'pending', NULL),
(3, 'Nghỉ đi du lịch Nha Trang', ARRAY['2025-07-18', '2025-07-20']::DATE[], ARRAY['2025-07-18', '2025-07-19']::DATE[], 'approved', NULL),

-- Trần Diễm Loan (user_id = 4)
(4, 'Nghỉ phép năm', ARRAY['2025-07-01', '2025-07-02']::DATE[], ARRAY['2025-07-01']::DATE[], 'approved', NULL),
(4, 'Nghỉ chăm sóc mẹ', ARRAY['2025-08-05']::DATE[], NULL, 'pending', NULL),
(4, 'Nghỉ học nâng cao', ARRAY['2025-09-12']::DATE[], NULL, 'pending', NULL),
(4, 'Nghỉ đám cưới bạn', ARRAY['2025-10-20']::DATE[], ARRAY['2025-10-20']::DATE[], 'approved', NULL),
(4, 'Nghỉ việc riêng', ARRAY['2025-11-11']::DATE[], NULL, 'rejected', 'Không đủ nhân sự trong thời gian đề xuất nghỉ.'),
(4, 'Nghỉ chuyển nhà', ARRAY['2025-12-15']::DATE[], NULL, 'pending', NULL),
(4, 'Nghỉ sinh nhật con', ARRAY['2025-09-30']::DATE[], ARRAY['2025-09-30']::DATE[], 'approved', NULL),

-- Lý Tuấn Bảo (user_id = 5)
(5, 'Nghỉ phép năm', ARRAY['2025-07-15', '2025-07-16']::DATE[], ARRAY['2025-07-15']::DATE[], 'approved', NULL),
(5, 'Nghỉ chăm con', ARRAY['2025-08-12']::DATE[], NULL, 'pending', NULL),
(5, 'Nghỉ chăm bà', ARRAY['2025-08-20']::DATE[], NULL, 'pending', NULL);