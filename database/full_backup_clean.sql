--
-- PostgreSQL database dump
--

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_settings; Type: TABLE; Schema: public;
--

CREATE TABLE public.app_settings (
    id integer DEFAULT 1 NOT NULL,
    hero_image_url text DEFAULT 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920'::text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: feedback; Type: TABLE; Schema: public;
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    user_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: home_settings; Type: TABLE; Schema: public;
--

CREATE TABLE public.home_settings (
    id integer NOT NULL,
    hero_image_url text DEFAULT 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920'::text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: home_settings_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.home_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: home_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.home_settings_id_seq OWNED BY public.home_settings.id;


--
-- Name: listings; Type: TABLE; Schema: public;
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    condition character varying(50) DEFAULT 'Used - Good'::character varying,
    image_url character varying(255),
    whatsapp_phone character varying(15),
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(50) DEFAULT 'Other'::character varying,
    stock_quantity integer DEFAULT 1,
    average_rating numeric(3,2) DEFAULT 0,
    rating_count integer DEFAULT 0,
    rating_sum numeric(10,2) DEFAULT 0,
    image_urls text[] DEFAULT ARRAY[]::text[],
    variants jsonb DEFAULT '[]'::jsonb
);


--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: ratings; Type: TABLE; Schema: public;
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    listing_id integer,
    user_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: users; Type: TABLE; Schema: public;
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    subscription_status boolean DEFAULT false,
    subscription_expiry date,
    whatsapp_phone character varying(15),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    shop_name character varying(100) DEFAULT NULL::character varying,
    bio text,
    cover_image_url text,
    avatar_url text DEFAULT 'https://via.placeholder.com/192?text=User'::text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: feedback id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: home_settings id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.home_settings ALTER COLUMN id SET DEFAULT nextval('public.home_settings_id_seq'::regclass);


--
-- Name: listings id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public;
--

COPY public.app_settings (id, hero_image_url, updated_at) FROM stdin;
1	https://res.cloudinary.com/dwkmbyply/image/upload/v1769608598/campus-connect/diiisfozujo97xvpr9ri.png	2026-01-28 15:56:39.600111
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public;
--

COPY public.feedback (id, user_id, rating, comment, created_at) FROM stdin;
1	7	3	\N	2026-01-23 15:49:18.021838
2	7	4	this is good platform\n	2026-01-24 17:26:20.704509
\.


--
-- Data for Name: home_settings; Type: TABLE DATA; Schema: public;
--

COPY public.home_settings (id, hero_image_url, updated_at) FROM stdin;
1	https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920	2026-01-22 12:22:00.088548
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public;
--

COPY public.listings (id, user_id, title, description, price, condition, image_url, whatsapp_phone, status, created_at, category, stock_quantity, average_rating, rating_count, rating_sum, image_urls, variants) FROM stdin;
5	5	Experiments table	New, Mae of Mildsteel	8000.00	New	https://res.cloudinary.com/dwkmbyply/image/upload/v1769022695/campus-connect/boqoi4ahotymvrmfgyvs.jpg	260773844630	approved	2026-01-21 21:11:39.313638	Other	3	4.50	2	0.00	{}	[]
12	5	masinhi	\N	345.00	Used - Good	\N	\N	approved	2026-01-24 22:09:59.106105	Other	1	3.00	1	0.00	{https://res.cloudinary.com/dwkmbyply/image/upload/v1769285388/campus-connect/bexr3ugu08nk6wtso543.png,https://res.cloudinary.com/dwkmbyply/image/upload/v1769285389/campus-connect/rspmjj0hmcv0wriw8enw.png,https://res.cloudinary.com/dwkmbyply/image/upload/v1769285391/campus-connect/rv9ntb9pfthzzoith4hg.avif}	[]
11	5	Hp laptop Coi7	brand new	12000.00	New	https://res.cloudinary.com/dwkmbyply/image/upload/v1769270086/campus-connect/w6drhd9qd3gnh3pj1y7p.avif	260773844630	approved	2026-01-24 17:54:48.474524	Electronic Gadgets	5	3.00	1	0.00	{}	[]
9	5	marijuana	opiod	2000.00	Used - Good	\N	260773937569	approved	2026-01-23 19:06:50.07406	Other	1	0.00	0	0.00	{}	[]
10	7	biology textbook	second hand	1500.00	Used - Good	https://res.cloudinary.com/dwkmbyply/image/upload/v1769201159/campus-connect/d7ii0sqfieacyaawlopa.avif	260773844630	approved	2026-01-23 22:46:01.015596	Other	1	0.00	0	0.00	{}	[]
6	7	google pixel 6pro	Boxed	9000.00	New	https://res.cloudinary.com/dwkmbyply/image/upload/v1769073724/campus-connect/wioihwjbfyr8lyp04lk6.jpg	260773844630	approved	2026-01-22 11:22:06.111726	Other	5	0.00	0	0.00	{}	[]
8	6	iphone 17 promax	new	7500.00	New	https://res.cloudinary.com/dwkmbyply/image/upload/v1769094671/campus-connect/rvqr8h7jgavswik5b58s.jpg	260773844630	approved	2026-01-22 17:11:15.435872	Other	5	0.00	0	0.00	{}	[]
13	7	LAPTOP HP	BRAND NEW	7000.00	New	\N	260773937569	approved	2026-01-26 09:45:40.991325	Electronic Gadgets	2	0.00	0	0.00	{https://res.cloudinary.com/dwkmbyply/image/upload/v1769413539/campus-connect/lsoj4xtvuloxrxmcquqa.avif}	[]
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public;
--

COPY public.ratings (id, listing_id, user_id, rating, comment, created_at) FROM stdin;
1	12	5	3	svxhcsbxcj	2026-01-25 02:29:36.563701
3	11	5	3	\N	2026-01-25 22:35:36.62909
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public;
--

COPY public.users (id, username, email, password_hash, role, subscription_status, subscription_expiry, whatsapp_phone, created_at, shop_name, bio, cover_image_url, avatar_url) FROM stdin;
1	testuser	test@unilus.ac.zm	hashedpassword123	user	f	\N	260977123456	2026-01-18 12:19:45.784072	\N	\N	\N	https://via.placeholder.com/192?text=User
4	alec123456	test1@unilus.ac.zm	$2b$10$j4lewoSV1XITg4ewB8Zg3uAmNn7A8NMqoe67qBAp6O8pbWmuefvA2	user	f	\N	260977123455	2026-01-21 10:34:59.449897	\N	\N	\N	https://via.placeholder.com/192?text=User
6	Panashemakunaz	pmakununu@gmail.com	$2b$10$TjyrHK0bVkp9sfJgDQq7bex2hL.McAYLflbw3dxHSCC4Vwh80/s0y	admin	f	\N	260773844630	2026-01-21 16:42:15.654861	\N	\N	\N	https://via.placeholder.com/192?text=User
7	tapiwa	arikimanda@gmail.com	$2b$10$EcRLgMzCuMgemWVXhkWIa.ecnEI0DvClKYFUsYbnZw9O0QRxs83/a	user	f	\N	\N	2026-01-22 11:19:11.386994	\N	\N	https://res.cloudinary.com/dwkmbyply/image/upload/v1769116514/campus-connect/d6nqe3pbqdvaebm5wavy.jpg	https://via.placeholder.com/192?text=User
5	PMBCHB23221069 	alecmanda162004@gmail.com	$2b$10$DZiHmIETdZXTwLOljvLgu.R5G86BTZP/PAde6zckpBud6A8YSwWeK	admin	f	\N	260773937569	2026-01-21 10:35:42.120161	\N	\N	https://res.cloudinary.com/dwkmbyply/image/upload/v1769201433/campus-connect/silmzugen3covbkldbrz.avif	https://res.cloudinary.com/dwkmbyply/image/upload/v1769201435/campus-connect/p3gxgi255fgugunw9us9.avif
\.


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.feedback_id_seq', 2, true);


--
-- Name: home_settings_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.home_settings_id_seq', 1, false);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.listings_id_seq', 13, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.ratings_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: home_settings home_settings_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.home_settings
    ADD CONSTRAINT home_settings_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_listing_id_user_id_key; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_listing_id_user_id_key UNIQUE (listing_id, user_id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_listings_status; Type: INDEX; Schema: public;
--

CREATE INDEX idx_listings_status ON public.listings USING btree (status);


--
-- Name: idx_listings_user_id; Type: INDEX; Schema: public;
--

CREATE INDEX idx_listings_user_id ON public.listings USING btree (user_id);


--
-- Name: feedback feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: listings fk_user; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings fk_user_ratings; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT fk_user_ratings FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: listings listings_user_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_listing_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--