-- phpMyAdmin SQL Dump
-- version 4.9.5deb2~bpo10+1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 29, 2020 at 10:27 PM
-- Server version: 10.3.22-MariaDB-0+deb10u1
-- PHP Version: 7.3.14-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trombinouc`
--

-- --------------------------------------------------------

--
-- Table structure for table `amitie`
--

CREATE TABLE `amitie` (
  `idAmitie` int(11) NOT NULL,
  `idUser1` int(11) NOT NULL,
  `idUser2` int(11) NOT NULL,
  `valeur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `amitie`
--

INSERT INTO `amitie` (`idAmitie`, `idUser1`, `idUser2`, `valeur`) VALUES
(23, 7, 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `publication`
--

CREATE TABLE `publication` (
  `idPubli` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `texte` varchar(1000) NOT NULL,
  `img` varchar(400) NOT NULL,
  `datePubli` datetime NOT NULL,
  `optionVisi` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `publication`
--

INSERT INTO `publication` (`idPubli`, `idUser`, `titre`, `texte`, `img`, `datePubli`, `optionVisi`) VALUES
(8, 5, 'Je suis l&apos;OVNI', 'Coucou Trombinouc', '0', '2020-05-29 22:23:13', 1),
(9, 6, 'VOici une publication de l&apos;IUT', 'La publication de l&apos;IUT\r\n', '0', '2020-05-29 22:23:54', 1),
(10, 7, 'Une publication des profs', 'bonjour', '0', '2020-05-29 22:25:30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `reponse`
--

CREATE TABLE `reponse` (
  `idRep` int(11) NOT NULL,
  `idUserRep` int(11) NOT NULL,
  `idPubliRep` int(11) NOT NULL,
  `texte` varchar(255) NOT NULL,
  `dateRep` datetime NOT NULL,
  `optionVisi` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `dateNaiss` date NOT NULL,
  `mail` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `optionUn` int(11) DEFAULT 0,
  `optionDeux` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `prenom`, `nom`, `dateNaiss`, `mail`, `mdp`, `optionUn`, `optionDeux`) VALUES
(5, 'Jul', 'OVNI', '2000-01-01', 'jul@gmail.com', '$2y$10$eZOJhsDuectVBzEPrw51AOTod8u9Z/Um.mFeXKmn3CpBa0O4SSwHG', 0, 0),
(6, 'IUT', 'RetT', '2000-01-01', 'iut@gmail.com', '$2y$10$E7Kc.FBFuiD.9eXf7M2ILeCIWhHcKo8c.KSthB39FJS6q3pK4JYGy', 0, 0),
(7, 'Madame', 'prof', '2000-01-01', 'prof@gmail.com', '$2y$10$R/UT9GQckpaGyGCXWfsOa.7l4./jBbVVevYpfh.vcdSiAKcyftBpm', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amitie`
--
ALTER TABLE `amitie`
  ADD PRIMARY KEY (`idAmitie`),
  ADD KEY `idUser1` (`idUser1`),
  ADD KEY `idUser2` (`idUser2`);

--
-- Indexes for table `publication`
--
ALTER TABLE `publication`
  ADD PRIMARY KEY (`idPubli`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `reponse`
--
ALTER TABLE `reponse`
  ADD PRIMARY KEY (`idRep`),
  ADD KEY `idUserRep` (`idUserRep`),
  ADD KEY `idPubliRep` (`idPubliRep`);

--
-- Indexes for table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amitie`
--
ALTER TABLE `amitie`
  MODIFY `idAmitie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `publication`
--
ALTER TABLE `publication`
  MODIFY `idPubli` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `reponse`
--
ALTER TABLE `reponse`
  MODIFY `idRep` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `amitie`
--
ALTER TABLE `amitie`
  ADD CONSTRAINT `idUser1` FOREIGN KEY (`idUser1`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `idUser2` FOREIGN KEY (`idUser2`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `publication`
--
ALTER TABLE `publication`
  ADD CONSTRAINT `idUser` FOREIGN KEY (`idUser`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `reponse`
--
ALTER TABLE `reponse`
  ADD CONSTRAINT `idPubliRep` FOREIGN KEY (`idPubliRep`) REFERENCES `publication` (`idPubli`),
  ADD CONSTRAINT `idUserRep` FOREIGN KEY (`idUserRep`) REFERENCES `utilisateur` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
