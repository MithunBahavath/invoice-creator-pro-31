
-- Create seller_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.seller_details (
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

-- Create bank_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_no TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.seller_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

-- Create policies for seller_details (allow all operations for now)
CREATE POLICY IF NOT EXISTS "Allow all operations on seller_details" 
  ON public.seller_details 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create policies for bank_details (allow all operations for now)
CREATE POLICY IF NOT EXISTS "Allow all operations on bank_details" 
  ON public.bank_details 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Insert default seller details if none exist
INSERT INTO public.seller_details (company_name, address, gstin, contact, email, state, state_code)
SELECT 'SAKTHI GAS SERVICE', 
       '2/A Kalyanaraman Kovil Street, Old Bus Stand, Kumbakonam, Tamil Nadu - 612001, India',
       '33HVVPS5257L1ZH',
       '8072991484',
       'sakthigas@gmail.com',
       'Tamil Nadu',
       '33'
WHERE NOT EXISTS (SELECT 1 FROM public.seller_details WHERE is_active = true);

-- Insert default bank details if none exist
INSERT INTO public.bank_details (bank_name, account_no, ifsc_code, branch_name)
SELECT 'City Union Bank',
       '510909010109147',
       'CIUB0000003',
       'Kumbakonam Town'
WHERE NOT EXISTS (SELECT 1 FROM public.bank_details WHERE is_active = true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_seller_details_updated_at ON public.seller_details;
CREATE TRIGGER update_seller_details_updated_at
    BEFORE UPDATE ON public.seller_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bank_details_updated_at ON public.bank_details;
CREATE TRIGGER update_bank_details_updated_at
    BEFORE UPDATE ON public.bank_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
