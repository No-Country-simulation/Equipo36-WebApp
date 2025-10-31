--
-- PostgreSQL database dump
--

\restrict QMbPh3rhZWTkLBEUdEgsPYxBtMUsfECTOP7jQ1n4wbQlHfhnMy4HfL2wb31mvd9

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.users (id, created_at, email, keycloak_id, role, updated_at, username) FROM stdin;
9a7b8c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d	2025-10-15 12:23:33.069071	juan.garcia@vitalmedic.com	00000000-0000-0000-0000-000000000001	DOCTOR	2025-10-15 12:23:33.069071	juan.garcia
1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e	2025-10-15 12:23:33.264113	maria.lopez@vitalmedic.com	00000000-0000-0000-0000-000000000002	DOCTOR	2025-10-15 12:23:33.264113	maria.lopez
2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f	2025-10-15 12:23:33.347869	carlos.martinez@vitalmedic.com	00000000-0000-0000-0000-000000000003	DOCTOR	2025-10-15 12:23:33.347869	carlos.martinez
c10e513d-04eb-4ccf-9771-9b67932e13d1	2025-10-15 12:50:07.370398	janiebauch02@gmail.com	40c44019-1f27-49a9-ba82-9de3c002691f	PATIENT	2025-10-15 12:50:07.370398	janiebauch02
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.patients (id, address, birth_date, fhir_id, first_name, gender, imported_from_fhir, last_name, onboarding_status, phone) FROM stdin;
c10e513d-04eb-4ccf-9771-9b67932e13d1	\N	\N	\N	\N	\N	f	\N	PENDING_IDENTIFIER	\N
\.


--
-- Data for Name: allergies; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.allergies (id, criticality, fhir_id, reaction, reaction_description, severity, substance, patient_id) FROM stdin;
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.doctors (id, experience, first_name, last_name, license_number, phone, specialty) FROM stdin;
9a7b8c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d	5 años de experiencia en medicina general	Juan	García	MED-2020-001	+56912345678	Medicina General
1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e	8 años de experiencia en cardiología	María	López	MED-2019-002	+56987654321	Cardiología
2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f	3 años de experiencia en pediatría	Carlos	Martínez	MED-2021-003	+56998765432	Pediatría
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.appointments (id, end_at, fhir_id, reason, room_id, start_at, status, doctor_id, patient_id) FROM stdin;
\.


--
-- Data for Name: conditions; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.conditions (id, clinical_status, code, description, fhir_id, start_date, patient_id) FROM stdin;
\.


--
-- Data for Name: medications; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.medications (id, dosage, effective_date, fhir_id, medication_name, status, patient_id) FROM stdin;
\.


--
-- Data for Name: observations; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.observations (id, code, date, fhir_id, unit, value, patient_id) FROM stdin;
\.


--
-- Data for Name: patient_identifiers; Type: TABLE DATA; Schema: public; Owner: vitalmedic_user
--

COPY public.patient_identifiers (id, system, value, patient_id) FROM stdin;
\.


--
-- Name: allergies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vitalmedic_user
--

SELECT pg_catalog.setval('public.allergies_id_seq', 1, false);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vitalmedic_user
--

SELECT pg_catalog.setval('public.appointments_id_seq', 1, false);


--
-- Name: conditions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vitalmedic_user
--

SELECT pg_catalog.setval('public.conditions_id_seq', 1, false);


--
-- Name: medications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vitalmedic_user
--

SELECT pg_catalog.setval('public.medications_id_seq', 1, false);


--
-- Name: observations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vitalmedic_user
--

SELECT pg_catalog.setval('public.observations_id_seq', 1, false);


--
-- Name: patient_identifiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vitalmedic_user
--

SELECT pg_catalog.setval('public.patient_identifiers_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict QMbPh3rhZWTkLBEUdEgsPYxBtMUsfECTOP7jQ1n4wbQlHfhnMy4HfL2wb31mvd9

