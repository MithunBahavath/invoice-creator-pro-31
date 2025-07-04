
-- Create seller_details table for storing seller information
CREATE TABLE public.seller_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL,
  gstin TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank_details table for storing bank information
CREATE TABLE public.bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_no TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default seller details
INSERT INTO public.seller_details (
  company_name, 
  address, 
  gstin, 
  contact, 
  email, 
  state, 
  state_code
) VALUES (
  'SAKTHI GAS SERVICE',
  '2/A Kalyanaraman Kovil Street, Old Bus Stand, Kumbakonam, Tamil Nadu - 612001, India',
  '33HVVPS5257L1ZH',
  '8072991484',
  'sakthigas@gmail.com',
  'Tamil Nadu',
  '33'
);

-- Insert default bank details
INSERT INTO public.bank_details (
  bank_name,
  account_no,
  ifsc_code,
  branch_name
) VALUES (
  'City Union Bank',
  '510909010109147',
  'CIUB0000003',
  'Kumbakonam Town'
);

-- Enable Row Level Security (these tables can be public for this use case)
ALTER TABLE public.seller_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is company data)
CREATE POLICY "Allow all operations on seller_details" 
  ON public.seller_details 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on bank_details" 
  ON public.bank_details 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
