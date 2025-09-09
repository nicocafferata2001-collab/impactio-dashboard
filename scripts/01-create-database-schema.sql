-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type VARCHAR(20) NOT NULL, -- 'lead' or 'agent'
  sender_name VARCHAR(255),
  channel VARCHAR(50) NOT NULL, -- 'whatsapp', 'email', 'phone', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'agent',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert leads" ON leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all conversations" ON conversations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert conversations" ON conversations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Insert sample data
INSERT INTO leads (name, email, phone, company, source, status, priority, notes) VALUES
('Juan Pérez', 'juan@email.com', '+34 600 123 456', 'Tech Solutions', 'website', 'new', 'high', 'Interesado en servicios premium'),
('María García', 'maria@empresa.com', '+34 600 789 012', 'Marketing Pro', 'facebook', 'contacted', 'medium', 'Solicita información sobre precios'),
('Carlos López', 'carlos@startup.com', '+34 600 345 678', 'StartupXYZ', 'linkedin', 'qualified', 'high', 'Reunión programada para el viernes'),
('Ana Martín', 'ana@consultora.com', '+34 600 901 234', 'Consultora ABC', 'referral', 'proposal', 'medium', 'Propuesta enviada, esperando respuesta'),
('David Ruiz', 'david@email.com', '+34 600 567 890', 'Freelancer', 'google', 'new', 'low', 'Consulta inicial sobre servicios');

INSERT INTO conversations (lead_id, message, sender_type, sender_name, channel) 
SELECT 
  l.id,
  CASE 
    WHEN l.name = 'Juan Pérez' THEN 'Hola, me interesa conocer más sobre sus servicios premium'
    WHEN l.name = 'María García' THEN '¿Podrían enviarme información sobre precios?'
    WHEN l.name = 'Carlos López' THEN 'Me gustaría agendar una reunión para discutir una colaboración'
    WHEN l.name = 'Ana Martín' THEN 'He revisado la propuesta, tengo algunas preguntas'
    ELSE 'Consulta inicial sobre servicios'
  END,
  'lead',
  l.name,
  CASE 
    WHEN l.source = 'website' THEN 'email'
    WHEN l.source = 'facebook' THEN 'facebook'
    WHEN l.source = 'linkedin' THEN 'linkedin'
    WHEN l.source = 'referral' THEN 'phone'
    ELSE 'whatsapp'
  END
FROM leads l;
