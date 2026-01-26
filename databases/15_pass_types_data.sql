INSERT INTO pass_types (name_fr, name_en, description_fr, description_en, price_fr, price_en, features_fr, features_en, tag_fr, tag_en, display_order, is_active) VALUES
(
    'Pass Conférence',
    'Conference Pass',
    'Accès au Jour 1',
    'Access to Day 1',
    'Gratuit',
    'Free',
    '["Accès aux keynotes & panels", "Sessions de networking", "Pause café"]',
    '["Access to keynotes & panels", "Networking sessions", "Coffee break"]',
    NULL,
    NULL,
    1,
    TRUE
),
(
    'Pass Complet',
    'Full Pass',
    'Conférence + Bootcamp',
    'Conference + Bootcamp',
    'Gratuit',
    'Free',
    '["Tous les avantages Conférence", "Participation au bootcamp (Jour 2)", "Déjeuner et mentorat"]',
    '["All Conference benefits", "Bootcamp participation (Day 2)", "Lunch and mentoring"]',
    'RECOMMANDÉ',
    'RECOMMENDED',
    2,
    TRUE
),
(
    'Pass Bootcamp',
    'Bootcamp Pass',
    'Accès au Jour 2 (sur sélection)',
    'Access to Day 2 (by selection)',
    'Gratuit',
    'Free',
    '["Ateliers de co-création", "Prototypage de solutions", "Accès aux mentors"]',
    '["Co-creation workshops", "Solution prototyping", "Access to mentors"]',
    NULL,
    NULL,
    3,
    TRUE
);
