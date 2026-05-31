-- ============================================================
-- Full schema + seed for Bike Compatibility Checker
-- Safe to re-run: drops all tables first
-- ============================================================

DROP TABLE IF EXISTS rule_sources CASCADE;
DROP TABLE IF EXISTS sources CASCADE;
DROP TABLE IF EXISTS compatibility_parameters CASCADE;
DROP TABLE IF EXISTS compatibility_rules CASCADE;
DROP TABLE IF EXISTS components CASCADE;
DROP TABLE IF EXISTS groupsets CASCADE;

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE groupsets (
  id serial PRIMARY KEY,
  brand text NOT NULL,
  name text NOT NULL,
  speeds integer NOT NULL,
  generation text NOT NULL,
  type text NOT NULL DEFAULT 'mechanical' CHECK (type IN ('mechanical', 'electronic')),
  year_from integer
);

CREATE TABLE components (
  id serial PRIMARY KEY,
  groupset_id integer REFERENCES groupsets(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  model_number text,
  price_eur numeric(8,2),
  affiliate_url text
);

CREATE TABLE compatibility_rules (
  id serial PRIMARY KEY,
  groupset_a_id integer REFERENCES groupsets(id) ON DELETE CASCADE,
  groupset_b_id integer REFERENCES groupsets(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('compatible', 'adapter', 'incompatible')),
  explanation text,
  adapter_name text
);

CREATE TABLE compatibility_parameters (
  id serial PRIMARY KEY,
  groupset_id integer REFERENCES groupsets(id) ON DELETE CASCADE,
  cable_pull_mm numeric(5,2),
  sprocket_pitch_mm numeric(5,3),
  freehub_standard text,
  bb_standard text,
  chainline_mm numeric(5,1)
);

-- ============================================================
-- Groupsets
-- IDs 1-6:   Shimano Road
-- IDs 7-9:   SRAM Road 11s mechanical
-- IDs 10-12: SRAM Road 12s AXS electronic
-- IDs 13-15: Campagnolo 11s
-- IDs 16-18: Campagnolo 12s
-- ============================================================

INSERT INTO groupsets (id, brand, name, speeds, generation, type, year_from) VALUES
  -- Shimano 11s
  (1,  'Shimano',    'Shimano 105 R7000',          11, 'R7000', 'mechanical', 2018),
  (2,  'Shimano',    'Shimano Ultegra R8000',       11, 'R8000', 'mechanical', 2017),
  (3,  'Shimano',    'Shimano Dura-Ace R9100',      11, 'R9100', 'mechanical', 2016),
  -- Shimano 12s Di2
  (4,  'Shimano',    'Shimano 105 R7100 Di2',       12, 'R7100', 'electronic', 2022),
  (5,  'Shimano',    'Shimano Ultegra R8100 Di2',   12, 'R8100', 'electronic', 2022),
  (6,  'Shimano',    'Shimano Dura-Ace R9200 Di2',  12, 'R9200', 'electronic', 2021),
  -- SRAM 11s mechanical
  (7,  'SRAM',       'SRAM Rival 22',               11, 'Rival22', 'mechanical', 2012),
  (8,  'SRAM',       'SRAM Force 22',               11, 'Force22', 'mechanical', 2012),
  (9,  'SRAM',       'SRAM Red 22',                 11, 'Red22',   'mechanical', 2012),
  -- SRAM 12s AXS electronic
  (10, 'SRAM',       'SRAM Rival AXS',              12, 'RivalAXS', 'electronic', 2021),
  (11, 'SRAM',       'SRAM Force AXS',              12, 'ForceAXS', 'electronic', 2020),
  (12, 'SRAM',       'SRAM Red AXS',                12, 'RedAXS',   'electronic', 2019),
  -- Campagnolo 11s
  (13, 'Campagnolo', 'Campagnolo Chorus 11s',       11, 'Chorus11', 'mechanical', 2015),
  (14, 'Campagnolo', 'Campagnolo Record 11s',       11, 'Record11', 'mechanical', 2015),
  (15, 'Campagnolo', 'Campagnolo Super Record 11s', 11, 'SR11',     'mechanical', 2015),
  -- Campagnolo 12s
  (16, 'Campagnolo', 'Campagnolo Chorus 12s',       12, 'Chorus12', 'mechanical', 2020),
  (17, 'Campagnolo', 'Campagnolo Record 12s',       12, 'Record12', 'mechanical', 2020),
  (18, 'Campagnolo', 'Campagnolo Super Record 12s', 12, 'SR12',     'mechanical', 2020);

-- ============================================================
-- Compatibility Rules (only compatible/adapter pairs)
-- Missing pair = incompatible by default
-- ============================================================

-- Shimano 11s ↔ 11s: cross-compatible
INSERT INTO compatibility_rules (groupset_a_id, groupset_b_id, status, explanation) VALUES
  (1, 2, 'compatible', 'All Shimano 11-speed road components share the same cable pull ratio and sprocket pitch. Mix freely.'),
  (1, 3, 'compatible', 'All Shimano 11-speed road components share the same cable pull ratio and sprocket pitch. Mix freely.'),
  (2, 3, 'compatible', 'All Shimano 11-speed road components share the same cable pull ratio and sprocket pitch. Mix freely.');

-- Shimano 12s ↔ 12s: cross-compatible (Di2 only, same protocol)
INSERT INTO compatibility_rules (groupset_a_id, groupset_b_id, status, explanation) VALUES
  (4, 5, 'compatible', 'Shimano 12-speed Di2 components share the same electronic protocol and mechanical interfaces.'),
  (4, 6, 'compatible', 'Shimano 12-speed Di2 components share the same electronic protocol and mechanical interfaces.'),
  (5, 6, 'compatible', 'Shimano 12-speed Di2 components share the same electronic protocol and mechanical interfaces.');

-- SRAM 11s ↔ 11s: cross-compatible
INSERT INTO compatibility_rules (groupset_a_id, groupset_b_id, status, explanation) VALUES
  (7, 8,  'compatible', 'SRAM 11-speed mechanical road groupsets (Rival 22, Force 22, Red 22) use the same DoubleTap ratio and HG freehub.'),
  (7, 9,  'compatible', 'SRAM 11-speed mechanical road groupsets (Rival 22, Force 22, Red 22) use the same DoubleTap ratio and HG freehub.'),
  (8, 9,  'compatible', 'SRAM 11-speed mechanical road groupsets (Rival 22, Force 22, Red 22) use the same DoubleTap ratio and HG freehub.');

-- SRAM AXS 12s ↔ AXS 12s: cross-compatible
INSERT INTO compatibility_rules (groupset_a_id, groupset_b_id, status, explanation) VALUES
  (10, 11, 'compatible', 'SRAM AXS components communicate via the same wireless protocol and share XDR freehub and Flattop chain standards.'),
  (10, 12, 'compatible', 'SRAM AXS components communicate via the same wireless protocol and share XDR freehub and Flattop chain standards.'),
  (11, 12, 'compatible', 'SRAM AXS components communicate via the same wireless protocol and share XDR freehub and Flattop chain standards.');

-- Campagnolo 11s ↔ 11s: cross-compatible
INSERT INTO compatibility_rules (groupset_a_id, groupset_b_id, status, explanation) VALUES
  (13, 14, 'compatible', 'All Campagnolo 11-speed groupsets share Ergopower lever geometry, cable pull ratios, and HG-style freehub.'),
  (13, 15, 'compatible', 'All Campagnolo 11-speed groupsets share Ergopower lever geometry, cable pull ratios, and HG-style freehub.'),
  (14, 15, 'compatible', 'All Campagnolo 11-speed groupsets share Ergopower lever geometry, cable pull ratios, and HG-style freehub.');

-- Campagnolo 12s ↔ 12s: cross-compatible
INSERT INTO compatibility_rules (groupset_a_id, groupset_b_id, status, explanation) VALUES
  (16, 17, 'compatible', 'Campagnolo 12-speed groupsets share Ergopower geometry, 12s sprocket pitch, and N3W freehub standard.'),
  (16, 18, 'compatible', 'Campagnolo 12-speed groupsets share Ergopower geometry, 12s sprocket pitch, and N3W freehub standard.'),
  (17, 18, 'compatible', 'Campagnolo 12-speed groupsets share Ergopower geometry, 12s sprocket pitch, and N3W freehub standard.');

-- ============================================================
-- Compatibility Parameters
-- ============================================================

INSERT INTO compatibility_parameters (groupset_id, cable_pull_mm, sprocket_pitch_mm, freehub_standard, bb_standard, chainline_mm) VALUES
  -- Shimano 11s (mechanical)
  (1,  2.30, 3.950, 'HG',            'Hollowtech II (24mm)', 43.5),
  (2,  2.30, 3.950, 'HG',            'Hollowtech II (24mm)', 43.5),
  (3,  2.30, 3.950, 'HG',            'Hollowtech II (24mm)', 43.5),
  -- Shimano 12s (Di2 electronic — cable_pull_mm n/a, set to 0)
  (4,  0.00, 3.580, 'HG-EV',         'Hollowtech II (24mm)', 43.5),
  (5,  0.00, 3.580, 'HG-EV',         'Hollowtech II (24mm)', 43.5),
  (6,  0.00, 3.580, 'HG-EV',         'Hollowtech II (24mm)', 43.5),
  -- SRAM 11s mechanical
  (7,  2.40, 3.950, 'HG',            'DUB / SRAM GXP (28.99mm)', 43.5),
  (8,  2.40, 3.950, 'HG',            'DUB / SRAM GXP (28.99mm)', 43.5),
  (9,  2.40, 3.950, 'HG',            'DUB / SRAM GXP (28.99mm)', 43.5),
  -- SRAM AXS 12s (electronic)
  (10, 0.00, 3.580, 'XDR',           'DUB (28.99mm)', 43.5),
  (11, 0.00, 3.580, 'XDR',           'DUB (28.99mm)', 43.5),
  (12, 0.00, 3.580, 'XDR',           'DUB (28.99mm)', 43.5),
  -- Campagnolo 11s
  (13, 2.50, 3.850, 'Campagnolo HG', 'Ultra-Torque (25mm)', 43.5),
  (14, 2.50, 3.850, 'Campagnolo HG', 'Ultra-Torque (25mm)', 43.5),
  (15, 2.50, 3.850, 'Campagnolo HG', 'Ultra-Torque (25mm)', 43.5),
  -- Campagnolo 12s
  (16, 2.50, 3.580, 'N3W',           'Ultra-Torque (25mm)', 43.5),
  (17, 2.50, 3.580, 'N3W',           'Ultra-Torque (25mm)', 43.5),
  (18, 2.50, 3.580, 'N3W',           'Ultra-Torque (25mm)', 43.5);

-- ============================================================
-- Components
-- Categories: cassette, chain, rear_derailleur, front_derailleur,
--             shifters, crankset, brake_calipers, bottom_bracket
-- ============================================================

-- ── Shimano 105 R7000 (11s) ─────────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (1, 'cassette',         'Shimano 105 Cassette 11-28T',          'CS-R7000-11',  42.90, 'https://www.bike-components.de/de/s/?keywords=CS-R7000-11'),
  (1, 'chain',            'Shimano 105 Chain 11-speed',            'CN-HG601-11',  22.50, 'https://www.bike-components.de/de/s/?keywords=CN-HG601-11'),
  (1, 'rear_derailleur',  'Shimano 105 Rear Derailleur SS',        'RD-R7000-SS',  59.90, 'https://www.bike-components.de/de/s/?keywords=RD-R7000-SS'),
  (1, 'front_derailleur', 'Shimano 105 Front Derailleur',          'FD-R7000-F',   38.90, 'https://www.bike-components.de/de/s/?keywords=FD-R7000'),
  (1, 'shifters',         'Shimano 105 STI Levers (pair)',         'ST-R7000',    145.00, 'https://www.bike-components.de/de/s/?keywords=ST-R7000'),
  (1, 'crankset',         'Shimano 105 Crankset 52/36 175mm',     'FC-R7000',    115.00, 'https://www.bike-components.de/de/s/?keywords=FC-R7000'),
  (1, 'brake_calipers',   'Shimano 105 Brake Calipers (pair)',     'BR-R7000',     72.00, 'https://www.bike-components.de/de/s/?keywords=BR-R7000'),
  (1, 'bottom_bracket',   'Shimano BSA Bottom Bracket',            'SM-BBR60',     22.00, 'https://www.bike-components.de/de/s/?keywords=SM-BBR60');

-- ── Shimano Ultegra R8000 (11s) ─────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (2, 'cassette',         'Shimano Ultegra Cassette 11-28T',       'CS-R8000-11',  69.90, 'https://www.bike-components.de/de/s/?keywords=CS-R8000-11'),
  (2, 'chain',            'Shimano Ultegra Chain 11-speed',         'CN-HG701-11',  34.90, 'https://www.bike-components.de/de/s/?keywords=CN-HG701-11'),
  (2, 'rear_derailleur',  'Shimano Ultegra Rear Derailleur SS',     'RD-R8000-SS',  94.90, 'https://www.bike-components.de/de/s/?keywords=RD-R8000-SS'),
  (2, 'front_derailleur', 'Shimano Ultegra Front Derailleur',       'FD-R8000-F',   65.00, 'https://www.bike-components.de/de/s/?keywords=FD-R8000'),
  (2, 'shifters',         'Shimano Ultegra STI Levers (pair)',      'ST-R8000',    225.00, 'https://www.bike-components.de/de/s/?keywords=ST-R8000'),
  (2, 'crankset',         'Shimano Ultegra Crankset 52/36 175mm',  'FC-R8000',    185.00, 'https://www.bike-components.de/de/s/?keywords=FC-R8000'),
  (2, 'brake_calipers',   'Shimano Ultegra Brake Calipers (pair)', 'BR-R8000',     92.00, 'https://www.bike-components.de/de/s/?keywords=BR-R8000'),
  (2, 'bottom_bracket',   'Shimano BSA Bottom Bracket',             'SM-BBR60',     22.00, 'https://www.bike-components.de/de/s/?keywords=SM-BBR60');

-- ── Shimano Dura-Ace R9100 (11s) ────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (3, 'cassette',         'Shimano Dura-Ace Cassette 11-28T',      'CS-R9100-11',  239.90, 'https://www.bike-components.de/de/s/?keywords=CS-R9100-11'),
  (3, 'chain',            'Shimano Dura-Ace Chain 11-speed',        'CN-HG901-11',   49.90, 'https://www.bike-components.de/de/s/?keywords=CN-HG901-11'),
  (3, 'rear_derailleur',  'Shimano Dura-Ace Rear Derailleur SS',   'RD-R9100-SS',  249.90, 'https://www.bike-components.de/de/s/?keywords=RD-R9100-SS'),
  (3, 'front_derailleur', 'Shimano Dura-Ace Front Derailleur',     'FD-R9100-F',   148.00, 'https://www.bike-components.de/de/s/?keywords=FD-R9100'),
  (3, 'shifters',         'Shimano Dura-Ace STI Levers (pair)',    'ST-R9100',     498.00, 'https://www.bike-components.de/de/s/?keywords=ST-R9100'),
  (3, 'crankset',         'Shimano Dura-Ace Crankset 52/36 175mm','FC-R9100',     498.00, 'https://www.bike-components.de/de/s/?keywords=FC-R9100'),
  (3, 'brake_calipers',   'Shimano Dura-Ace Brake Calipers (pair)','BR-R9100',    198.00, 'https://www.bike-components.de/de/s/?keywords=BR-R9100'),
  (3, 'bottom_bracket',   'Shimano BSA Bottom Bracket',             'SM-BBR60',     22.00, 'https://www.bike-components.de/de/s/?keywords=SM-BBR60');

-- ── Shimano 105 R7100 Di2 (12s) ─────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (4, 'cassette',         'Shimano 105 Cassette 11-34T',           'CS-R7100-12',   54.90, 'https://www.bike-components.de/de/s/?keywords=CS-R7100-12'),
  (4, 'chain',            'Shimano 105 Chain 12-speed',             'CN-M7100-12',   29.90, 'https://www.bike-components.de/de/s/?keywords=CN-M7100-12'),
  (4, 'rear_derailleur',  'Shimano 105 Rear Derailleur Di2',       'RD-R7150-D',   159.90, 'https://www.bike-components.de/de/s/?keywords=RD-R7150'),
  (4, 'front_derailleur', 'Shimano 105 Front Derailleur Di2',      'FD-R7150-D',   128.00, 'https://www.bike-components.de/de/s/?keywords=FD-R7150'),
  (4, 'shifters',         'Shimano 105 Di2 Levers (pair)',         'ST-R7170',     198.00, 'https://www.bike-components.de/de/s/?keywords=ST-R7170'),
  (4, 'crankset',         'Shimano 105 Crankset 52/36 175mm',     'FC-R7100',     125.00, 'https://www.bike-components.de/de/s/?keywords=FC-R7100'),
  (4, 'brake_calipers',   'Shimano 105 Brake Calipers (pair)',     'BR-R7100',      68.00, 'https://www.bike-components.de/de/s/?keywords=BR-R7100'),
  (4, 'bottom_bracket',   'Shimano BSA Bottom Bracket 12s',        'SM-BBR60-41B',  25.00, 'https://www.bike-components.de/de/s/?keywords=SM-BBR60-41B');

-- ── Shimano Ultegra R8100 Di2 (12s) ─────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (5, 'cassette',         'Shimano Ultegra Cassette 11-34T',       'CS-R8100-12',   79.90, 'https://www.bike-components.de/de/s/?keywords=CS-R8100-12'),
  (5, 'chain',            'Shimano Ultegra Chain 12-speed',         'CN-M8100-12',   44.90, 'https://www.bike-components.de/de/s/?keywords=CN-M8100-12'),
  (5, 'rear_derailleur',  'Shimano Ultegra Rear Derailleur Di2',   'RD-R8150-D',   239.90, 'https://www.bike-components.de/de/s/?keywords=RD-R8150'),
  (5, 'front_derailleur', 'Shimano Ultegra Front Derailleur Di2',  'FD-R8150-D',   168.00, 'https://www.bike-components.de/de/s/?keywords=FD-R8150'),
  (5, 'shifters',         'Shimano Ultegra Di2 Levers (pair)',     'ST-R8170',     285.00, 'https://www.bike-components.de/de/s/?keywords=ST-R8170'),
  (5, 'crankset',         'Shimano Ultegra Crankset 52/36 175mm', 'FC-R8100',     198.00, 'https://www.bike-components.de/de/s/?keywords=FC-R8100'),
  (5, 'brake_calipers',   'Shimano Ultegra Brake Calipers (pair)','BR-R8100',      95.00, 'https://www.bike-components.de/de/s/?keywords=BR-R8100'),
  (5, 'bottom_bracket',   'Shimano BSA Bottom Bracket 12s',        'SM-BBR60-41B',  25.00, 'https://www.bike-components.de/de/s/?keywords=SM-BBR60-41B');

-- ── Shimano Dura-Ace R9200 Di2 (12s) ────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (6, 'cassette',         'Shimano Dura-Ace Cassette 11-30T',       'CS-R9200-12',  299.90, 'https://www.bike-components.de/de/s/?keywords=CS-R9200-12'),
  (6, 'chain',            'Shimano Dura-Ace Chain 12-speed',         'CN-M9100-12',   64.90, 'https://www.bike-components.de/de/s/?keywords=CN-M9100-12'),
  (6, 'rear_derailleur',  'Shimano Dura-Ace Rear Derailleur Di2',   'RD-R9250-D',   499.90, 'https://www.bike-components.de/de/s/?keywords=RD-R9250'),
  (6, 'front_derailleur', 'Shimano Dura-Ace Front Derailleur Di2',  'FD-R9250-D',   298.00, 'https://www.bike-components.de/de/s/?keywords=FD-R9250'),
  (6, 'shifters',         'Shimano Dura-Ace Di2 Levers (pair)',     'ST-R9270',     648.00, 'https://www.bike-components.de/de/s/?keywords=ST-R9270'),
  (6, 'crankset',         'Shimano Dura-Ace Crankset 52/36 175mm', 'FC-R9200',     798.00, 'https://www.bike-components.de/de/s/?keywords=FC-R9200'),
  (6, 'brake_calipers',   'Shimano Dura-Ace Brake Calipers (pair)','BR-R9200',     248.00, 'https://www.bike-components.de/de/s/?keywords=BR-R9200'),
  (6, 'bottom_bracket',   'Shimano BSA Bottom Bracket 12s',         'SM-BBR60-41B',  25.00, 'https://www.bike-components.de/de/s/?keywords=SM-BBR60-41B');

-- ── SRAM Rival 22 (11s mechanical) ──────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (7, 'cassette',         'SRAM Rival PG-1130 Cassette 11-28T',    'PG-1130',       38.00, 'https://www.bike-components.de/de/s/?keywords=PG-1130'),
  (7, 'chain',            'SRAM PC-1130 Chain 11-speed',            'PC-1130',       26.00, 'https://www.bike-components.de/de/s/?keywords=PC-1130'),
  (7, 'rear_derailleur',  'SRAM Rival 22 Rear Derailleur',         'RD-Rival22',    75.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+22+rear+derailleur'),
  (7, 'front_derailleur', 'SRAM Rival 22 Front Derailleur',        'FD-Rival22',    45.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+22+front+derailleur'),
  (7, 'shifters',         'SRAM Rival 22 DoubleTap Levers (pair)', 'ST-Rival22',   130.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+22+levers'),
  (7, 'crankset',         'SRAM Rival 22 Crankset 50/34 175mm',   'FC-Rival22',   100.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+22+crankset'),
  (7, 'brake_calipers',   'SRAM Rival 22 Brake Calipers (pair)',   'BR-Rival22',    60.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+22+brakes'),
  (7, 'bottom_bracket',   'SRAM BSA Bottom Bracket GXP',           'BB-RS500',      18.00, 'https://www.bike-components.de/de/s/?keywords=BB-RS500');

-- ── SRAM Force 22 (11s mechanical) ──────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (8, 'cassette',         'SRAM Force PG-1170 Cassette 11-28T',   'PG-1170',       55.00, 'https://www.bike-components.de/de/s/?keywords=PG-1170'),
  (8, 'chain',            'SRAM PC-1170 Chain 11-speed',            'PC-1170',       35.00, 'https://www.bike-components.de/de/s/?keywords=PC-1170'),
  (8, 'rear_derailleur',  'SRAM Force 22 Rear Derailleur',         'RD-Force22',   130.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+22+rear+derailleur'),
  (8, 'front_derailleur', 'SRAM Force 22 Front Derailleur',        'FD-Force22',    65.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+22+front+derailleur'),
  (8, 'shifters',         'SRAM Force 22 DoubleTap Levers (pair)', 'ST-Force22',   220.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+22+levers'),
  (8, 'crankset',         'SRAM Force 22 Crankset 50/34 175mm',   'FC-Force22',   220.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+22+crankset'),
  (8, 'brake_calipers',   'SRAM Force 22 Brake Calipers (pair)',   'BR-Force22',    95.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+22+brakes'),
  (8, 'bottom_bracket',   'SRAM BSA Bottom Bracket GXP',           'BB-RS500',      18.00, 'https://www.bike-components.de/de/s/?keywords=BB-RS500');

-- ── SRAM Red 22 (11s mechanical) ────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (9, 'cassette',         'SRAM Red XG-1190 Cassette 11-28T',      'XG-1190',       85.00, 'https://www.bike-components.de/de/s/?keywords=XG-1190'),
  (9, 'chain',            'SRAM Red PC-Red22 Chain 11-speed',       'PC-Red22',      52.00, 'https://www.bike-components.de/de/s/?keywords=PC-Red22'),
  (9, 'rear_derailleur',  'SRAM Red 22 Rear Derailleur',           'RD-Red22',     360.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+22+rear+derailleur'),
  (9, 'front_derailleur', 'SRAM Red 22 Front Derailleur',          'FD-Red22',     100.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+22+front+derailleur'),
  (9, 'shifters',         'SRAM Red 22 DoubleTap Levers (pair)',   'ST-Red22',     430.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+22+levers'),
  (9, 'crankset',         'SRAM Red 22 Crankset 50/34 175mm',     'FC-Red22',     430.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+22+crankset'),
  (9, 'brake_calipers',   'SRAM Red 22 Brake Calipers (pair)',     'BR-Red22',     130.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+22+brakes'),
  (9, 'bottom_bracket',   'SRAM BSA Bottom Bracket GXP',           'BB-RS500',      18.00, 'https://www.bike-components.de/de/s/?keywords=BB-RS500');

-- ── SRAM Rival AXS (12s electronic, 1×) ─────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (10, 'cassette',         'SRAM XG-1251 Cassette 10-36T (XDR)',    'XG-1251-A',     68.00, 'https://www.bike-components.de/de/s/?keywords=XG-1251'),
  (10, 'chain',            'SRAM Flattop PC-12 Chain',               'PC-12',         32.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+PC-12'),
  (10, 'rear_derailleur',  'SRAM Rival AXS Rear Derailleur',         'RD-RIV-D1',    260.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+AXS+rear+derailleur'),
  (10, 'shifters',         'SRAM Rival AXS Levers (pair)',           'BL-RIV-R',     195.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+AXS+levers'),
  (10, 'crankset',         'SRAM Rival AXS Crankset 1× 46T 175mm',  'FC-RIV-1',     185.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+AXS+crankset'),
  (10, 'brake_calipers',   'SRAM Rival Hydraulic Disc Calipers',     'HRD-RIV',       60.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Rival+hydraulic+calipers'),
  (10, 'bottom_bracket',   'SRAM DUB BSA Bottom Bracket',            'BSA-DUB',       48.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+DUB+BSA');

-- ── SRAM Force AXS (12s electronic, 2×) ─────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (11, 'cassette',         'SRAM XG-1270 Cassette 10-33T (XDR)',    'XG-1270-A',     95.00, 'https://www.bike-components.de/de/s/?keywords=XG-1270'),
  (11, 'chain',            'SRAM Flattop Chain Force AXS',           'PC-Force-AXS',  42.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+AXS+chain'),
  (11, 'rear_derailleur',  'SRAM Force AXS Rear Derailleur',         'RD-FOR-D1',    415.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+AXS+rear+derailleur'),
  (11, 'front_derailleur', 'SRAM Force AXS Front Derailleur',        'FD-FOR-D1',    180.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+AXS+front+derailleur'),
  (11, 'shifters',         'SRAM Force AXS Levers (pair)',           'BL-FOR-R',     360.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+AXS+levers'),
  (11, 'crankset',         'SRAM Force AXS Crankset 2× 50/37 175mm','FC-FOR-1',     315.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+AXS+crankset'),
  (11, 'brake_calipers',   'SRAM Force Hydraulic Disc Calipers',     'HRD-FOR',       75.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Force+hydraulic+calipers'),
  (11, 'bottom_bracket',   'SRAM DUB BSA Bottom Bracket',            'BSA-DUB',       55.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+DUB+BSA');

-- ── SRAM Red AXS (12s electronic, 2×) ───────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (12, 'cassette',         'SRAM XG-1290 Cassette 10-33T (XDR)',    'XG-1290',      215.00, 'https://www.bike-components.de/de/s/?keywords=XG-1290'),
  (12, 'chain',            'SRAM Flattop Chain Red AXS',             'PC-Red-AXS',    62.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+AXS+chain'),
  (12, 'rear_derailleur',  'SRAM Red AXS Rear Derailleur',           'RD-RED-D1',    720.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+AXS+rear+derailleur'),
  (12, 'front_derailleur', 'SRAM Red AXS Front Derailleur',          'FD-RED-D1',    260.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+AXS+front+derailleur'),
  (12, 'shifters',         'SRAM Red AXS Levers (pair)',             'BL-RED-R',     720.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+AXS+levers'),
  (12, 'crankset',         'SRAM Red AXS Crankset 2× 50/37 175mm', 'FC-RED-1',     520.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+AXS+crankset'),
  (12, 'brake_calipers',   'SRAM Red Hydraulic Disc Calipers',       'HRD-RED',       90.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+Red+hydraulic+calipers'),
  (12, 'bottom_bracket',   'SRAM DUB BSA Bottom Bracket',            'BSA-DUB',       60.00, 'https://www.bike-components.de/de/s/?keywords=SRAM+DUB+BSA');

-- ── Campagnolo Chorus 11s ────────────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (13, 'cassette',         'Campagnolo Chorus Cassette 11-29T',     'CS-CH600',      68.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+cassette+11s'),
  (13, 'chain',            'Campagnolo Chorus Chain 11-speed',       'CN-CH00',       24.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+chain+11s'),
  (13, 'rear_derailleur',  'Campagnolo Chorus Rear Derailleur 11s', 'RD-CH600',      92.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+rear+derailleur'),
  (13, 'front_derailleur', 'Campagnolo Chorus Front Derailleur 11s','FD-CH600',      52.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+front+derailleur'),
  (13, 'shifters',         'Campagnolo Chorus Ergopower 11s (pair)','ST-CH600',     185.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+ergopower+11s'),
  (13, 'crankset',         'Campagnolo Chorus Crankset 52/36 175mm','FC-CH350',     195.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+crankset'),
  (13, 'brake_calipers',   'Campagnolo Chorus Brake Calipers (pair)','BR-CH17',       72.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+brakes'),
  (13, 'bottom_bracket',   'Campagnolo Ultra-Torque BSA BB',        'BB-RM-35',      28.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+ultra-torque+bb');

-- ── Campagnolo Record 11s ────────────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (14, 'cassette',         'Campagnolo Record Cassette 11-29T',     'CS-RE600',     125.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+cassette+11s'),
  (14, 'chain',            'Campagnolo Record Chain 11-speed',       'CN-RE00',       38.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+chain+11s'),
  (14, 'rear_derailleur',  'Campagnolo Record Rear Derailleur 11s', 'RD-RE600',     188.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+rear+derailleur'),
  (14, 'front_derailleur', 'Campagnolo Record Front Derailleur 11s','FD-RE600',      92.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+front+derailleur'),
  (14, 'shifters',         'Campagnolo Record Ergopower 11s (pair)','ST-RE800',     365.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+ergopower+11s'),
  (14, 'crankset',         'Campagnolo Record Crankset 52/36 175mm','FC-RE600',     420.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+crankset'),
  (14, 'brake_calipers',   'Campagnolo Record Brake Calipers (pair)','BR-RE17',       98.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+brakes'),
  (14, 'bottom_bracket',   'Campagnolo Ultra-Torque BSA BB',        'BB-RM-35',      38.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+ultra-torque+bb');

-- ── Campagnolo Super Record 11s ──────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (15, 'cassette',         'Campagnolo Super Record Cassette 11-29T','CS-SR600',     185.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+cassette+11s'),
  (15, 'chain',            'Campagnolo Super Record Chain 11-speed',  'CN-SR600',      55.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+chain+11s'),
  (15, 'rear_derailleur',  'Campagnolo Super Record Rear Der. 11s',  'RD-SR600',     312.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+rear+derailleur'),
  (15, 'front_derailleur', 'Campagnolo Super Record Front Der. 11s', 'FD-SR600',     155.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+front+derailleur'),
  (15, 'shifters',         'Campagnolo Super Record Ergopower (pair)','ST-SR800',     615.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+ergopower+11s'),
  (15, 'crankset',         'Campagnolo Super Record Crankset 175mm', 'FC-SR600',     625.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+crankset'),
  (15, 'brake_calipers',   'Campagnolo Super Record Brakes (pair)',  'BR-SR17',      138.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+brakes'),
  (15, 'bottom_bracket',   'Campagnolo Ultra-Torque BSA BB',         'BB-RM-35',      48.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+ultra-torque+bb');

-- ── Campagnolo Chorus 12s ────────────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (16, 'cassette',         'Campagnolo Chorus Cassette 11-29T N3W', 'CS-CH-R12',     82.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+cassette+12s'),
  (16, 'chain',            'Campagnolo Chorus Chain 12-speed',       'CN-CH1264',     28.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+chain+12s'),
  (16, 'rear_derailleur',  'Campagnolo Chorus Rear Derailleur 12s', 'RD-CH12',      108.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+rear+derailleur+12s'),
  (16, 'front_derailleur', 'Campagnolo Chorus Front Derailleur 12s','FD-CH12',       58.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+front+derailleur+12s'),
  (16, 'shifters',         'Campagnolo Chorus Ergopower 12s (pair)','ST-CH812',     215.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+ergopower+12s'),
  (16, 'crankset',         'Campagnolo Chorus Crankset 52/36 175mm','FC-CH800',     215.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+crankset+12s'),
  (16, 'brake_calipers',   'Campagnolo Chorus Brake Calipers (pair)','BR-CH18',       78.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Chorus+brakes+12s'),
  (16, 'bottom_bracket',   'Campagnolo Ultra-Torque BSA BB 12s',    'BB-RM-68',      32.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+ultra-torque+bb+12s');

-- ── Campagnolo Record 12s ────────────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (17, 'cassette',         'Campagnolo Record Cassette 11-29T N3W', 'CS-RE-R12',    158.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+cassette+12s'),
  (17, 'chain',            'Campagnolo Record Chain 12-speed',       'CN-RE1264',     48.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+chain+12s'),
  (17, 'rear_derailleur',  'Campagnolo Record Rear Derailleur 12s', 'RD-RE12',      225.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+rear+derailleur+12s'),
  (17, 'front_derailleur', 'Campagnolo Record Front Derailleur 12s','FD-RE12',      108.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+front+derailleur+12s'),
  (17, 'shifters',         'Campagnolo Record Ergopower 12s (pair)','ST-RE812',     468.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+ergopower+12s'),
  (17, 'crankset',         'Campagnolo Record Crankset 52/36 175mm','FC-RE800',     498.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+crankset+12s'),
  (17, 'brake_calipers',   'Campagnolo Record Brake Calipers (pair)','BR-RE18',      108.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Record+brakes+12s'),
  (17, 'bottom_bracket',   'Campagnolo Ultra-Torque BSA BB 12s',    'BB-RM-68',      42.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+ultra-torque+bb+12s');

-- ── Campagnolo Super Record 12s ──────────────────────────────
INSERT INTO components (groupset_id, category, name, model_number, price_eur, affiliate_url) VALUES
  (18, 'cassette',         'Campagnolo Super Record Cassette N3W',   'CS-SR-R12',    265.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+cassette+12s'),
  (18, 'chain',            'Campagnolo Super Record Chain 12-speed',  'CN-SR1264',     68.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+chain+12s'),
  (18, 'rear_derailleur',  'Campagnolo Super Record Rear Der. 12s',  'RD-SR12',      418.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+rear+derailleur+12s'),
  (18, 'front_derailleur', 'Campagnolo Super Record Front Der. 12s', 'FD-SR12',      198.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+front+derailleur+12s'),
  (18, 'shifters',         'Campagnolo Super Record Ergopower (pair)','ST-SR812',     835.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+ergopower+12s'),
  (18, 'crankset',         'Campagnolo Super Record Crankset 175mm', 'FC-SR800',     848.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+crankset+12s'),
  (18, 'brake_calipers',   'Campagnolo Super Record Brakes (pair)',  'BR-SR18',      148.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+Super+Record+brakes+12s'),
  (18, 'bottom_bracket',   'Campagnolo Ultra-Torque BSA BB 12s',     'BB-RM-68',      52.00, 'https://www.bike-components.de/de/s/?keywords=Campagnolo+ultra-torque+bb+12s');

-- ============================================================
-- Sources – manufacturer documentation and citations
-- ============================================================

CREATE TABLE sources (
  id serial PRIMARY KEY,
  title text NOT NULL,
  publisher text NOT NULL,
  doc_type text NOT NULL,       -- 'dealer_manual' | 'compatibility_chart' | 'support_article' | 'reference'
  url text,
  page_ref text,                -- e.g. "p. 12", "Road 11-speed section", NULL if full doc
  excerpt text,                 -- direct quote or accurate paraphrase
  is_direct_quote boolean DEFAULT false
);

-- junction: many sources can support one rule, one source can support many rules
CREATE TABLE rule_sources (
  rule_id integer REFERENCES compatibility_rules(id) ON DELETE CASCADE,
  source_id integer REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY (rule_id, source_id)
);

-- ── Source records ───────────────────────────────────────────
INSERT INTO sources (id, title, publisher, doc_type, url, page_ref, excerpt, is_direct_quote) VALUES

  -- Shimano 11s: combined dealer manual covering R7000 + R8000 + R9100 derailleurs in one document
  (1,
   'Shimano Dealer''s Manual – RD-R7000 / RD-R8000 / RD-R9100 (DM-RARD001-04)',
   'Shimano',
   'dealer_manual',
   'https://si.shimano.com/en/pdfs/dm/RARD001/DM-RARD001-04-ENG.pdf',
   NULL,
   'Shimano publishes a single combined dealer''s manual (DM-RARD001) covering the RD-R9100 (Dura-Ace), RD-R8000 (Ultegra), and RD-R7000 (105) rear derailleurs with identical procedures and torque specs. Publishing them in one document is Shimano''s way of confirming they belong to the same 11-speed road compatibility group.',
   false),

  -- Shimano 2024-2025 official compatibility chart – the authoritative source
  (2,
   'Shimano 2024–2025 Road Product Compatibility Chart (v032)',
   'Shimano',
   'compatibility_chart',
   'https://productinfo.shimano.com/pdfs/product/archive/2024-2025_Compatibility_v032_en.pdf',
   'Road – 11-speed and 12-speed sections',
   'Shimano''s official compatibility chart (updated May 2025) groups all 11-speed road components (R7000/R8000/R9100) and all 12-speed Di2 components (R7100/R8100/R9200) into separate, internally cross-compatible families.',
   false),

  -- Shimano 12s: combined dealer manual for cassettes CS-R7100 / CS-R8100 / CS-R9200
  (3,
   'Shimano Dealer''s Manual – CS-R7100 / CS-R8100 / CS-R9200 Cassette (DM-RACS010-04)',
   'Shimano',
   'dealer_manual',
   'https://si.shimano.com/en/pdfs/dm/RACS010/DM-RACS010-04-ENG.pdf',
   NULL,
   'Shimano''s combined cassette manual covers CS-R9200, CS-R8100, and CS-R7100 in a single document, confirming shared sprocket pitch and HG-EV freehub interface across the 12-speed road Di2 family.',
   false),

  -- SRAM AXS cross-tier compatibility – direct quote from official SRAM support
  (4,
   'SRAM Support: Is Rival eTap AXS compatible with RED or Force eTap AXS parts?',
   'SRAM',
   'support_article',
   'https://support.sram.com/hc/en-us/articles/6043277756187-Is-Rival-eTap-AXS-compatible-with-SRAM-RED-or-Force-eTap-AXS-parts',
   NULL,
   'Many parts are cross compatible between SRAM RED, Force, and Rival eTap AXS such as 12-speed Flattop chains, 12-speed cassettes from 10-28T up to 10-36T, shifter controls, and power meters.',
   true),

  -- SRAM XDR freehub requirement – direct quote from official SRAM support
  (5,
   'SRAM Support: What freehub body is required for AXS road cassettes?',
   'SRAM',
   'support_article',
   'https://support.sram.com/hc/en-us/articles/6526832603163-What-type-of-freehub-body-is-required-for-SRAM-RED-Force-and-Rival-eTap-AXS-road-cassettes',
   NULL,
   'SRAM RED, Force and Rival eTap AXS road cassettes require the XDR freehub.',
   true),

  -- SRAM 11s DoubleTap compatibility – service documentation
  (6,
   'SRAM Road Service Documentation – 11-speed Mechanical',
   'SRAM',
   'support_article',
   'https://www.sram.com/en/service/road',
   'Road 11-speed mechanical',
   'SRAM Rival 22, Force 22, and Red 22 share the same DoubleTap actuation ratio and cable interface, making their rear derailleurs, shifters, and cassettes cross-compatible within the 11-speed road family.',
   false),

  -- Campagnolo documentation portal
  (7,
   'Campagnolo Technical Support & Documentation',
   'Campagnolo',
   'support_article',
   'https://www.campagnolo.com/lu-en/technical-support-area/documentation/',
   'Groupset compatibility section',
   'Campagnolo 11-speed Ergopower levers, rear derailleurs, and cassettes across Chorus, Record, and Super Record share the same cable pull ratio and freehub interface, enabling full cross-compatibility within the 11-speed range.',
   false),

  -- Campagnolo N3W + 12s compatibility – bikerumor detailed article with direct quote
  (8,
   'Campagnolo N3W in Detail: How Campy''s New Freehub Fits All 10–13-speed Cassettes',
   'Bike Rumor',
   'reference',
   'https://bikerumor.com/campagnolo-n3w-in-detail-how-campys-new-freehub-body-fits-all-10-13-speed-cassettes/',
   NULL,
   'The 11-29 and 11-32 ratios work with the full range of Campagnolo 12-speed mechanical groupsets—Chorus, Record, and Super Record.',
   true),

  -- Technical cable pull / derailleur ratio reference (Bikegremlin)
  (9,
   'Bicycle Rear Derailleur Compatibility – Shift Ratio & Cable Pull Reference',
   'BikeGremlin',
   'reference',
   'https://bike.bikegremlin.com/1278/bicycle-rear-derailleur-compatibility/',
   'Cable actuation ratios section',
   'Shimano, SRAM and Campagnolo all use different cable-pull ratios for mechanical groupsets. Mixing parts with different cable-pull ratios will result in very poor shifting.',
   true),

  -- Wikibooks gear-changing dimensions – specific numerical values
  (10,
   'Bicycles / Maintenance and Repair / Gear-changing Dimensions',
   'Wikibooks',
   'reference',
   'https://en.wikibooks.org/wiki/Bicycles/Maintenance_and_Repair/Gear-changing_Dimensions',
   'Sprocket pitch and cable pull table',
   'Reference table of cable pull and sprocket pitch values. Shimano 11-speed road: ~2.7 mm cable pull. Campagnolo 11-speed: ~2.6 mm. SRAM DoubleTap (Rival/Force/Red 22): different actuation ratio. 11-speed sprocket pitch ~3.95 mm; 12-speed ~3.58 mm.',
   false);

-- ── Rule → Source links ──────────────────────────────────────
-- Rules 1-3 = Shimano 11s compatible pairs
INSERT INTO rule_sources (rule_id, source_id) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 2),
  (3, 1), (3, 2);

-- Rules 4-6 = Shimano 12s compatible pairs
INSERT INTO rule_sources (rule_id, source_id) VALUES
  (4, 2), (4, 3),
  (5, 2), (5, 3),
  (6, 2), (6, 3);

-- Rules 7-9 = SRAM 11s compatible pairs
INSERT INTO rule_sources (rule_id, source_id) VALUES
  (7, 6), (7, 9),
  (8, 6), (8, 9),
  (9, 6), (9, 9);

-- Rules 10-12 = SRAM AXS compatible pairs
INSERT INTO rule_sources (rule_id, source_id) VALUES
  (10, 4), (10, 5),
  (11, 4), (11, 5),
  (12, 4), (12, 5);

-- Rules 13-15 = Campagnolo 11s compatible pairs
INSERT INTO rule_sources (rule_id, source_id) VALUES
  (13, 7), (13, 9),
  (14, 7), (14, 9),
  (15, 7), (15, 9);

-- Rules 16-18 = Campagnolo 12s compatible pairs
INSERT INTO rule_sources (rule_id, source_id) VALUES
  (16, 7), (16, 8),
  (17, 7), (17, 8),
  (18, 7), (18, 8);
