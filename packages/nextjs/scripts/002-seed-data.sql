-- Seed mock users
INSERT INTO users (id, username, email, display_name, avatar_url, starknet_address, invisible_key_id) VALUES
  ('user_1', 'alex_crypto', 'alex@example.com', 'Alex Chen', '/placeholder.svg?height=40&width=40', '0x1234...5678', 'chipi_key_1'),
  ('user_2', 'sarah_dev', 'sarah@example.com', 'Sarah Johnson', '/placeholder.svg?height=40&width=40', '0x2345...6789', 'chipi_key_2'),
  ('user_3', 'mike_trader', 'mike@example.com', 'Mike Rodriguez', '/placeholder.svg?height=40&width=40', '0x3456...7890', 'chipi_key_3'),
  ('user_4', 'emma_tech', 'emma@example.com', 'Emma Wilson', '/placeholder.svg?height=40&width=40', '0x4567...8901', 'chipi_key_4'),
  ('user_current', 'you', 'you@example.com', 'You', '/placeholder.svg?height=40&width=40', '0x5678...9012', 'chipi_key_current')
ON CONFLICT (id) DO NOTHING;

-- Seed mock transactions
INSERT INTO transactions (id, sender_id, receiver_id, sender_username, receiver_username, amount, status, starknet_tx_hash, created_at, completed_at) VALUES
  ('tx_1', 'user_2', 'user_current', 'sarah_dev', 'you', 45.00, 'success', '0xabc123...', datetime('now', '-2 hours'), datetime('now', '-2 hours')),
  ('tx_2', 'user_current', 'user_1', 'you', 'alex_crypto', 120.50, 'success', '0xdef456...', datetime('now', '-1 day'), datetime('now', '-1 day')),
  ('tx_3', 'user_3', 'user_current', 'mike_trader', 'you', 89.99, 'success', '0xghi789...', datetime('now', '-3 days'), datetime('now', '-3 days')),
  ('tx_4', 'user_current', 'user_4', 'you', 'emma_tech', 25.00, 'success', '0xjkl012...', datetime('now', '-5 days'), datetime('now', '-5 days')),
  ('tx_5', 'user_1', 'user_current', 'alex_crypto', 'you', 200.00, 'success', '0xmno345...', datetime('now', '-1 week'), datetime('now', '-1 week'))
ON CONFLICT (id) DO NOTHING;
