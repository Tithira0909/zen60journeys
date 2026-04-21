-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2026 at 11:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zen_journeys`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(80) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `created_at`, `last_login`) VALUES
(1, 'admin', '$2b$12$mDWVDnlA8gU8jVBwjPtSJ.muBXhQStPuXlg.R8FAbM1WK27VBAeHq', '2026-04-12 11:36:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chronicle_cards`
--

CREATE TABLE `chronicle_cards` (
  `id` int(10) UNSIGNED NOT NULL,
  `category` varchar(80) NOT NULL,
  `title` varchar(120) NOT NULL,
  `tag` varchar(80) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chronicle_cards`
--

INSERT INTO `chronicle_cards` (`id`, `category`, `title`, `tag`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sacred Summit', 'Sacred Peak\nSunrise', 'Adam\'s Peak', '/images/sl-5.JPG', 1, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31'),
(2, 'Cultural Heritage', 'Rhythms\nof Kandy', 'Temple of Tooth', '/images/sl-6.JPEG', 2, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31'),
(3, 'Coastal Escape', 'Golden Hour\nat Mirissa', 'Southern Coast', '/images/sl-7.JPEG', 3, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31'),
(4, 'Highland Trails', 'Horton Plains\nMist', 'Nuwara Eliya', '/images/sl-8.JPEG', 4, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31'),
(5, 'Ancient Wonder', 'Sigiriya\nat Dawn', 'Lion Rock', '/images/sl-9.JPEG', 5, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31'),
(6, 'Wildlife Safari', 'Yala Elephant\nTrails', 'Yala National Park', '/images/sl-10.JPEG', 6, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31'),
(7, 'Architectural Gem', 'Nine Arch\nBridge, Ella', 'Ella', '/images/sl-11.JPEG', 7, 1, '2026-04-12 11:27:31', '2026-04-12 11:27:31');

-- --------------------------------------------------------

--
-- Table structure for table `experiences`
--

CREATE TABLE `experiences` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `category` varchar(100) DEFAULT 'General',
  `duration` varchar(100) DEFAULT NULL,
  `price_from` varchar(100) DEFAULT NULL,
  `tag` varchar(100) DEFAULT 'Included with Festival Ticket',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experiences`
--

INSERT INTO `experiences` (`id`, `title`, `subtitle`, `description`, `image_url`, `category`, `duration`, `price_from`, `tag`, `sort_order`, `is_active`, `created_at`) VALUES
(1, 'Yaga Infinity Night', 'A celestial sonic journey', 'A celestial journey through sound and light, where boundaries dissolve under the Colombo moonlight.', '/images/moment-1.JPG', 'Nightlife', '8 hrs', NULL, 'Included with Festival Ticket', 1, 1, '2026-04-12 06:00:33'),
(2, 'Open-Air Rave Sessions', 'Raw energy, open skies', 'Techno locators around the venue, easy access and no shut-in DJ sessions to hype up the energy.', '/images/moment-2.JPG', 'Nightlife', '6 hrs', NULL, 'Included with Festival Ticket', 2, 1, '2026-04-12 06:00:33'),
(3, 'Back-to-Back DJ Sets', '70+ world-class artists', 'Where the best of 70+ world-class artists collide, bringing you near seamless, non-stop beats.', '/images/moment-3.JPG', 'Music', '12 hrs', NULL, 'Included with Festival Ticket', 3, 1, '2026-04-12 06:00:33'),
(4, 'Immersive Stage Productions', 'Award-winning design', 'Award-winning stage design with pyrotechnics, LED installations and live performance art.', '/images/moment-4.JPG', 'Performance', '4 hrs', NULL, 'Included with Festival Ticket', 4, 1, '2026-04-12 06:00:33'),
(5, 'Community Vibes & Afterparties', 'The night never ends', 'The stage division orchestrates your move throughout designated stage for the best body-combination.', '/images/moment-5.JPG', 'Social', '6 hrs', NULL, 'Included with Festival Ticket', 5, 1, '2026-04-12 06:00:33'),
(6, 'VIP Experiences', 'Elevated luxury', 'Elevated viewing decks, private bars, and luxury concierge services for the discerning guest.', '/images/moment-7.JPG', 'VIP', '3 hrs', 'LKR 25,000', 'Premium Add-On', 6, 1, '2026-04-12 06:00:33');

-- --------------------------------------------------------

--
-- Table structure for table `experience_gallery`
--

CREATE TABLE `experience_gallery` (
  `id` int(11) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `alt_text` varchar(255) DEFAULT 'Gallery Image',
  `object_position` varchar(50) DEFAULT 'center center',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experience_gallery`
--

INSERT INTO `experience_gallery` (`id`, `image_url`, `alt_text`, `object_position`, `sort_order`, `is_active`, `created_at`) VALUES
(1, '/images/gallery-1.JPG', 'Experience 1', 'center center', 1, 1, '2026-04-12 06:00:33'),
(2, '/images/gallery-2.JPG', 'Experience 2', 'center center', 2, 1, '2026-04-12 06:00:33'),
(3, '/images/gallery-3.JPEG', 'Experience 3', 'center center', 3, 1, '2026-04-12 06:00:33'),
(4, '/images/gallery-4.JPEG', 'Experience 4', 'center center', 4, 1, '2026-04-12 06:00:33'),
(5, '/images/gallery-5.JPG', 'Experience 5', 'center center', 5, 1, '2026-04-12 06:00:33'),
(6, '/images/gallery-6.JPG', 'Experience 6', 'center center', 6, 1, '2026-04-12 06:00:33'),
(7, '/images/gallery-7.JPG', 'Experience 7', 'center center', 7, 1, '2026-04-12 06:00:33'),
(8, '/images/gallery-8.JPG', 'Experience 8', 'center center', 8, 1, '2026-04-12 06:00:33'),
(9, '/images/gallery-9.JPG', 'Experience 9', 'center center', 9, 1, '2026-04-12 06:00:33');

-- --------------------------------------------------------

--
-- Table structure for table `experience_hero`
--

CREATE TABLE `experience_hero` (
  `id` int(11) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experience_hero`
--

INSERT INTO `experience_hero` (`id`, `image_url`, `label`, `is_active`, `created_at`) VALUES
(1, '/uploads/7c77d8807ae1cb94237aadfe5d44968d.jpg', 'Main Hero', 1, '2026-04-12 06:00:34');

-- --------------------------------------------------------

--
-- Table structure for table `experience_highlights`
--

CREATE TABLE `experience_highlights` (
  `id` int(11) NOT NULL,
  `number_label` varchar(10) DEFAULT '01',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experience_highlights`
--

INSERT INTO `experience_highlights` (`id`, `number_label`, `title`, `description`, `sort_order`, `is_active`, `created_at`) VALUES
(1, '01', 'Ocean Stage Sunset Ritual', 'A spiritual opening ceremony as the sun dips below the Laccadive Sea, accompanied by traditional drums and deep tech.', 1, 1, '2026-04-12 06:00:33'),
(2, '02', 'Banyan Tree Sound Bath', 'Immersive ambient soundscapes under a thousand-year-old banyan tree, designed for deep restoration and sonic healing.', 2, 1, '2026-04-12 06:00:33'),
(3, '03', 'Artisan Night Market', 'Explore curated stalls featuring local Sri Lankan craftsmanship, sustainable fashion, and gourmet island street food.', 3, 1, '2026-04-12 06:00:33');

-- --------------------------------------------------------

--
-- Table structure for table `flyers`
--

CREATE TABLE `flyers` (
  `id` int(10) UNSIGNED NOT NULL,
  `destination_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `title` varchar(120) NOT NULL,
  `category` varchar(80) NOT NULL,
  `location_text` varchar(160) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `tag` varchar(80) NOT NULL,
  `sort_order` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flyers`
--

INSERT INTO `flyers` (`id`, `destination_id`, `title`, `category`, `location_text`, `description`, `image_url`, `tag`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Sigiriya Rock Fortress', 'ANCIENT WONDER', 'Sigiriya, North Central Province', 'Ascend the 5th-century citadel perched 200m above the jungle — frescoes, mirror walls and panoramic views that defy time.', '/uploads/e1f56a3e0a61e9cc2c445f5a0034067f.jpg', 'UNESCO Heritage', 1, 1, '2026-04-12 11:27:31', '2026-04-12 14:34:04'),
(2, 2, 'Sacred Rituals Today', 'SACRED RITUALS', 'Sri Dalada Maligawa, Kandy', 'Witness the sacred offering of food and flowers to the Tooth Relic. Feel the rhythmic drumming and deep devotion of centuries.', '/uploads/88be07d0ecc4366fdd4049be4f94ba21.jpg', 'Daily Ceremony', 2, 1, '2026-04-12 11:27:31', '2026-04-12 14:34:38'),
(3, 3, 'Ella Highland Trails', 'HIGHLAND TRAILS', 'Ella, Badulla District', 'Mist-draped mountains, the iconic Nine Arch Bridge and sunrise over Little Adam\'s Peak — Ella rewards those who wander slowly.', '/uploads/6dcfd43ed6e0cf1975d1400dd88a1989.webp', 'Nature Escape', 3, 1, '2026-04-12 11:27:31', '2026-04-12 14:35:01'),
(4, 4, 'Blue Whale Encounters', 'WHALE WATCHING', 'Mirissa Harbour, Southern Coast', 'Turquoise waters home to the largest creatures on Earth. Blue whales and spinner dolphins surface in the warm Indian Ocean.', '/uploads/101f644f5db89da452063ff55ef20c32.jpg', 'Wildlife Experience', 4, 1, '2026-04-12 11:27:31', '2026-04-12 14:35:16'),
(5, 5, 'Colombo City Pulse', 'URBAN DISCOVERY', 'Colombo, Western Province', 'Colonial-era architecture, buzzing Pettah market, rooftop bars and world-class dining — Sri Lanka\'s capital rewards the curious.', '/uploads/b71bdd5288af1aee5ca195b5282a2363.jpg', 'City Experience', 5, 1, '2026-04-12 11:27:31', '2026-04-12 14:35:33'),
(6, 6, 'Trinco Beach Paradise', 'BEACH PARADISE', 'Trincomalee, Eastern Province', 'One of the world\'s deepest natural harbours, pristine coral reefs, whale sharks and powder-white beaches untouched by mass tourism.', '/uploads/ab4157331f352b286c3cbcf448ec5f08.jpg', 'Coastal Escape', 6, 1, '2026-04-12 11:27:31', '2026-04-12 14:35:42'),
(7, 7, 'Welcome to the Jungle', 'WILDLIFE SAFARI', 'Yala National Park, Hambantota', 'Venture into the dense shrublands where the leopard reigns supreme and elephants roam beside ancient Buddhist ruins.', '/uploads/158e233a94c3693e64ffa66743e196be.jpg', 'Wildlife Reserve', 7, 1, '2026-04-12 11:27:31', '2026-04-12 14:35:57'),
(8, 8, 'Galle Fort at Dusk', 'COLONIAL HERITAGE', 'Galle Fort, Southern Province', 'Walk the ramparts of a UNESCO-listed Dutch fort as the sun dips into the Indian Ocean — boutique galleries, cafés and centuries of history.', '/uploads/768f6184aaf32852e94cf65449ab1185.jpg', 'UNESCO Heritage', 8, 1, '2026-04-12 11:27:31', '2026-04-12 14:36:09'),
(9, NULL, 'Cultural Masks Eternal', 'CRAFTSMANSHIP', 'Ariyapala Mask Museum, Ambalangoda', 'Stories of living practitioners preserving Kolam and Sanni traditions through ancestral wood carving techniques passed down for generations.', '/uploads/90711a8feb3e858413a02268d1be47c8.webp', 'Living Heritage', 9, 1, '2026-04-12 11:27:31', '2026-04-12 14:36:26'),
(10, NULL, 'The Rhythm of Spirits', 'KANDYAN DANCE', 'Kandyan Art Association, Kandy', 'Experience the athletic grace of traditional Kandyan dancers — fire-walking, plate-spinning and the thunderous beat of the Geta Beraya drum.', '/uploads/47e69a681ef28b196e0a65f6548ea4f4.jpg', 'Cultural Performance ', 10, 1, '2026-04-12 11:27:31', '2026-04-12 14:36:36');

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_carousel`
--

CREATE TABLE `itinerary_carousel` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itinerary_carousel`
--

INSERT INTO `itinerary_carousel` (`id`, `tour_id`, `name`, `description`, `image_url`, `sort_order`, `is_active`) VALUES
(1, 1, 'Sigiriya', 'An ancient palace and fortress complex atop a sheer rock column, surrounded by gardens and frescoes.', '/uploads/25c0c3b612fdf64310ac24d38f3cf5fd.jpg', 1, 1),
(2, 1, 'Polonnaruwa', 'The well-preserved ruins of a medieval royal capital, home to the serene Gal Vihara rock temple.', '/uploads/f23e0bf1d4dc13fdb5a43e7e61eb0073.jpg', 2, 1),
(3, 1, 'Kandy', 'Sri Lanka\'s cultural heart — home to the sacred Temple of the Tooth and vibrant Kandyan dance.', '/uploads/056c6e1c27171da948c064608f54e197.jpeg', 3, 1),
(4, 2, 'Nuwara Eliya', 'The \'Little England\' of Sri Lanka, surrounded by manicured tea estates and colonial bungalows.', '/images/hill-country.JPEG', 1, 1),
(5, 2, 'Ella', 'A charming mountain village with dramatic valley views, waterfall hikes, and the iconic Nine Arch Bridge.', '/images/adventure-trek.PNG', 2, 1),
(6, 2, 'Kandy', 'Begin and end your highland journey in the cultural capital of Sri Lanka.', '/images/cultural-triangle.JPG', 3, 1),
(7, 3, 'Galle Fort', 'A UNESCO-listed Dutch colonial fortress turned boutique destination — galleries, cafes and ocean views.', '/images/southern-shores.JPG', 1, 1),
(8, 3, 'Mirissa', 'Sri Lanka\'s most beautiful surf beach, famous for whale watching and sunset cocktails.', '/images/ayurvedic-sanctuary.JPEG', 2, 1),
(9, 3, 'Tangalle', 'Secluded coves, turtle nesting sites, and some of the most serene beaches on the island.', '/images/untamed-wild.JPG', 3, 1),
(10, 4, 'Yala Block 1', 'The world\'s most densely populated leopard territory. Every drive is a different story.', '/images/untamed-wild.JPG', 1, 1),
(11, 4, 'Bundala Wetlands', 'A Ramsar-protected bird sanctuary where flamingos wade through brackish lagoons at dusk.', '/images/southern-shores.JPG', 2, 1),
(12, 4, 'Forest Camp', 'Your luxury tented camp at the edge of the wilderness, where sounds of the jungle fill the night.', '/images/hill-country.JPEG', 3, 1),
(13, 5, 'Ayurveda Retreat', 'Your sanctuary of healing — personalised treatments, meditative gardens, and restorative cuisine.', '/images/ayurvedic-sanctuary.JPEG', 1, 1),
(14, 5, 'Bentota River', 'Sunrise yoga on the river, mangrove boat rides, and still water that mirrors the morning sky.', '/images/southern-shores.JPG', 2, 1),
(15, 5, 'Spice Gardens', 'Walk through medicinal herb gardens and learn the ancient science behind each plant and remedy.', '/images/hill-country.JPEG', 3, 1),
(16, 6, 'Horton Plains', 'Trek across misty high-altitude plains to World\'s End — an 870m sheer cliff at the edge of the world.', '/images/adventure-trek.PNG', 1, 1),
(17, 6, 'Ella Valley', 'A lush valley framed by jungle peaks, best seen from a moving train or Little Adam\'s Peak at sunrise.', '/images/hill-country.JPEG', 2, 1),
(18, 6, 'Knuckles Range', 'Zip-line through pristine cloud forest in one of Sri Lanka\'s most biodiverse wilderness areas.', '/images/untamed-wild.JPG', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_days`
--

CREATE TABLE `itinerary_days` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `icon_name` varchar(50) DEFAULT 'MapPin',
  `map_label` varchar(255) DEFAULT NULL,
  `weather_text` varchar(100) DEFAULT NULL,
  `card_detail` text DEFAULT NULL,
  `duration_text` varchar(100) DEFAULT NULL,
  `next_step_text` varchar(100) DEFAULT NULL,
  `pin_x` decimal(5,2) DEFAULT 50.00,
  `pin_y` decimal(5,2) DEFAULT 50.00,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itinerary_days`
--

INSERT INTO `itinerary_days` (`id`, `tour_id`, `day_number`, `title`, `description`, `tags`, `icon_name`, `map_label`, `weather_text`, `card_detail`, `duration_text`, `next_step_text`, `pin_x`, `pin_y`, `sort_order`) VALUES
(1, 1, 1, 'Arrival in Colombo', 'Welcome to Sri Lanka. Transfer to your boutique hotel in Colombo, evening city orientation walk.', 'Arrival,City,Transfer', 'Plane', 'Colombo', '30°C · Humid', 'Arrive at Bandaranaike International Airport. Private transfer to Colombo.', '2–3 hrs', 'Rest & Explore', 35.60, 75.40, 1),
(2, 1, 2, 'Sigiriya Rock Fortress', 'Climb the iconic 5th-century rock fortress rising 200m above the jungle. Explore the frescoes and mirror wall.', 'UNESCO,Hiking,History', 'Mountain', 'Sigiriya', '34°C · Sunny', 'Sigiriya is Sri Lanka\'s most iconic landmark. The climb takes approximately 1.5 hours.', '4–5 hrs', 'Dambulla Caves', 57.10, 50.90, 2),
(3, 1, 3, 'Polonnaruwa Ruins', 'Cycle through the ancient capital of Polonnaruwa, exploring palaces, dagobas, and the sacred Gal Vihara.', 'UNESCO,Cycling,History', 'Camera', 'Polonnaruwa', '33°C · Partly Cloudy', 'The ancient city is best explored by bicycle. Hire one at the entrance gate.', '5–6 hrs', 'Minneriya Safari', 63.50, 51.10, 3),
(4, 1, 4, 'Minneriya Elephant Gathering', 'Witness one of nature\'s greatest spectacles — hundreds of wild elephants gathering at Minneriya reservoir.', 'Safari,Wildlife,Nature', 'Camera', 'Minneriya', '31°C · Cloudy', 'The gathering typically occurs July–September when water levels drop.', '3–4 hrs', 'Drive to Kandy', 59.40, 50.20, 4),
(5, 1, 5, 'Kandy — Temple of the Tooth', 'Visit the sacred Temple of the Tooth Relic, explore the Peradeniya Botanical Gardens and Kandy Lake.', 'Temple,Culture,Gardens', 'MapPin', 'Kandy', '28°C · Pleasant', 'The Temple of the Tooth houses a relic of the Buddha and is one of Buddhism\'s most sacred sites.', '4–5 hrs', 'Cultural Show', 54.30, 66.80, 5),
(7, 1, 5, 'Departure', 'Morning at leisure. Transfer to Colombo airport for your departure flight.', 'Departure,Transfer', 'Plane', 'Colombo Airport', '30°C · Clear', 'Check-out and transfer to Bandaranaike International Airport.', '3 hrs', 'Safe Travels', 35.60, 75.40, 7),
(8, 2, 1, 'Colombo to Kandy', 'Scenic drive to the hill capital. Visit the Temple of the Tooth and explore Kandy town.', 'Transfer,Culture,Temple', 'Train', 'Kandy', '27°C · Pleasant', 'The drive from Colombo to Kandy takes approximately 3 hours through winding mountain roads.', '3 hrs drive', 'Kandy Explore', 53.80, 55.40, 1),
(9, 2, 2, 'Tea Plantation Country', 'Train journey to Nuwara Eliya. Tour a working tea estate, visit a tea factory, and stroll through Victoria Park.', 'Tea,Train,Nature', 'Train', 'Nuwara Eliya', '19°C · Misty', 'The Kandy to Nuwara Eliya train is one of the world\'s most scenic rail journeys.', '5 hrs', 'Colonial Town Walk', 42.00, 65.00, 2),
(10, 2, 3, 'Nuwara Eliya to Ella', 'Scenic train ride through the highlands. Arrive in charming Ella village, hike to Little Adam\'s Peak.', 'Train,Hiking,Scenic', 'Mountain', 'Ella', '22°C · Clear', 'The iconic blue train winds through tea country at altitude — a once-in-a-lifetime experience.', '4 hrs', 'Little Adam\'s Peak', 50.00, 70.00, 3),
(11, 2, 4, 'Ella Rock & Nine Arch Bridge', 'Morning hike to Ella Rock for panoramic views. Visit the famous Nine Arch Bridge at sunset.', 'Hiking,Photography,Views', 'Mountain', 'Ella Rock', '23°C · Sunny', 'Ella Rock hike takes 3–4 hours return. Start early to avoid midday heat.', '4–5 hrs', 'Nine Arch Bridge', 50.00, 70.00, 4),
(12, 2, 5, 'Return to Colombo', 'Scenic drive back through the highlands. Afternoon leisure and departure.', 'Transfer,Departure', 'Plane', 'Colombo', '30°C · Clear', 'Final morning in the highlands before the journey back to Colombo.', '4 hrs', 'Safe Travels', 33.00, 74.50, 5),
(13, 3, 1, 'Colombo Arrival', 'Arrive and transfer to the southern coast. First night in Colombo or Bentota.', 'Arrival,Transfer', 'Plane', 'Colombo', '31°C · Humid', 'Welcome to Sri Lanka. Your driver will meet you at arrivals.', '2 hrs', 'Head South', 22.00, 85.00, 1),
(14, 3, 2, 'Galle Fort', 'Explore the UNESCO-listed Dutch colonial fort — cobblestone streets, boutique galleries, and ocean ramparts.', 'UNESCO,Heritage,Walking', 'MapPin', 'Galle Fort', '29°C · Sunny', 'Galle Fort is a living city within the walls of a 17th-century Dutch fortification.', '4–5 hrs', 'Fort Rampart Sunset', 30.00, 82.00, 2),
(15, 3, 4, 'Mirissa Beach', 'Snorkelling, whale watching, and fresh seafood on the most celebrated beach on the south coast.', 'Beach,Snorkelling,Wildlife', 'Ship', 'Mirissa', '30°C · Sunny', 'Blue whales and sperm whales frequent these waters November to April.', '6 hrs', 'Whale Watch at Dawn', 35.00, 90.00, 3),
(16, 3, 7, 'Tangalle', 'Secluded beaches and turtle nesting sites. Evening turtle watch at nearby conservation site.', 'Beach,Wildlife,Nature', 'Camera', 'Tangalle', '30°C · Clear', 'Tangalle\'s secluded bays are among the least commercialised on the south coast.', '3 hrs', 'Turtle Watch', 42.00, 92.00, 4),
(17, 3, 10, 'Departure', 'Final morning on the coast, transfer to Colombo airport.', 'Departure,Transfer', 'Plane', 'Colombo', '31°C · Clear', 'Allow 3.5 hours for the drive from the south coast to the airport.', '3.5 hrs', 'Safe Travels', 22.00, 85.00, 5),
(18, 4, 1, 'Colombo to Yala', 'Long scenic drive to Sri Lanka\'s most famous national park. Evening game drive at dusk.', 'Transfer,Safari,Wildlife', 'MapPin', 'Yala', '33°C · Dry', 'The drive from Colombo to Yala takes approximately 5 hours.', '5 hrs drive', 'Evening Safari', 55.00, 80.00, 1),
(19, 4, 2, 'Yala Dawn Safari', 'Two game drives — dawn and dusk — with the highest chance of leopard sightings globally.', 'Safari,Wildlife,Leopard', 'Camera', 'Yala Block 1', '34°C · Hot', 'Dawn safaris (5:30am start) yield the best leopard sightings. Your guide will track them.', '3+3 hrs', 'Leopard Territory', 55.00, 80.00, 2),
(20, 4, 3, 'Bundala Bird Sanctuary', 'A Ramsar Wetland teeming with flamingos, painted storks, and rare migratory birds.', 'Birdwatching,Nature,Wetlands', 'Camera', 'Bundala', '32°C · Partly Cloudy', 'Bundala is home to 200+ bird species including the Greater Flamingo.', '3 hrs', 'Sunset Lagoon', 48.00, 85.00, 3),
(21, 4, 4, 'Departure from South', 'Morning game walk at the forest edge. Transfer back to Colombo.', 'Safari,Transfer,Departure', 'Plane', 'Colombo', '31°C · Clear', 'Final morning walk before the journey back to Colombo airport.', '5 hrs', 'Safe Travels', 22.00, 85.00, 4),
(22, 5, 1, 'Arrival & Consultation', 'Arrive at your wellness retreat. Meet your Ayurvedic physician for a personalised dosha consultation.', 'Arrival,Wellness,Consultation', 'MapPin', 'Bentota', '30°C · Humid', 'Your Ayurvedic physician will assess your constitution (Prakriti) to design your personalised program.', '2 hrs', 'Welcome Ceremony', 25.00, 78.00, 1),
(23, 5, 3, 'Panchakarma Treatments', 'Full-day Panchakarma — the cornerstone of Ayurvedic detoxification and rejuvenation.', 'Wellness,Ayurveda,Healing', 'Heart', 'Treatment Centre', '29°C · Calm', 'Panchakarma is a five-fold detoxification therapy. Your physician prescribes the exact treatments.', '6 hrs', 'Yoga at Dusk', 25.00, 78.00, 2),
(24, 5, 6, 'River Yoga & Meditation', 'Sunrise yoga on the Bentota River, guided meditation in the mangrove forest.', 'Yoga,Meditation,Nature', 'Sun', 'Bentota River', '27°C · Peaceful', 'The river yoga session takes place on a floating platform at the edge of the lagoon.', '3 hrs', 'Herbal Kitchen', 25.00, 78.00, 3),
(25, 5, 10, 'Spice Garden Walk', 'Guided tour of a medicinal herb garden — learn the Ayurvedic properties of 50+ plants.', 'Nature,Wellness,Learning', 'Leaf', 'Spice Garden', '30°C · Warm', 'Sri Lanka\'s spice gardens contain over 200 medicinal plants used in Ayurvedic treatments.', '2 hrs', 'Final Treatments', 25.00, 78.00, 4),
(26, 5, 12, 'Closing Ceremony & Departure', 'Final consultation, wellness plan for home, and departure with renewed vitality.', 'Departure,Wellness,Closing', 'Plane', 'Colombo', '31°C · Clear', 'Your physician provides a personalised home wellness plan to continue your journey.', '3 hrs', 'Safe Travels', 22.00, 85.00, 5),
(27, 6, 1, 'Colombo to Kandy', 'Arrive and head to Kandy. Evening cultural show and night market exploration.', 'Transfer,Culture,Arrival', 'Train', 'Kandy', '27°C · Pleasant', 'Kandy is the last royal capital of the ancient Sinhala kingdoms.', '3 hrs', 'Cultural Show', 45.00, 55.00, 1),
(28, 6, 2, 'Blue Train to Ella', 'Board the legendary blue train through the most scenic railway in Asia. Arrive in Ella.', 'Train,Scenic,Highlands', 'Train', 'Kandy–Ella', '22°C · Misty', 'The Kandy to Ella train journey takes 6–7 hours through tea estates and waterfalls.', '6–7 hrs', 'Ella Village', 50.00, 70.00, 2),
(29, 6, 3, 'Little Adam\'s Peak & Nine Arch', 'Hike Little Adam\'s Peak at dawn, explore the iconic Nine Arch Bridge and local Ella town.', 'Hiking,Photography,Adventure', 'Mountain', 'Ella', '23°C · Clear', 'Little Adam\'s Peak is a 2-hour hike through tea estates with panoramic views of the valley.', '4 hrs', 'Nine Arch Bridge', 50.00, 70.00, 3),
(30, 6, 4, 'World\'s End — Horton Plains', 'Early start to Horton Plains National Park — hike to World\'s End, a sheer 870m cliff drop.', 'Hiking,Nature,Views', 'Mountain', 'Horton Plains', '16°C · Misty', 'World\'s End cloud cover clears between 6–9am. Arrive early for the full drop view.', '5–6 hrs', 'Baker\'s Falls', 42.00, 65.00, 4),
(31, 6, 5, 'Jungle Zip-line', 'Zip-line through Sri Lanka\'s rainforest canopy in the Knuckles Mountain Range.', 'Adventure,Zipline,Nature', 'Mountain', 'Knuckles Range', '24°C · Humid', 'The zip-line course runs through 1,500m of jungle canopy with 8 platforms.', '3 hrs', 'Bonfire Camp', 50.00, 50.00, 5),
(32, 6, 6, 'Return & Departure', 'Scenic drive from highlands to Colombo. Transfer to airport.', 'Departure,Transfer', 'Plane', 'Colombo', '31°C · Clear', 'Allow 4 hours for the drive from the highlands to Colombo airport.', '4 hrs', 'Safe Travels', 22.00, 85.00, 6);

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_hero`
--

CREATE TABLE `itinerary_hero` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `badge_text` varchar(100) DEFAULT 'Curated Journey',
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `duration_text` varchar(100) NOT NULL,
  `route_text` varchar(255) NOT NULL,
  `price_text` varchar(100) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `body_heading` varchar(255) NOT NULL,
  `body_text` text NOT NULL,
  `stat_1_value` varchar(50) NOT NULL,
  `stat_1_label` varchar(100) NOT NULL,
  `stat_2_value` varchar(50) NOT NULL,
  `stat_2_label` varchar(100) NOT NULL,
  `stat_3_value` varchar(50) NOT NULL,
  `stat_3_label` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itinerary_hero`
--

INSERT INTO `itinerary_hero` (`id`, `tour_id`, `badge_text`, `title`, `subtitle`, `duration_text`, `route_text`, `price_text`, `image_url`, `body_heading`, `body_text`, `stat_1_value`, `stat_1_label`, `stat_2_value`, `stat_2_label`, `stat_3_value`, `stat_3_label`, `created_at`) VALUES
(1, 1, 'Cultural Heritage', 'The Cultural Triangle', 'Ancient kingdoms, sacred temples, and golden plains', '7 Days · 6 Nights', 'Colombo → Sigiriya → Polonnaruwa → Kandy', 'From LKR 245,000', '/uploads/6eae50feb41f7bc98a4795f805ba48ce.webp', 'Where Civilizations Were Born', 'Journey through the heartland of ancient Sri Lanka, where colossal rock fortresses pierce the sky and sacred temples echo centuries of devotion. This is not merely a tour — it is an immersion into a civilisation that shaped an entire island nation.', '3', 'UNESCO Sites', '7', 'Days', '12+', 'Experiences', '2026-04-17 02:26:40'),
(2, 2, 'Luxury Escape ', 'Hill Country Serenity ', 'Mist, mountains, and colonial elegance', '5 Days · 4 Nights', 'Colombo → Kandy → Nuwara Eliya → Ella', 'From LKR 225,000', '/uploads/937d9977a7a4351741eb127b96d58edd.webp', 'Above the Clouds', 'Ascend into Sri Lanka\'s misty highlands where colonial bungalows perch above emerald tea terraces and cascading waterfalls carve through ancient rock. The hill country moves at a different pace — slower, quieter, more intentional.', '2,000m', 'Elevation', '5', 'Days ', '8+', 'Luxury Stays', '2026-04-17 02:26:40'),
(3, 3, 'Coastal Retreat', 'Southern Shores', 'Heritage, surf, and golden coastline', '10 Days · 9 Nights', 'Colombo → Galle → Mirissa → Tangalle', 'From LKR 375,000', '/uploads/25db7f1397cf1a6a29aa22c08a23e4e7.webp', 'Where the Ocean Tells Stories', 'Follow the southern arc of Sri Lanka from the ramparts of a Dutch colonial fort to secret surf beaches and whale-watching horizons. The south rewards the unhurried traveller with flavours, colour, and coastline unlike anywhere else on earth.', '10', 'Days', '3', 'Coastal Towns', '5★', 'Accommodations', '2026-04-17 02:26:40'),
(4, 4, 'Wildlife Safari', 'Untamed Wilderness', 'Leopards, elephants and the wild heart of Sri Lanka', '4 Days · 3 Nights', 'Colombo → Yala → Bundala', 'From LKR 80,000', '/uploads/6af9425f0ff30c650214fdae5eeea4e0.webp', 'Into the Wild', 'Sri Lanka hosts the world\'s highest density of leopards per square kilometre. Yala is their kingdom — and you are their guest. Between game drives at dawn, the wilderness reveals itself: elephant herds at dusk, crocodiles in still lagoons, painted storks against fading skies.', '40+', 'Wildlife Species', '4', 'Days', '2', 'National Parks', '2026-04-17 02:26:40'),
(5, 5, 'Wellness Journey', 'Ayurvedic Sanctuary', 'Ancient healing for the modern soul', '12 Days · 11 Nights', 'Colombo → Bentota → Hikkaduwa', 'From LKR 175,000', '/uploads/f55492acbf9c5418cf84a5934125005d.webp', 'The Art of Restoration', 'Ayurveda is not a spa treatment — it is a 5,000-year-old science of living. This twelve-day journey places you entirely within its embrace: personalised herbal therapies, sunrise yoga by the lagoon, and a plant-based kitchen that heals from within.', '12', 'Days', '20+', 'Treatments', '3', 'Wellness Centres', '2026-04-17 02:26:40'),
(6, 6, 'Highland Trek', 'Adventure Trek', 'Train rides, peak hikes and jungle canopies', '6 Days · 5 Nights', 'Colombo → Kandy → Ella → Horton Plains', 'From LKR 889,750', '/uploads/8c19dcdadb7ddb86af1f55e35ecb3f71.webp', 'The Road Less Taken', 'Board the most scenic train on earth, hike to the edge of the world, and zip-line through jungle that breathes around you. Sri Lanka\'s highlands are not a backdrop — they are the adventure itself. Every elevation gained reveals a new Sri Lanka.', '2,243m', 'Highest Peak', '6', 'Days', '15km', 'Trails Covered', '2026-04-17 02:26:40');

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_inclusions`
--

CREATE TABLE `itinerary_inclusions` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `type` enum('included','not_included') NOT NULL DEFAULT 'included',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itinerary_inclusions`
--

INSERT INTO `itinerary_inclusions` (`id`, `tour_id`, `type`, `title`, `description`, `sort_order`) VALUES
(1, 1, 'included', 'Curated Accommodations', 'Luxury boutique stays and heritage villas throughout.', 1),
(2, 1, 'included', 'Gourmet Dining', 'All breakfasts and select chef-curated evening meals.', 2),
(3, 1, 'included', 'Private Transportation', 'Executive climate-controlled vehicles with professional drivers.', 3),
(4, 1, 'included', 'Specialized Entry', 'VIP access to all UNESCO sites and historical monuments.', 4),
(5, 1, 'not_included', 'Lunch & Additional Meals', 'Enjoy local restaurants at your own pace.', 1),
(6, 1, 'not_included', 'Travel Insurance', 'Mandatory comprehensive travel and medical insurance.', 2),
(7, 1, 'not_included', 'Personal Gratuities', 'Tipping for guides, drivers, and hotel staff.', 3),
(8, 2, 'included', 'Luxury Hill Country Stays', 'Colonial bungalows and boutique lodges with mountain views.', 1),
(9, 2, 'included', 'Scenic Train Tickets', 'First-class train tickets for the iconic Kandy to Ella route.', 2),
(10, 2, 'included', 'Tea Estate Tours', 'Private guided tours of two working tea plantations.', 3),
(11, 2, 'included', 'All Transfers', 'Private air-conditioned vehicles throughout the journey.', 4),
(12, 2, 'not_included', 'International Flights', 'Flights to and from Sri Lanka not included.', 1),
(13, 2, 'not_included', 'Travel Insurance', 'Mandatory comprehensive travel and medical insurance.', 2),
(14, 2, 'not_included', 'Personal Shopping', 'Purchases from boutiques and craft markets along the way.', 3),
(15, 3, 'included', 'Boutique Coastal Stays', '5-star and boutique beachfront properties throughout.', 1),
(16, 3, 'included', 'Whale Watching Excursion', 'Private boat whale watching at Mirissa.', 2),
(17, 3, 'included', 'Galle Fort Guided Tour', 'Private heritage walking tour of the UNESCO fort.', 3),
(18, 3, 'included', 'All Coastal Transfers', 'Comfortable private transport along the southern coast.', 4),
(19, 3, 'not_included', 'Snorkelling Equipment', 'Available to rent locally at the beach.', 1),
(20, 3, 'not_included', 'Travel Insurance', 'Mandatory comprehensive travel and medical insurance.', 2),
(21, 3, 'not_included', 'Lunch & Drinks', 'Coastal restaurants offer exceptional fresh seafood.', 3),
(22, 4, 'included', 'Safari Game Drives', 'Four safari drives in Yala with licensed wildlife guide.', 1),
(23, 4, 'included', 'Luxury Safari Lodge', 'Glamping accommodation inside the national park boundary.', 2),
(24, 4, 'included', 'Park Entry Fees', 'All national park permits and conservation fees.', 3),
(25, 4, 'included', 'All Meals at Camp', 'Full board at the safari lodge — all meals included.', 4),
(26, 4, 'not_included', 'Alcoholic Beverages', 'Available for purchase at the lodge bar.', 1),
(27, 4, 'not_included', 'Travel Insurance', 'Mandatory comprehensive travel and medical insurance.', 2),
(28, 4, 'not_included', 'Personal Gratuities', 'Tipping for your guide and tracker is appreciated.', 3),
(29, 5, 'included', 'All Ayurvedic Treatments', 'Daily personalised treatments prescribed by your physician.', 1),
(30, 5, 'included', 'Sattvic Cuisine', 'Three plant-based meals daily prepared by the wellness kitchen.', 2),
(31, 5, 'included', 'Yoga & Meditation Sessions', 'Daily guided yoga and meditation with certified instructors.', 3),
(32, 5, 'included', 'Doctor Consultations', 'Opening, mid-program, and closing physician consultations.', 4),
(33, 5, 'not_included', 'Additional Treatments', 'Extra treatments beyond the daily program.', 1),
(34, 5, 'not_included', 'Travel Insurance', 'Mandatory comprehensive travel and medical insurance.', 2),
(35, 5, 'not_included', 'Herbal Supplements for Home', 'Post-retreat supplements available for purchase.', 3),
(36, 6, 'included', 'Scenic Train Tickets', 'First-class reserved tickets on the iconic blue train.', 1),
(37, 6, 'included', 'Zip-line Experience', 'Full jungle canopy zip-line course in the Knuckles Range.', 2),
(38, 6, 'included', 'Horton Plains Entry', 'National park permits and guided ranger hike.', 3),
(39, 6, 'included', 'Adventure Gear', 'All hiking equipment, trekking poles, and safety gear.', 4),
(40, 6, 'not_included', 'Travel Insurance', 'Mandatory comprehensive travel and medical insurance.', 1),
(41, 6, 'not_included', 'Personal Gratuities', 'Tipping for guides and drivers.', 2),
(42, 6, 'not_included', 'Meals on Train', 'Light snacks and meals available for purchase on board.', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` int(11) NOT NULL,
  `tag` varchar(50) NOT NULL DEFAULT 'CULTURAL',
  `tag_color` varchar(50) NOT NULL DEFAULT 'bg-emerald-700',
  `title` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'FAMILY',
  `days` int(11) NOT NULL DEFAULT 5,
  `description` text NOT NULL,
  `flyer_description` text DEFAULT NULL,
  `price` varchar(50) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `flyer_image_url` varchar(512) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `coordinates` varchar(100) DEFAULT NULL,
  `map_pin_x` decimal(5,2) NOT NULL DEFAULT 50.00,
  `map_pin_y` decimal(5,2) NOT NULL DEFAULT 50.00,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `tag`, `tag_color`, `title`, `type`, `days`, `description`, `flyer_description`, `price`, `image_url`, `flyer_image_url`, `location`, `province`, `coordinates`, `map_pin_x`, `map_pin_y`, `sort_order`, `is_active`, `created_at`) VALUES
(1, 'CULTURAL', 'bg-emerald-700', 'The Cultural Triangle', 'FAMILY', 7, 'Explore the ancient ruins of Sigiriya and Polonnaruwa, then witness the spiritual heart of Kandy in this timeless journey.', NULL, '245,000', '/images/cultural-triangle.JPG', '/uploads/b68fd57b7df7f29932ccbda0a6a8a2e4.jpg', 'Sigiriya', 'Central Province', '7.9519° N, 80.7601° E', 55.10, 47.00, 1, 1, '2026-04-16 04:22:40'),
(2, 'LUXURY', 'bg-amber-700', 'Hill Country Serenity', 'COUPLE', 5, 'Indulge in colonial charm and luxury lodges amidst the misty emerald tea plantations of Nuwara Eliya and Ella.', NULL, '225,000', '/images/hill-country.JPEG', NULL, 'Nuwara Eliya', 'Central Province', '6.9497° N, 80.7891° E', 55.80, 67.50, 2, 1, '2026-04-16 04:22:40'),
(3, 'RELAXATION', 'bg-blue-700', 'Southern Shores', 'FAMILY', 10, 'Sun-drenched days from Galle Fort to the surf beaches of Mirissa. A perfect blend of heritage and relaxation.', NULL, '375,000', '/images/southern-shores.JPG', NULL, 'Mirissa', 'Southern Province', '5.9483° N, 80.4578° E', 30.00, 82.00, 3, 1, '2026-04-16 04:22:40'),
(4, 'ADVENTURE', 'bg-emerald-700', 'Untamed Wilderness', 'SOLO', 4, 'Go deep into the heart of Yala National Park for leopards, elephants, and rare birdlife in an immersive safari.', NULL, '80,000', '/images/untamed-wild.JPG', NULL, 'Yala', 'Southern Province', '6.3728° N, 81.5168° E', 55.00, 80.00, 4, 1, '2026-04-16 04:22:40'),
(5, 'WELLNESS', 'bg-amber-700', 'Ayurvedic Sanctuary', 'COUPLE', 12, 'A holistic journey focusing on mind and body rejuvenation through traditional Ayurvedic practices and yoga.', NULL, '175,000', '/images/ayurvedic-sanctuary.JPEG', NULL, 'Bentota', 'Western Province', '6.4218° N, 79.9957° E', 25.00, 78.00, 5, 1, '2026-04-16 04:22:40'),
(6, 'ADVENTURE', 'bg-emerald-700', 'Adventure Trek', 'GROUP', 6, 'Ride the iconic blue train through the mountains and hike to the world\'s end in this active highland exploration.', NULL, '889,750', '/images/adventure-trek.PNG', NULL, 'Horton Plains', 'Uva Province', '6.8021° N, 80.8031° E', 42.00, 65.00, 6, 1, '2026-04-16 04:22:40');

-- --------------------------------------------------------

--
-- Table structure for table `tours_hero`
--

CREATE TABLE `tours_hero` (
  `id` int(11) NOT NULL,
  `heading` varchar(255) NOT NULL DEFAULT 'Discover Sri Lanka',
  `subheading` varchar(255) NOT NULL DEFAULT 'Curated journeys for every kind of traveller.',
  `image_url` varchar(512) NOT NULL DEFAULT '/images/tours-hero.jpg',
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tours_hero`
--

INSERT INTO `tours_hero` (`id`, `heading`, `subheading`, `image_url`, `is_active`, `updated_at`) VALUES
(1, 'Discover Sri Lanka', 'Curated journeys for every kind of traveller. Hello', '/uploads/efd39f8dcad1cd878b7bf6357552e233.jpg', 1, '2026-04-17 08:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `tour_carousel`
--

CREATE TABLE `tour_carousel` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'SCENIC',
  `image_url` varchar(512) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tour_carousel`
--

INSERT INTO `tour_carousel` (`id`, `title`, `category`, `image_url`, `description`, `sort_order`, `is_active`, `created_at`) VALUES
(1, 'Tea Trails', 'SCENIC', 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&q=80', 'Wander through emerald hills', 1, 1, '2026-04-16 04:22:40'),
(2, 'Aqua Descent', 'ADVENTURE', 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80', 'Feel the rush of the falls', 2, 1, '2026-04-16 04:22:40'),
(3, 'Spice Craft', 'CULTURAL', '/uploads/0b3db5323081bcdea0a18c87474e9ad4.jpg', 'Learn authentic Sri Lankan flavors hands-on', 3, 1, '2026-04-16 04:22:40'),
(4, 'Sky Rush', 'SCENIC', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80', 'Experience the ultimate view', 4, 1, '2026-04-16 04:22:40'),
(5, 'Wave Ride', 'ADVENTURE', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', 'Catch the perfect break', 5, 1, '2026-04-16 04:22:40');

-- --------------------------------------------------------

--
-- Table structure for table `tour_highlights`
--

CREATE TABLE `tour_highlights` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `icon_name` varchar(50) NOT NULL DEFAULT 'Star',
  `text` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `flyer_image_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tour_highlights`
--

INSERT INTO `tour_highlights` (`id`, `tour_id`, `icon_name`, `text`, `sort_order`, `flyer_image_url`) VALUES
(1, 1, 'Landmark', 'Climb the iconic Sigiriya Rock Fortress', 1, NULL),
(2, 1, 'Camera', 'Photograph ancient Polonnaruwa ruins', 2, NULL),
(3, 1, 'Music', 'Watch the Kandy Esala Perahera ceremony', 3, NULL),
(4, 2, 'Train', 'Ride the iconic blue train through the hills', 1, NULL),
(5, 2, 'Leaf', 'Tour a working tea plantation', 2, NULL),
(6, 2, 'Mountain', 'Sunrise hike at Little Adam\'s Peak', 3, NULL),
(7, 3, 'Droplets', 'Snorkeling the Reef at Mirissa', 1, NULL),
(8, 3, 'Mountain', 'Coastline Hike along Galle ramparts', 2, NULL),
(9, 3, 'Utensils', 'Fresh Ocean-to-Table Dining', 3, NULL),
(10, 4, 'Binoculars', 'Leopard spotting at Yala National Park', 1, NULL),
(11, 4, 'Bird', 'Rare birdlife and elephant herds at dusk', 2, NULL),
(12, 4, 'Tent', 'Glamping under the Sri Lankan night sky', 3, NULL),
(13, 5, 'Heart', 'Traditional Ayurvedic treatments daily', 1, NULL),
(14, 5, 'Sun', 'Morning yoga overlooking the lagoon', 2, NULL),
(15, 5, 'Utensils', 'Sattvic plant-based cuisine experience', 3, NULL),
(16, 6, 'Mountain', 'Hike to World\'s End at Horton Plains', 1, NULL),
(17, 6, 'Train', 'Blue train ride from Kandy to Ella', 2, NULL),
(18, 6, 'Wind', 'Zip-line through the jungle canopy', 3, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `chronicle_cards`
--
ALTER TABLE `chronicle_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experiences`
--
ALTER TABLE `experiences`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience_gallery`
--
ALTER TABLE `experience_gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience_hero`
--
ALTER TABLE `experience_hero`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience_highlights`
--
ALTER TABLE `experience_highlights`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flyers`
--
ALTER TABLE `flyers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itinerary_carousel`
--
ALTER TABLE `itinerary_carousel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `itinerary_hero`
--
ALTER TABLE `itinerary_hero`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tour_id` (`tour_id`);

--
-- Indexes for table `itinerary_inclusions`
--
ALTER TABLE `itinerary_inclusions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tours_hero`
--
ALTER TABLE `tours_hero`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tour_carousel`
--
ALTER TABLE `tour_carousel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chronicle_cards`
--
ALTER TABLE `chronicle_cards`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `experiences`
--
ALTER TABLE `experiences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `experience_gallery`
--
ALTER TABLE `experience_gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `experience_hero`
--
ALTER TABLE `experience_hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `experience_highlights`
--
ALTER TABLE `experience_highlights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `flyers`
--
ALTER TABLE `flyers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `itinerary_carousel`
--
ALTER TABLE `itinerary_carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `itinerary_hero`
--
ALTER TABLE `itinerary_hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `itinerary_inclusions`
--
ALTER TABLE `itinerary_inclusions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tours_hero`
--
ALTER TABLE `tours_hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tour_carousel`
--
ALTER TABLE `tour_carousel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itinerary_carousel`
--
ALTER TABLE `itinerary_carousel`
  ADD CONSTRAINT `itinerary_carousel_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  ADD CONSTRAINT `itinerary_days_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `itinerary_hero`
--
ALTER TABLE `itinerary_hero`
  ADD CONSTRAINT `itinerary_hero_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `itinerary_inclusions`
--
ALTER TABLE `itinerary_inclusions`
  ADD CONSTRAINT `itinerary_inclusions_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  ADD CONSTRAINT `tour_highlights_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
