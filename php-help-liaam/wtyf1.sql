-- phpMyAdmin SQL Dump
-- version 5.0.4deb2ubuntu5
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 29 mars 2022 à 19:52
-- Version du serveur :  10.5.15-MariaDB-0ubuntu0.21.10.1
-- Version de PHP : 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `wtyf1`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrateur`
--

CREATE TABLE `administrateur` (
  `id_admin` int(11) NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `date_de_naissance` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Authentification`
--

CREATE TABLE `Authentification` (
  `Id_Authentification` int(11) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `MotdePasse` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `authentifier`
--

CREATE TABLE `authentifier` (
  `Id_ComptePerso` int(11) NOT NULL,
  `Id_Etudiant` int(11) NOT NULL,
  `Id_ComptePerso_ComptePilote` int(11) NOT NULL,
  `Id_Pilote_ComptePilote` int(11) NOT NULL,
  `Id_Authentification` int(11) NOT NULL,
  `Id_ComptePerso_Delegue` int(11) NOT NULL,
  `Id_Delegue` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Candidature`
--

CREATE TABLE `Candidature` (
  `Id_Candidature` int(11) NOT NULL,
  `CV` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `CompteEtudiant`
--

CREATE TABLE `CompteEtudiant` (
  `Id_ComptePerso` int(11) NOT NULL,
  `Id_Etudiant` int(11) NOT NULL,
  `Nom` char(5) NOT NULL,
  `Prenom` char(50) NOT NULL,
  `centre` varchar(20) NOT NULL,
  `promotion` varchar(20) NOT NULL,
  `classe` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `ComptePerso`
--

CREATE TABLE `ComptePerso` (
  `Id_ComptePerso` int(11) NOT NULL,
  `Nom` char(5) NOT NULL,
  `Prenom` char(50) NOT NULL,
  `centre` varchar(20) NOT NULL,
  `promotion` varchar(20) NOT NULL,
  `classe` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `ComptePerso`
--

INSERT INTO `ComptePerso` (`Id_ComptePerso`, `Nom`, `Prenom`, `centre`, `promotion`, `classe`) VALUES
(1, 'comp', 'unPrenom', 'Centre', '2022', 'Classe');

-- --------------------------------------------------------

--
-- Structure de la table `ComptePilote`
--

CREATE TABLE `ComptePilote` (
  `Id_ComptePerso` int(11) NOT NULL,
  `Id_Pilote` int(11) NOT NULL,
  `Nom` char(5) NOT NULL,
  `Prenom` char(50) NOT NULL,
  `centre` varchar(20) NOT NULL,
  `promotion` varchar(20) NOT NULL,
  `classe` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `ComptePilote`
--

INSERT INTO `ComptePilote` (`Id_ComptePerso`, `Id_Pilote`, `Nom`, `Prenom`, `centre`, `promotion`, `classe`) VALUES
(1, 12, 'name', 'Prenom Pilote', 'Centre', '2022', 'classe');

-- --------------------------------------------------------

--
-- Structure de la table `Delegue`
--

CREATE TABLE `Delegue` (
  `Id_ComptePerso` int(11) NOT NULL,
  `Id_Delegue` int(11) NOT NULL,
  `Nom` char(5) NOT NULL,
  `Prenom` char(50) NOT NULL,
  `centre` varchar(20) NOT NULL,
  `promotion` varchar(20) NOT NULL,
  `classe` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `droit`
--

CREATE TABLE `droit` (
  `id` int(11) NOT NULL,
  `id_droit` int(11) NOT NULL,
  `Nom_du_programme` varchar(50) NOT NULL,
  `Id_ComptePerso` int(11) NOT NULL,
  `id_admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Offre_de_Stage`
--

CREATE TABLE `Offre_de_Stage` (
  `Id_OffreDeStage` int(11) NOT NULL,
  `Competence` varchar(50) NOT NULL,
  `Localisation` varchar(50) NOT NULL,
  `Entreprise` char(5) NOT NULL,
  `DureeStage` varchar(50) NOT NULL,
  `Remuneration` varchar(5) NOT NULL,
  `NombrePlaceStage` varchar(50) NOT NULL,
  `Date` char(5) NOT NULL,
  `Nom_de_l_offre` varchar(50) NOT NULL,
  `Id_ComptePerso` int(11) NOT NULL,
  `Id_Pilote` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `Offre_de_Stage`
--

INSERT INTO `Offre_de_Stage` (`Id_OffreDeStage`, `Competence`, `Localisation`, `Entreprise`, `DureeStage`, `Remuneration`, `NombrePlaceStage`, `Date`, `Nom_de_l_offre`, `Id_ComptePerso`, `Id_Pilote`) VALUES
(12, 'Développement', '78', 'Entre', '2mois', '1500', '12', '12/03', 'Développeur web', 1, 12),
(978, 'Développement', '91', 'Entre', '4mois', '1200', '1', '05/12', 'Testeur', 1, 12),
(6546, 'Ingénieur', '45', 'Toto', '8mois', '6000', '2', '09/12', 'Ingénieur', 1, 12);

-- --------------------------------------------------------

--
-- Structure de la table `postuler`
--

CREATE TABLE `postuler` (
  `Id_Candidature` int(11) NOT NULL,
  `Id_OffreDeStage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `Soumettre`
--

CREATE TABLE `Soumettre` (
  `Id_ComptePerso` int(11) NOT NULL,
  `Id_Candidature` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `administrateur`
--
ALTER TABLE `administrateur`
  ADD PRIMARY KEY (`id_admin`);

--
-- Index pour la table `Authentification`
--
ALTER TABLE `Authentification`
  ADD PRIMARY KEY (`Id_Authentification`);

--
-- Index pour la table `authentifier`
--
ALTER TABLE `authentifier`
  ADD PRIMARY KEY (`Id_ComptePerso`,`Id_Etudiant`,`Id_ComptePerso_ComptePilote`,`Id_Pilote_ComptePilote`,`Id_Authentification`,`Id_ComptePerso_Delegue`,`Id_Delegue`),
  ADD KEY `authentifier_ComptePilote0_FK` (`Id_ComptePerso_ComptePilote`,`Id_Pilote_ComptePilote`),
  ADD KEY `authentifier_Authentification1_FK` (`Id_Authentification`),
  ADD KEY `authentifier_Delegue2_FK` (`Id_ComptePerso_Delegue`,`Id_Delegue`);

--
-- Index pour la table `Candidature`
--
ALTER TABLE `Candidature`
  ADD PRIMARY KEY (`Id_Candidature`);

--
-- Index pour la table `CompteEtudiant`
--
ALTER TABLE `CompteEtudiant`
  ADD PRIMARY KEY (`Id_ComptePerso`,`Id_Etudiant`);

--
-- Index pour la table `ComptePerso`
--
ALTER TABLE `ComptePerso`
  ADD PRIMARY KEY (`Id_ComptePerso`);

--
-- Index pour la table `ComptePilote`
--
ALTER TABLE `ComptePilote`
  ADD PRIMARY KEY (`Id_ComptePerso`,`Id_Pilote`);

--
-- Index pour la table `Delegue`
--
ALTER TABLE `Delegue`
  ADD PRIMARY KEY (`Id_ComptePerso`,`Id_Delegue`);

--
-- Index pour la table `droit`
--
ALTER TABLE `droit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `droit_ComptePerso_FK` (`Id_ComptePerso`),
  ADD KEY `droit_administrateur0_FK` (`id_admin`);

--
-- Index pour la table `Offre_de_Stage`
--
ALTER TABLE `Offre_de_Stage`
  ADD PRIMARY KEY (`Id_OffreDeStage`),
  ADD KEY `Offre_de_Stage_ComptePilote_FK` (`Id_ComptePerso`,`Id_Pilote`);

--
-- Index pour la table `postuler`
--
ALTER TABLE `postuler`
  ADD PRIMARY KEY (`Id_Candidature`,`Id_OffreDeStage`),
  ADD KEY `postuler_Offre_de_Stage0_FK` (`Id_OffreDeStage`);

--
-- Index pour la table `Soumettre`
--
ALTER TABLE `Soumettre`
  ADD PRIMARY KEY (`Id_ComptePerso`,`Id_Candidature`),
  ADD KEY `Soumettre_Candidature0_FK` (`Id_Candidature`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `administrateur`
--
ALTER TABLE `administrateur`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Authentification`
--
ALTER TABLE `Authentification`
  MODIFY `Id_Authentification` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Candidature`
--
ALTER TABLE `Candidature`
  MODIFY `Id_Candidature` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ComptePerso`
--
ALTER TABLE `ComptePerso`
  MODIFY `Id_ComptePerso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `droit`
--
ALTER TABLE `droit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Offre_de_Stage`
--
ALTER TABLE `Offre_de_Stage`
  MODIFY `Id_OffreDeStage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6547;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `authentifier`
--
ALTER TABLE `authentifier`
  ADD CONSTRAINT `authentifier_Authentification1_FK` FOREIGN KEY (`Id_Authentification`) REFERENCES `Authentification` (`Id_Authentification`),
  ADD CONSTRAINT `authentifier_CompteEtudiant_FK` FOREIGN KEY (`Id_ComptePerso`,`Id_Etudiant`) REFERENCES `CompteEtudiant` (`Id_ComptePerso`, `Id_Etudiant`),
  ADD CONSTRAINT `authentifier_ComptePilote0_FK` FOREIGN KEY (`Id_ComptePerso_ComptePilote`,`Id_Pilote_ComptePilote`) REFERENCES `ComptePilote` (`Id_ComptePerso`, `Id_Pilote`),
  ADD CONSTRAINT `authentifier_Delegue2_FK` FOREIGN KEY (`Id_ComptePerso_Delegue`,`Id_Delegue`) REFERENCES `Delegue` (`Id_ComptePerso`, `Id_Delegue`);

--
-- Contraintes pour la table `CompteEtudiant`
--
ALTER TABLE `CompteEtudiant`
  ADD CONSTRAINT `CompteEtudiant_ComptePerso_FK` FOREIGN KEY (`Id_ComptePerso`) REFERENCES `ComptePerso` (`Id_ComptePerso`);

--
-- Contraintes pour la table `ComptePilote`
--
ALTER TABLE `ComptePilote`
  ADD CONSTRAINT `ComptePilote_ComptePerso_FK` FOREIGN KEY (`Id_ComptePerso`) REFERENCES `ComptePerso` (`Id_ComptePerso`);

--
-- Contraintes pour la table `Delegue`
--
ALTER TABLE `Delegue`
  ADD CONSTRAINT `Delegue_ComptePerso_FK` FOREIGN KEY (`Id_ComptePerso`) REFERENCES `ComptePerso` (`Id_ComptePerso`);

--
-- Contraintes pour la table `droit`
--
ALTER TABLE `droit`
  ADD CONSTRAINT `droit_ComptePerso_FK` FOREIGN KEY (`Id_ComptePerso`) REFERENCES `ComptePerso` (`Id_ComptePerso`),
  ADD CONSTRAINT `droit_administrateur0_FK` FOREIGN KEY (`id_admin`) REFERENCES `administrateur` (`id_admin`);

--
-- Contraintes pour la table `Offre_de_Stage`
--
ALTER TABLE `Offre_de_Stage`
  ADD CONSTRAINT `Offre_de_Stage_ComptePilote_FK` FOREIGN KEY (`Id_ComptePerso`,`Id_Pilote`) REFERENCES `ComptePilote` (`Id_ComptePerso`, `Id_Pilote`);

--
-- Contraintes pour la table `postuler`
--
ALTER TABLE `postuler`
  ADD CONSTRAINT `postuler_Candidature_FK` FOREIGN KEY (`Id_Candidature`) REFERENCES `Candidature` (`Id_Candidature`),
  ADD CONSTRAINT `postuler_Offre_de_Stage0_FK` FOREIGN KEY (`Id_OffreDeStage`) REFERENCES `Offre_de_Stage` (`Id_OffreDeStage`);

--
-- Contraintes pour la table `Soumettre`
--
ALTER TABLE `Soumettre`
  ADD CONSTRAINT `Soumettre_Candidature0_FK` FOREIGN KEY (`Id_Candidature`) REFERENCES `Candidature` (`Id_Candidature`),
  ADD CONSTRAINT `Soumettre_ComptePerso_FK` FOREIGN KEY (`Id_ComptePerso`) REFERENCES `ComptePerso` (`Id_ComptePerso`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
