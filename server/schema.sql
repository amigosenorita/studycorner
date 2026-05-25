CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  student_name VARCHAR(160) NOT NULL,
  dob DATE NULL,
  gender VARCHAR(80) NULL,
  aadhaar CHAR(12) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  alt_mobile VARCHAR(20) NULL,
  email VARCHAR(190) NULL,
  address TEXT NULL,
  blood_group VARCHAR(20) NULL,
  marital_status VARCHAR(60) NULL,
  religion VARCHAR(80) NULL,
  nationality VARCHAR(80) NULL,
  community VARCHAR(80) NULL,
  sub_caste VARCHAR(120) NULL,
  mother_tongue VARCHAR(80) NULL,
  first_graduate VARCHAR(20) NULL,
  tenth_percent VARCHAR(20) NULL,
  twelfth_percent VARCHAR(20) NULL,
  preferred_course VARCHAR(160) NULL,
  preferred_college VARCHAR(220) NULL,
  program VARCHAR(120) NULL,
  branch VARCHAR(160) NULL,
  referred_by VARCHAR(120) NULL,
  student_photo TEXT NULL,
  aadhaar_photo TEXT NULL,
  tenth_marksheet_photo TEXT NULL,
  twelfth_marksheet_photo TEXT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'New Lead',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_course ON leads (preferred_course);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);

CREATE TABLE IF NOT EXISTS references_list (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_options (
  id BIGSERIAL PRIMARY KEY,
  category VARCHAR(120) NOT NULL,
  value VARCHAR(220) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_form_option UNIQUE (category, value)
);

CREATE INDEX IF NOT EXISTS idx_form_options_category ON form_options (category);

INSERT INTO references_list (name) VALUES
('Google'),
('Facebook'),
('Instagram'),
('Walk-in')
ON CONFLICT (name) DO NOTHING;

INSERT INTO form_options (category, value) VALUES
('Gender', 'Male'),
('Gender', 'Female'),
('Gender', 'Transgender'),
('Blood Group', 'A+'),
('Blood Group', 'A-'),
('Blood Group', 'B+'),
('Blood Group', 'B-'),
('Blood Group', 'O+'),
('Blood Group', 'O-'),
('Blood Group', 'AB+'),
('Blood Group', 'AB-'),
('Marital Status', 'Single'),
('Marital Status', 'Married'),
('Religion', 'Hindu'),
('Religion', 'Muslim'),
('Religion', 'Christian'),
('Nationality', 'Indian'),
('Nationality', 'NRI'),
('Mother Tongue', 'Tamil'),
('Mother Tongue', 'English'),
('Mother Tongue', 'Hindi'),
('Mother Tongue', 'Malayalam'),
('Preferred College', 'Sathyabama Institute of Science and Technology'),
('Preferred College', 'SRM Institute of Science and Technology'),
('Preferred College', 'Saveetha Engineering College'),
('Preferred College', 'Velammal Engineering College'),
('Preferred College', 'Panimalar Engineering College'),
('Preferred College', 'Easwari Engineering College'),
('Preferred College', 'Hindustan Institute of Technology and Science'),
('Preferred College', 'St. Joseph''s College of Engineering'),
('Preferred College', 'Rajalakshmi Engineering College'),
('Preferred College', 'KPR Institute of Engineering and Technology'),
('Preferred College', 'Kumaraguru College of Technology'),
('Preferred College', 'Bannari Amman Institute of Technology'),
('Preferred College', 'PSG College of Technology'),
('Preferred College', 'CIT Chennai'),
('Preferred College', 'Thiagarajar College of Engineering'),
('Preferred College', 'Paavai Engineering College'),
('Preferred College', 'Dhanalakshmi Srinivasan Engineering College'),
('Preferred College', 'Karpagam College of Engineering'),
('Preferred College', 'Sairam Engineering College'),
('Preferred College', 'Meenakshi Sundararajan Engineering College')
ON CONFLICT (category, value) DO NOTHING;
