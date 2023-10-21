-- Rappels commandes pour créer le USER et la BDD
-- sudo -i -u postgres psql
-- ====== CREATING ROLE ======

CREATE ROLE okanban WITH LOGIN PASSWORD 'okanban';

-- ====== CREATING DATABASE ======

CREATE DATABASE okanban WITH OWNER okanban;