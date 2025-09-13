-- Add metadata column to payments table to store skill card data temporarily
ALTER TABLE payments ADD COLUMN metadata JSONB;

-- Create function to create skill card from payment metadata after successful payment
CREATE OR REPLACE FUNCTION create_skill_card_from_payment(payment_id UUID)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  payment_record payments%ROWTYPE;
  skill_card_data JSONB;
  new_skill_card_id UUID;
BEGIN
  -- Get payment record
  SELECT * INTO payment_record FROM payments WHERE id = payment_id AND status = 'completed';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found or not completed';
  END IF;
  
  -- Extract skill card data from metadata
  skill_card_data := payment_record.metadata->'skillCardData';
  
  IF skill_card_data IS NULL THEN
    RAISE EXCEPTION 'No skill card data found in payment metadata';
  END IF;
  
  -- Create skill card
  INSERT INTO skill_cards (
    name,
    skill_category,
    bio,
    location,
    phone,
    email,
    user_id,
    payment_status,
    payment_reference,
    verified,
    star_rating
  ) VALUES (
    skill_card_data->>'name',
    skill_card_data->>'skill_category',
    skill_card_data->>'bio',
    skill_card_data->>'location',
    skill_card_data->>'phone',
    skill_card_data->>'email',
    (skill_card_data->>'user_id')::UUID,
    'completed',
    payment_record.payment_reference,
    true,
    1
  ) RETURNING id INTO new_skill_card_id;
  
  -- Update payment with skill card reference
  UPDATE payments SET skill_card_id = new_skill_card_id WHERE id = payment_id;
  
  RETURN new_skill_card_id;
END;
$$;