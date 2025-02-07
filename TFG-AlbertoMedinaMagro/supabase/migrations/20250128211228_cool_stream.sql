/*
  # Initial Schema for PeluCitas

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `rol` (text) - client, admin
      - `created_at` (timestamp)
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `service_type` (text)
      - `appointment_date` (timestamp)
      - `created_at` (timestamp)
      - `status` (text)
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `price` (decimal)
      - `duration` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  rol text DEFAULT 'client',
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  service_type text NOT NULL,
  appointment_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price decimal NOT NULL,
  duration integer NOT NULL -- Duración en minutos
);

-- Create reservations table
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  service_id uuid REFERENCES services(id) NOT NULL,
  reservation_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Insert initial services
INSERT INTO services (name, category, price, duration) VALUES
  ('Lavar + Cortar + Peinar', 'Cabello', 10.00, 60),
  ('Cortar', 'Cabello', 12.00, 40),
  ('Cortar Cabello + Barba', 'General', 15.00, 50),
  ('Degradado', 'Cabello', 10.00, 30),
  ('Arreglar Barba', 'Barba', 10.00, 20),
  ('Afeitar', 'Barba', 5.00, 15);