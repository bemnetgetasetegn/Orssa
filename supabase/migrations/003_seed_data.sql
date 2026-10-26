-- ============================================================
-- ORSA RECRUITMENT MANAGEMENT SYSTEM
-- Migration 003: Seed Data
-- ============================================================

-- ============================================================
-- JOB OFFERS SEED
-- ============================================================

INSERT INTO job_offers (id, title, slug, description, responsibilities, default_work_location, default_visa_duration, currency, is_active)
VALUES
(
  uuid_generate_v4(),
  'Construction Worker',
  'construction-worker',
  'We are seeking skilled Construction Workers to join our team on international construction projects. The successful candidate will be responsible for a variety of tasks including building, renovating, and maintaining structures in accordance with safety regulations and project specifications.',
  'Perform general construction tasks including laying foundations, framing, and installing fixtures. Operate construction equipment and tools safely and efficiently. Read and interpret blueprints, drawings, and specifications. Assist with the transportation and unloading of building materials. Maintain a clean and safe work environment. Collaborate with team members and supervisors to meet project deadlines. Follow all health and safety guidelines and regulations. Report any hazards or safety concerns to the site manager.',
  'To Be Determined',
  'To Be Determined',
  'USD',
  true
),
(
  uuid_generate_v4(),
  'Industrial Factory Worker',
  'industrial-factory-worker',
  'We are looking for dedicated Industrial Factory Workers to contribute to our manufacturing operations. The role involves working in a fast-paced production environment, operating machinery, and ensuring quality standards are maintained throughout the production process.',
  'Operate and monitor industrial machinery and equipment. Perform quality control checks on products at various stages of production. Load and unload raw materials and finished goods. Maintain accurate production records and documentation. Follow standard operating procedures (SOPs) for all production activities. Ensure compliance with health, safety, and environmental regulations. Perform routine maintenance and cleaning of machinery. Work collaboratively with team members to meet production targets.',
  'To Be Determined',
  'To Be Determined',
  'USD',
  true
),
(
  uuid_generate_v4(),
  'Warehouse Worker',
  'warehouse-worker',
  'We are recruiting experienced Warehouse Workers to support logistics and supply chain operations. The successful candidates will be responsible for receiving, storing, and dispatching goods while maintaining accurate inventory records and ensuring the efficient operation of our warehouse facilities.',
  'Receive, inspect, and document incoming shipments. Pick, pack, and prepare orders for dispatch according to customer requirements. Operate warehouse equipment including forklifts, pallet jacks, and conveyor systems. Maintain accurate inventory records using warehouse management systems (WMS). Organize and store goods in designated locations within the warehouse. Conduct regular stock counts and reconcile inventory discrepancies. Ensure the warehouse is clean, organized, and compliant with safety standards. Collaborate with logistics teams to coordinate timely deliveries.',
  'To Be Determined',
  'To Be Determined',
  'USD',
  true
);

-- ============================================================
-- DEFAULT LETTER TEMPLATES SEED
-- ============================================================

INSERT INTO letter_templates (name, job_offer_id, content_json, content_html, version, is_active)
SELECT
  'Default Construction Worker Template',
  id,
  '{
    "company_name": "Orsa International Recruitment Agency",
    "company_address": "123 Business District, International Plaza",
    "company_email": "recruitment@orsa.com",
    "company_phone": "+1 (555) 000-0000",
    "greeting": "Dear {{employee_name}},",
    "introduction": "We are pleased to extend this formal employment offer to you following your successful application to Orsa International Recruitment Agency. After careful review of your qualifications and experience, we are confident that you will be a valuable addition to our team.",
    "offer_body": "We are offering you the position of Construction Worker based at {{work_location}}. This opportunity has been secured through our international recruitment network and represents an excellent career development prospect.",
    "responsibilities_intro": "In this role, you will be expected to fulfill the following responsibilities:",
    "compensation": "Your compensation package and specific contractual terms will be provided in a separate employment contract. All terms including salary, working hours, and benefits will be formally documented and agreed upon prior to commencement of employment.",
    "visa_info": "Visa processing and work permit arrangements will be coordinated by our agency in accordance with {{visa_duration}} visa duration requirements.",
    "accommodation": "Accommodation arrangements will be discussed and confirmed as part of your employment package.",
    "food_allowance": "Meal and food allowance details will be included in your formal employment contract.",
    "medical": "Medical insurance coverage will be provided as per the employment terms agreed between all parties.",
    "leave": "Annual leave entitlement will be specified in your employment contract in accordance with local labor regulations.",
    "career_development": "Orsa International Recruitment Agency is committed to supporting your professional growth and development throughout your employment.",
    "acceptance_instructions": "To accept this offer, please confirm your acceptance by responding to this letter within the specified deadline. Further instructions regarding documentation and pre-departure procedures will follow upon your acceptance.",
    "closing": "We look forward to welcoming you to the team and wish you every success in this new chapter of your career.",
    "signatory_name": "Recruitment Director",
    "signatory_title": "Orsa International Recruitment Agency",
    "footer": "Orsa International Recruitment Agency | Registered Recruitment Firm | All Rights Reserved"
  }',
  '<p>This is a default template. Please edit through the template editor.</p>',
  1,
  true
FROM job_offers WHERE slug = 'construction-worker';

INSERT INTO letter_templates (name, job_offer_id, content_json, content_html, version, is_active)
SELECT
  'Default Industrial Factory Worker Template',
  id,
  '{
    "company_name": "Orsa International Recruitment Agency",
    "company_address": "123 Business District, International Plaza",
    "company_email": "recruitment@orsa.com",
    "company_phone": "+1 (555) 000-0000",
    "greeting": "Dear {{employee_name}},",
    "introduction": "We are pleased to extend this formal employment offer to you following your successful application to Orsa International Recruitment Agency. After careful review of your qualifications and experience, we are confident that you will be a valuable addition to our team.",
    "offer_body": "We are offering you the position of Industrial Factory Worker based at {{work_location}}. This opportunity has been secured through our international recruitment network and represents an excellent career development prospect.",
    "responsibilities_intro": "In this role, you will be expected to fulfill the following responsibilities:",
    "compensation": "Your compensation package and specific contractual terms will be provided in a separate employment contract. All terms including salary, working hours, and benefits will be formally documented and agreed upon prior to commencement of employment.",
    "visa_info": "Visa processing and work permit arrangements will be coordinated by our agency in accordance with {{visa_duration}} visa duration requirements.",
    "accommodation": "Accommodation arrangements will be discussed and confirmed as part of your employment package.",
    "food_allowance": "Meal and food allowance details will be included in your formal employment contract.",
    "medical": "Medical insurance coverage will be provided as per the employment terms agreed between all parties.",
    "leave": "Annual leave entitlement will be specified in your employment contract in accordance with local labor regulations.",
    "career_development": "Orsa International Recruitment Agency is committed to supporting your professional growth and development throughout your employment.",
    "acceptance_instructions": "To accept this offer, please confirm your acceptance by responding to this letter within the specified deadline. Further instructions regarding documentation and pre-departure procedures will follow upon your acceptance.",
    "closing": "We look forward to welcoming you to the team and wish you every success in this new chapter of your career.",
    "signatory_name": "Recruitment Director",
    "signatory_title": "Orsa International Recruitment Agency",
    "footer": "Orsa International Recruitment Agency | Registered Recruitment Firm | All Rights Reserved"
  }',
  '<p>This is a default template. Please edit through the template editor.</p>',
  1,
  true
FROM job_offers WHERE slug = 'industrial-factory-worker';

INSERT INTO letter_templates (name, job_offer_id, content_json, content_html, version, is_active)
SELECT
  'Default Warehouse Worker Template',
  id,
  '{
    "company_name": "Orsa International Recruitment Agency",
    "company_address": "123 Business District, International Plaza",
    "company_email": "recruitment@orsa.com",
    "company_phone": "+1 (555) 000-0000",
    "greeting": "Dear {{employee_name}},",
    "introduction": "We are pleased to extend this formal employment offer to you following your successful application to Orsa International Recruitment Agency. After careful review of your qualifications and experience, we are confident that you will be a valuable addition to our team.",
    "offer_body": "We are offering you the position of Warehouse Worker based at {{work_location}}. This opportunity has been secured through our international recruitment network and represents an excellent career development prospect.",
    "responsibilities_intro": "In this role, you will be expected to fulfill the following responsibilities:",
    "compensation": "Your compensation package and specific contractual terms will be provided in a separate employment contract. All terms including salary, working hours, and benefits will be formally documented and agreed upon prior to commencement of employment.",
    "visa_info": "Visa processing and work permit arrangements will be coordinated by our agency in accordance with {{visa_duration}} visa duration requirements.",
    "accommodation": "Accommodation arrangements will be discussed and confirmed as part of your employment package.",
    "food_allowance": "Meal and food allowance details will be included in your formal employment contract.",
    "medical": "Medical insurance coverage will be provided as per the employment terms agreed between all parties.",
    "leave": "Annual leave entitlement will be specified in your employment contract in accordance with local labor regulations.",
    "career_development": "Orsa International Recruitment Agency is committed to supporting your professional growth and development throughout your employment.",
    "acceptance_instructions": "To accept this offer, please confirm your acceptance by responding to this letter within the specified deadline. Further instructions regarding documentation and pre-departure procedures will follow upon your acceptance.",
    "closing": "We look forward to welcoming you to the team and wish you every success in this new chapter of your career.",
    "signatory_name": "Recruitment Director",
    "signatory_title": "Orsa International Recruitment Agency",
    "footer": "Orsa International Recruitment Agency | Registered Recruitment Firm | All Rights Reserved"
  }',
  '<p>This is a default template. Please edit through the template editor.</p>',
  1,
  true
FROM job_offers WHERE slug = 'warehouse-worker';
