-- 1) Realtor-User anlegen
INSERT INTO "User" (
  name,
  phone,
  email,
  password,
  user_type
) VALUES
  ('Realtor One', '111-222-3333', 'realtor1@example.com', 'password1', 'REALTOR'),  -- id = 1
  ('Realtor Two', '222-333-4444', 'realtor2@example.com', 'password2', 'REALTOR'),  -- id = 2
  ('Realtor Three', '333-444-5555', 'realtor3@example.com', 'password3', 'REALTOR'); -- id = 3

-- 2) Homes anlegen — nun existieren User mit id = 1, 2, 3
INSERT INTO "Home" (
  address,
  number_of_bedrooms,
  number_of_bathrooms,
  city,
  price,
  land_size,
  "propertyType",
  realtor_id
) VALUES
  ('123 Maple Street', 3, 2.5, 'Berlin',  450000.00, 750.5, 'RESIDENTIAL', 1),
  ('456 Oak Avenue',   2, 1.0, 'München', 320000.00, 500.0, 'CONDO',       2),
  ('789 Pine Road',    4, 3.0, 'Hamburg', 620000.00, 1200.75, 'RESIDENTIAL', 3);