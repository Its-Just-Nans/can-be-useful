<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WTYF Site</title>
    <script src="https://kit.fontawesome.com/94eec44603.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="Accueil.css">


    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <style>
        .carousel-item {
            min-height: 280px;
        }
    </style>

</head>

<body>
    <section class="main">
        <header>
            <a href="#"><img src="logo.png" class="logo" alt=""></a>
            <div class="menu-hand"></div>
            <ul class="navigation">
                <li><a href="#">acceuil</a></li>
                <li><a href="./offres.php">offres d'emplois</a></li>
                <li><a href="#">pilote</a></li>
                <li><a href="#">login</a></li>
                <li><a href="#">contact</a></li>
            </ul>
        </header>
        <div class="content">
            <img src="imgac.png" class="imgac" alt="">
            <div class="sliderSection">
                <span>Welcome To Your Future</span>
            </div>
            <form method="POST" action="">
                <label>Competence</label>
                <select name="Competence">
                    <?php
                    require_once("./function_search.php");
                    display_list(getCompetences(), $_POST["Competence"]);
                    ?>
                </select>
                <br />
                <label>Entreprise</label>
                <select name="Entreprise">
                    <?php
                    display_list(getEntreprises(), $_POST["Entreprise"]);
                    ?>
                </select>
                <br />
                <label>DureeStage</label>
                <select name="DureeStage">
                    <?php
                    display_list(getDureeStage(), $_POST["DureeStage"]);
                    ?>
                </select>
                <br />
                <label>Remuneration</label>
                <select name="Remuneration">
                    <?php
                    display_list(getRemuneration(), $_POST["Remuneration"]);
                    ?>
                </select>
                <br />
                <input type="submit" name="search" value="Rechercher !">
            </form>
            <div class="result">
                <?php
                if (isset($_POST["search"])) {
                    $results = getResultSearch($_POST);
                    foreach ($results as $oneResult) {
                        echo "<div class='oneResult'>";
                        echo "<p>Nom de l'offre: " . $oneResult["Nom_de_l_offre"] . "<p>";
                        echo "<p>Duree stage: " . $oneResult["DureeStage"] . "<p>";
                        echo "<p>Date: " . $oneResult["Date"] . "<p>";
                        echo "<p>Remuneration: " . $oneResult["Remuneration"] . "<p>";
                        echo "<p>NombrePlaceStage: " . $oneResult["NombrePlaceStage"] . "<p>";
                        echo "</div>";
                    }
                }
                ?>

            </div>
            <style>
                .oneResult {
                    background-color: lightblue;
                    margin-bottom: 10px;
                }

                .oneResult>p {
                    margin: 0px;
                }
            </style>
            <div class="footer">
                <ul class="sci">
                    <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i class="fab fa-youtube"></i></a></li>
                    <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                </ul>
            </div>
    </section>
</body>

</html>