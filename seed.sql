-- ===================================================================
-- BarberApp MVP - Script de Seed Inicial (Seção 12 da Especificação)
-- ===================================================================

-- 1. Inserção de Usuários
INSERT INTO usuarios (nome, email, telefone, perfil) VALUES
 ('Admin Barbearia', 'admin@barberapp.com', '11999990000', 'ADMIN'),
 ('João Barbeiro', 'joao@barberapp.com', '11999990001', 'BARBEIRO'),
 ('Marcos Barbeiro', 'marcos@barberapp.com', '11999990002', 'BARBEIRO');

-- 2. Inserção de Barbeiros (vinculados aos usuários João e Marcos)
INSERT INTO barbeiros (usuario_id, especialidade, ativo) VALUES
 (2, 'Corte e Barba', true),
 (3, 'Degradê e Coloração', true);

-- 3. Inserção de Serviços do Catálogo
INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES
 ('Corte Simples', 'Corte na tesoura ou máquina', 40.00, 30),
 ('Corte + Barba', 'Corte completo com barba desenhada', 65.00, 60),
 ('Coloração', 'Coloração completa', 90.00, 90);
