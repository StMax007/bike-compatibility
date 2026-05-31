-- ============================================================
-- Schema
-- ============================================================
create table if not exists groupsets (
  id serial primary key,
  name text not null,
  speeds integer not null,
  generation text not null
);

create table if not exists components (
  id serial primary key,
  groupset_id integer references groupsets(id),
  category text not null,
  name text not null,
  model_number text,
  price_eur numeric(8,2),
  affiliate_url text
);

create table if not exists compatibility_rules (
  id serial primary key,
  groupset_a_id integer references groupsets(id),
  groupset_b_id integer references groupsets(id),
  status text not null,
  note text
);

-- ============================================================
-- Groupsets
-- ============================================================
insert into groupsets (id, name, speeds, generation) values
  (1, 'Shimano 105 R7000',       11, 'R7000'),
  (2, 'Shimano Ultegra R8000',   11, 'R8000'),
  (3, 'Shimano Dura-Ace R9100',  11, 'R9100'),
  (4, 'Shimano 105 R7100',       12, 'R7100'),
  (5, 'Shimano Ultegra R8100',   12, 'R8100'),
  (6, 'Shimano Dura-Ace R9200',  12, 'R9200');

-- ============================================================
-- Compatibility Rules
-- 11-speed (1,2,3) ↔ each other: compatible
-- 12-speed (4,5,6) ↔ each other: compatible
-- 11-speed ↔ 12-speed: incompatible
-- ============================================================

-- 11-speed ↔ 11-speed
insert into compatibility_rules (groupset_a_id, groupset_b_id, status) values
  (1, 2, 'compatible'),
  (1, 3, 'compatible'),
  (2, 3, 'compatible');

-- 12-speed ↔ 12-speed
insert into compatibility_rules (groupset_a_id, groupset_b_id, status) values
  (4, 5, 'compatible'),
  (4, 6, 'compatible'),
  (5, 6, 'compatible');

-- 11-speed ↔ 12-speed (all incompatible)
insert into compatibility_rules (groupset_a_id, groupset_b_id, status, note) values
  (1, 4, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (1, 5, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (1, 6, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (2, 4, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (2, 5, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (2, 6, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (3, 4, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (3, 5, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable'),
  (3, 6, 'incompatible', '11-speed and 12-speed chains, cassettes, and derailleurs are not interchangeable');

-- ============================================================
-- Components (cassette, chain, rear_derailleur per groupset)
-- ============================================================

-- Shimano 105 R7000 (11-speed)
insert into components (groupset_id, category, name, model_number, price_eur, affiliate_url) values
  (1, 'cassette',        'Shimano 105 Cassette 11-28T',        'CS-R7000-11',  42.90, 'https://www.bike-components.de/de/s/?keywords=CS-R7000-11'),
  (1, 'chain',           'Shimano 105 Chain 11-speed',          'CN-HG601-11',  22.50, 'https://www.bike-components.de/de/s/?keywords=CN-HG601-11'),
  (1, 'rear_derailleur', 'Shimano 105 Rear Derailleur SS',      'RD-R7000-SS',  59.90, 'https://www.bike-components.de/de/s/?keywords=RD-R7000-SS');

-- Shimano Ultegra R8000 (11-speed)
insert into components (groupset_id, category, name, model_number, price_eur, affiliate_url) values
  (2, 'cassette',        'Shimano Ultegra Cassette 11-28T',     'CS-R8000-11',  69.90, 'https://www.bike-components.de/de/s/?keywords=CS-R8000-11'),
  (2, 'chain',           'Shimano Ultegra Chain 11-speed',       'CN-HG701-11',  34.90, 'https://www.bike-components.de/de/s/?keywords=CN-HG701-11'),
  (2, 'rear_derailleur', 'Shimano Ultegra Rear Derailleur SS',   'RD-R8000-SS',  94.90, 'https://www.bike-components.de/de/s/?keywords=RD-R8000-SS');

-- Shimano Dura-Ace R9100 (11-speed)
insert into components (groupset_id, category, name, model_number, price_eur, affiliate_url) values
  (3, 'cassette',        'Shimano Dura-Ace Cassette 11-28T',    'CS-R9100-11',  239.90, 'https://www.bike-components.de/de/s/?keywords=CS-R9100-11'),
  (3, 'chain',           'Shimano Dura-Ace Chain 11-speed',      'CN-HG901-11',   49.90, 'https://www.bike-components.de/de/s/?keywords=CN-HG901-11'),
  (3, 'rear_derailleur', 'Shimano Dura-Ace Rear Derailleur SS',  'RD-R9100-SS',  249.90, 'https://www.bike-components.de/de/s/?keywords=RD-R9100-SS');

-- Shimano 105 R7100 (12-speed)
insert into components (groupset_id, category, name, model_number, price_eur, affiliate_url) values
  (4, 'cassette',        'Shimano 105 Cassette 11-34T',         'CS-R7100-12',   54.90, 'https://www.bike-components.de/de/s/?keywords=CS-R7100-12'),
  (4, 'chain',           'Shimano 105 Chain 12-speed',           'CN-M7100-12',   29.90, 'https://www.bike-components.de/de/s/?keywords=CN-M7100-12'),
  (4, 'rear_derailleur', 'Shimano 105 Rear Derailleur Di2',      'RD-R7150-D',   159.90, 'https://www.bike-components.de/de/s/?keywords=RD-R7150-D');

-- Shimano Ultegra R8100 (12-speed)
insert into components (groupset_id, category, name, model_number, price_eur, affiliate_url) values
  (5, 'cassette',        'Shimano Ultegra Cassette 11-34T',     'CS-R8100-12',   79.90, 'https://www.bike-components.de/de/s/?keywords=CS-R8100-12'),
  (5, 'chain',           'Shimano Ultegra Chain 12-speed',       'CN-M8100-12',   44.90, 'https://www.bike-components.de/de/s/?keywords=CN-M8100-12'),
  (5, 'rear_derailleur', 'Shimano Ultegra Rear Derailleur Di2',  'RD-R8150-D',   239.90, 'https://www.bike-components.de/de/s/?keywords=RD-R8150-D');

-- Shimano Dura-Ace R9200 (12-speed)
insert into components (groupset_id, category, name, model_number, price_eur, affiliate_url) values
  (6, 'cassette',        'Shimano Dura-Ace Cassette 11-30T',    'CS-R9200-12',  299.90, 'https://www.bike-components.de/de/s/?keywords=CS-R9200-12'),
  (6, 'chain',           'Shimano Dura-Ace Chain 12-speed',      'CN-M9100-12',   64.90, 'https://www.bike-components.de/de/s/?keywords=CN-M9100-12'),
  (6, 'rear_derailleur', 'Shimano Dura-Ace Rear Derailleur Di2', 'RD-R9250-D',   499.90, 'https://www.bike-components.de/de/s/?keywords=RD-R9250-D');
