--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.0

-- Started on 2023-04-01 03:24:57 MSK

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16384)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16389)
-- Name: task_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_statuses (
    id smallint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.task_statuses OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16394)
-- Name: task_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_statuses_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 3365 (class 0 OID 0)
-- Dependencies: 216
-- Name: task_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_statuses_id_seq OWNED BY public.task_statuses.id;


--
-- TOC entry 217 (class 1259 OID 16395)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    status_id smallint DEFAULT 1 NOT NULL,
    author_id integer NOT NULL,
    create_date timestamp without time zone DEFAULT now() NOT NULL,
    update_date timestamp without time zone DEFAULT now() NOT NULL,
    title character varying NOT NULL,
    description character varying
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16403)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 3366 (class 0 OID 0)
-- Dependencies: 218
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 219 (class 1259 OID 16404)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16409)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3367 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3190 (class 2604 OID 16410)
-- Name: task_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_statuses ALTER COLUMN id SET DEFAULT nextval('public.task_statuses_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 16411)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 16412)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3353 (class 0 OID 16384)
-- Dependencies: 214
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 3354 (class 0 OID 16389)
-- Dependencies: 215
-- Data for Name: task_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_statuses (id, name) FROM stdin;
1	created
2	in progress
3	finished
\.


--
-- TOC entry 3356 (class 0 OID 16395)
-- Dependencies: 217
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, status_id, author_id, create_date, update_date, title, description) FROM stdin;
\.


--
-- TOC entry 3358 (class 0 OID 16404)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, login, password) FROM stdin;
1	user	9661c044637bc2985580359c90bc77f5c2512078c6a8824a78982bbd33cdd532615488272b6e2e896bf85e68f1142c28bd381aabe7500501efa20e387a53d6bb
\.


--
-- TOC entry 3368 (class 0 OID 0)
-- Dependencies: 216
-- Name: task_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_statuses_id_seq', 3, true);


--
-- TOC entry 3369 (class 0 OID 0)
-- Dependencies: 218
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 1, false);


--
-- TOC entry 3370 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 3206 (class 2606 OID 16414)
-- Name: users login_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT login_unique UNIQUE (login) INCLUDE (login);


--
-- TOC entry 3200 (class 2606 OID 16416)
-- Name: task_statuses name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_statuses
    ADD CONSTRAINT name_unique UNIQUE (name) INCLUDE (name);


--
-- TOC entry 3198 (class 2606 OID 16418)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 3202 (class 2606 OID 16420)
-- Name: task_statuses task_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_statuses
    ADD CONSTRAINT task_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 3204 (class 2606 OID 16422)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 3208 (class 2606 OID 16424)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3196 (class 1259 OID 16425)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- TOC entry 3209 (class 2606 OID 16426)
-- Name: tasks author_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT author_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3210 (class 2606 OID 16431)
-- Name: tasks status_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT status_id_fk FOREIGN KEY (status_id) REFERENCES public.task_statuses(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2023-04-01 03:24:58 MSK

--
-- PostgreSQL database dump complete
--

