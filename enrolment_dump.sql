--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Ubuntu 17.5-1.pgdg22.04+1)
-- Dumped by pg_dump version 17.5 (Ubuntu 17.5-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.admins (
    departement character varying(255),
    internal_code character varying(255),
    id integer NOT NULL
);


ALTER TABLE public.admins OWNER TO mike_react;

--
-- Name: document; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.document (
    id integer NOT NULL,
    created_date timestamp(6) without time zone,
    last_modified_date timestamp(6) without time zone,
    content_type character varying(255),
    filedata bytea,
    name character varying(255),
    rejection_reason character varying(255),
    upload_date timestamp(6) without time zone,
    validation_date timestamp(6) without time zone,
    validation_status smallint,
    enrollment_id integer,
    CONSTRAINT document_validation_status_check CHECK (((validation_status >= 0) AND (validation_status <= 3)))
);


ALTER TABLE public.document OWNER TO mike_react;

--
-- Name: document_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.document_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_seq OWNER TO mike_react;

--
-- Name: enrollment; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.enrollment (
    id integer NOT NULL,
    created_date timestamp(6) without time zone,
    last_modified_date timestamp(6) without time zone,
    average_grade double precision,
    diploma character varying(255),
    graduation_year timestamp(6) without time zone,
    previous_school character varying(255),
    academic_year character varying(255),
    address character varying(255),
    email character varying(255),
    people_to_contact character varying(255),
    phone_number character varying(255),
    nationality character varying(255),
    date_of_birth date,
    first_name character varying(255),
    gender smallint,
    last_name character varying(255),
    status smallint,
    step_completed integer NOT NULL,
    submission_date timestamp(6) without time zone,
    validation_date timestamp(6) without time zone,
    program_id integer,
    student_id integer,
    CONSTRAINT enrollment_gender_check CHECK (((gender >= 0) AND (gender <= 1))),
    CONSTRAINT enrollment_status_check CHECK (((status >= 0) AND (status <= 6)))
);


ALTER TABLE public.enrollment OWNER TO mike_react;

--
-- Name: enrollment_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.enrollment_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollment_seq OWNER TO mike_react;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    created_date timestamp(6) without time zone,
    last_modified_date timestamp(6) without time zone,
    is_read boolean NOT NULL,
    message character varying(255),
    reference_id integer,
    send_date timestamp(6) without time zone,
    subject character varying(255),
    user_id integer
);


ALTER TABLE public.notification OWNER TO mike_react;

--
-- Name: notification_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.notification_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_seq OWNER TO mike_react;

--
-- Name: program; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.program (
    id integer NOT NULL,
    created_date timestamp(6) without time zone,
    last_modified_date timestamp(6) without time zone,
    description character varying(255),
    max_capacity integer NOT NULL,
    program_code character varying(255),
    program_name character varying(255),
    registration_end_date date,
    registration_fee double precision NOT NULL,
    registration_start_date date
);


ALTER TABLE public.program OWNER TO mike_react;

--
-- Name: program_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.program_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.program_seq OWNER TO mike_react;

--
-- Name: role; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.role OWNER TO mike_react;

--
-- Name: role_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.role_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_seq OWNER TO mike_react;

--
-- Name: students; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.students (
    address character varying(255),
    date_of_birth date,
    desired_academic_year integer NOT NULL,
    gender character varying(255),
    intended_field_of_study character varying(255),
    marital_status character varying(255),
    nationality character varying(255),
    phone_number character varying(255),
    id integer NOT NULL,
    CONSTRAINT students_gender_check CHECK (((gender)::text = ANY ((ARRAY['MASCULIN'::character varying, 'FEMININ'::character varying])::text[]))),
    CONSTRAINT students_marital_status_check CHECK (((marital_status)::text = ANY ((ARRAY['SINGLE'::character varying, 'MARRIED'::character varying, 'DIVORCED'::character varying, 'WIDOW'::character varying])::text[])))
);


ALTER TABLE public.students OWNER TO mike_react;

--
-- Name: token; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.token (
    id integer NOT NULL,
    created_at timestamp(6) without time zone,
    expired boolean NOT NULL,
    expires_at timestamp(6) without time zone,
    revoked boolean NOT NULL,
    token character varying(255),
    validated_at timestamp(6) without time zone,
    user_id integer NOT NULL
);


ALTER TABLE public.token OWNER TO mike_react;

--
-- Name: token_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.token_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.token_seq OWNER TO mike_react;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mike_react
--

CREATE TABLE public.users (
    user_type character varying(31) NOT NULL,
    id integer NOT NULL,
    account_locked boolean NOT NULL,
    created_date timestamp(6) without time zone,
    email character varying(255),
    enabled boolean NOT NULL,
    firstname character varying(255),
    last_modified_date timestamp(6) without time zone,
    lastname character varying(255),
    password character varying(255),
    role_id integer
);


ALTER TABLE public.users OWNER TO mike_react;

--
-- Name: users_seq; Type: SEQUENCE; Schema: public; Owner: mike_react
--

CREATE SEQUENCE public.users_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_seq OWNER TO mike_react;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.admins (departement, internal_code, id) FROM stdin;
\.


--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.document (id, created_date, last_modified_date, content_type, filedata, name, rejection_reason, upload_date, validation_date, validation_status, enrollment_id) FROM stdin;
\.


--
-- Data for Name: enrollment; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.enrollment (id, created_date, last_modified_date, average_grade, diploma, graduation_year, previous_school, academic_year, address, email, people_to_contact, phone_number, nationality, date_of_birth, first_name, gender, last_name, status, step_completed, submission_date, validation_date, program_id, student_id) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.notification (id, created_date, last_modified_date, is_read, message, reference_id, send_date, subject, user_id) FROM stdin;
\.


--
-- Data for Name: program; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.program (id, created_date, last_modified_date, description, max_capacity, program_code, program_name, registration_end_date, registration_fee, registration_start_date) FROM stdin;
3	\N	\N	Apprentissage du langage Python et de ses applications	60	PYTH-301	Python Programming Language	2025-11-04	250000	2025-08-04
4	\N	\N	Programmation créative et développement intuitif	40	VIBE-401	Vibe Coding	2025-11-04	180000	2025-08-04
5	\N	\N	Maîtrise du framework Spring Boot pour le développement backend	50	JAVA-501	Master Java Spring Boot	2025-11-04	300000	2025-08-04
1	\N	\N	Étude des événements passés et de leur impact sur le présent.	100	HIS_101	Histoire	2025-11-04	150000	2025-08-04
2	\N	\N	Algèbre, géométrie et analyse mathématique.	80	MAT_201	Mathématiques	2025-11-04	200000	2025-08-04
6	\N	\N	La physique est explorée de manière interactive, en reliant les concepts théoriques.	70	PHYS_201	Physique	2025-11-04	175000	2025-08-04
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.role (id, name) FROM stdin;
1	STUDENT
2	ADMIN
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.students (address, date_of_birth, desired_academic_year, gender, intended_field_of_study, marital_status, nationality, phone_number, id) FROM stdin;
Tradex Emana	2025-08-04	2025	FEMININ	Computer Science	SINGLE	Cameroonian	+237 69910023	1
Tradex Emana	2025-08-04	2025	FEMININ	Computer Science	SINGLE	Cameroonian	+237 69910023	2
Tradex Emana	2025-08-04	2025	FEMININ	Computer Science	SINGLE	Cameroonian	+237 69910023	52
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.token (id, created_at, expired, expires_at, revoked, token, validated_at, user_id) FROM stdin;
1	2025-08-04 13:47:34.56994	f	2025-08-04 14:02:34.569988	f	850209	\N	1
303	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU2OTMxNTAsImV4cCI6MTc1NTY5Njc1MH0.TghOH5f_zHN7x-IMpiRC_RoF8witl4BctiGNBFXCXtI	\N	2
2	2025-08-04 14:15:29.793081	t	2025-08-04 14:30:29.793144	t	084414	2025-08-04 14:15:55.808857	2
52	2025-08-04 15:43:03.743936	f	2025-08-04 15:58:03.743985	f	431208	\N	52
3	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQzMTMzNjksImV4cCI6MTc1NDMxNjk2OX0.Dh-qQsNoC8PMrknNZI0xNcd5ckyokj1zGwTMQdV8Ff0	\N	2
102	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODg0NTcsImV4cCI6MTc1NDQ5MjA1N30.bezk5mvtLct51Xcq7oRK5GNKneGUOkopx8x-99sSKVM	\N	2
103	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODg0ODIsImV4cCI6MTc1NDQ5MjA4Mn0.0XoowjtFFClIhT4aCLHq88oxmVzubyshcKJ9Dtzo0UM	\N	2
104	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODg0OTYsImV4cCI6MTc1NDQ5MjA5Nn0.47yMAuwC_wq9fdhoV2uT8Y7ZMTBsCjITV4SDs9wtF9g	\N	2
105	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODkwOTksImV4cCI6MTc1NDQ5MjY5OX0.xWWpx7UM5K-3sPsJ6-axVK423JuB-AsN0TxeEUum0t4	\N	2
106	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODkzODksImV4cCI6MTc1NDQ5Mjk4OX0.f1OMOm01SNkjGbers0l-TfIiAm5FM6v3e4r3BJy-e8I	\N	2
107	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODk2MDUsImV4cCI6MTc1NDQ5MzIwNX0.HrI32QC49vVp1dZl6R_nlNAd-QCacsy7W7N8jN95hGk	\N	2
108	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfU1RVREVOVCIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0ODk2NDAsImV4cCI6MTc1NDQ5MzI0MH0.ylgbx90rAgNmpMNf6G3sVGf3SF4sKJgd08tRY1jod6c	\N	2
152	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ0OTMxNjgsImV4cCI6MTc1NDQ5Njc2OH0.UhPMTYf6rI-Y73GaF93aRejVzOyl-ecfUUTJ1XiUR9w	\N	2
202	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTQ2MjQ4ODUsImV4cCI6MTc1NDYyODQ4NX0.Gp2Hz6tkq6G5H31If3zq8QSU0goBKKUjpbNBgMAcw6A	\N	2
252	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU2MDEzMTUsImV4cCI6MTc1NTYwNDkxNX0.K8nWc-8-UGTuK00L_GIW4mnEtiZMEnggkkqbDNYt8mU	\N	2
253	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU2MDEzMjUsImV4cCI6MTc1NTYwNDkyNX0.MUnOSvUSIeQRkG_neU4DAqJkiFsGCxBqgthltVMsN18	\N	2
254	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU2MDE2NDQsImV4cCI6MTc1NTYwNTI0NH0.x2O4LpeTbOhBjyQzdRJQqSem8z0tomqlnnWV3ICiSLc	\N	2
302	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU2OTMxMTUsImV4cCI6MTc1NTY5NjcxNX0.uVae2mkkTWSAaHwIs1rpEm16ZyTzUVnG76y5aGlRLAU	\N	2
352	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU2OTM3MTAsImV4cCI6MTc1NTY5NzMxMH0.30TMz27-39okAYuLbrKHv_Yl7EGLQmJGKFso30-Msz0	\N	2
402	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU3MDUwNDIsImV4cCI6MTc1NTcwODY0Mn0.9DexWeG1vW0U4D9e57j3AAL8OpHr3wyGkBI2OMFEyM8	\N	2
403	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU3MDU3NjUsImV4cCI6MTc1NTcwOTM2NX0.wJPbKrbyqOLVZsSJBXzF73CfuJVimwStuTfUQJIkbxo	\N	2
452	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU3MjAxMTIsImV4cCI6MTc1NTcyMzcxMn0.BF0VJyNtO8d2gJm9owIRLYFlejcI6VGNvaulDFHWuQA	\N	2
502	\N	t	\N	t	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU3NzY2MzAsImV4cCI6MTc1NTc4MDIzMH0.exMJiMrt1A7rCpKLvhwMIg7Eg5jB7Bt8Tm_UVcXxguY	\N	2
552	\N	f	\N	f	eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdG5hbWUiOiJLYXd0YWwiLCJyb2xlcyI6IlJPTEVfU1RVREVOVCIsImxhc3RuYW1lIjoiWmFuZGFiYSIsInN1YiI6ImRha2F4ZWsyNzRAZWZwYXBlci5jb20iLCJpYXQiOjE3NTU4MzU3MTIsImV4cCI6MTc1NTgzOTMxMn0.yWOvhOZf1K0j0Egpb927YzGK-YDTnvXJyQ9o9-oBJhk	\N	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mike_react
--

COPY public.users (user_type, id, account_locked, created_date, email, enabled, firstname, last_modified_date, lastname, password, role_id) FROM stdin;
STUDENT	1	f	\N	dibos27246@dekpal.com	f	Kawtal	\N	Zandabar	$2a$10$Exuh69WpxfR4DW5pDfeIn..ZHysH0lIRuSfSBT4Umebr.0r9aqC0G	1
STUDENT	2	f	\N	dakaxek274@efpaper.com	t	Kawtal	\N	Zandaba	$2a$10$ee07vYXZ09kBbj40PmHQIOUwoQuCWDpkT7U.2zZAIiHlhp4D5d1X6	1
STUDENT	52	f	\N	Alphacond@gmail.com	f	Conde	\N	Alpha	$2a$10$HLgPNQb15XCItdkflDITzOza.cyZ/gKVEgTfkvKVYHdD00v7R4BBG	1
\.


--
-- Name: document_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.document_seq', 1, false);


--
-- Name: enrollment_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.enrollment_seq', 1, false);


--
-- Name: notification_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.notification_seq', 1, false);


--
-- Name: program_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.program_seq', 51, true);


--
-- Name: role_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.role_seq', 51, true);


--
-- Name: token_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.token_seq', 601, true);


--
-- Name: users_seq; Type: SEQUENCE SET; Schema: public; Owner: mike_react
--

SELECT pg_catalog.setval('public.users_seq', 101, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: enrollment enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: program program_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.program
    ADD CONSTRAINT program_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: role uk8sewwnpamngi6b1dwaa88askk; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT uk8sewwnpamngi6b1dwaa88askk UNIQUE (name);


--
-- Name: program ukd9qdtg0xmx8i8j47ydrp491nc; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.program
    ADD CONSTRAINT ukd9qdtg0xmx8i8j47ydrp491nc UNIQUE (program_code);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: document fk4qgejt0fnyhjmsauwxktbqhes; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT fk4qgejt0fnyhjmsauwxktbqhes FOREIGN KEY (enrollment_id) REFERENCES public.enrollment(id);


--
-- Name: users fk4qu1gr772nnf6ve5af002rwya; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk4qu1gr772nnf6ve5af002rwya FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: students fk7xqmtv7r2eb5axni3jm0a80su; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT fk7xqmtv7r2eb5axni3jm0a80su FOREIGN KEY (id) REFERENCES public.users(id);


--
-- Name: admins fkanhsicqm3lc8ya77tr7r0je18; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT fkanhsicqm3lc8ya77tr7r0je18 FOREIGN KEY (id) REFERENCES public.users(id);


--
-- Name: token fkj8rfw4x0wjjyibfqq566j4qng; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT fkj8rfw4x0wjjyibfqq566j4qng FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notification fknk4ftb5am9ubmkv1661h15ds9; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fknk4ftb5am9ubmkv1661h15ds9 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: enrollment fkowhsvsa3u070c23mmqdp5mqpy; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT fkowhsvsa3u070c23mmqdp5mqpy FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: enrollment fksv31c7aw3p6lgvhaulei4jmwt; Type: FK CONSTRAINT; Schema: public; Owner: mike_react
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT fksv31c7aw3p6lgvhaulei4jmwt FOREIGN KEY (program_id) REFERENCES public.program(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

