CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,          
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('employee', 'manager')) NOT NULL
);

CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    reason TEXT,
    leave_dates DATE[] NOT NULL,
    approved_days DATE[],    
    status leave_status DEFAULT 'pending',
    reject_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- cái này là quản lý cái tổng ngày nghĩ trong 1 năm nha ae hồi chiều bàn thiếu cái này  remaining_days = total_days + carried_over_days - used_days
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    year INT NOT NULL,
    total_days INT DEFAULT 12,
    used_days INT DEFAULT 0,
    carried_over_days INT DEFAULT 0,
    UNIQUE (user_id, year)
);

-- Xóa theo thứ tự nha ae
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS leave_balances;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS leave_status;