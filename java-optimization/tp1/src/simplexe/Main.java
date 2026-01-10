package simplexe;

import java.io.File;
import java.nio.file.Paths;
import java.io.IOException;

/**
 * Contient la methode main
 */
public class Main {
	public static void main(String[] arg) throws IOException {
		Simplexe simplexe = new Simplexe();
		Scenario scenario = new Scenario(simplexe);
		simplexe.vue = scenario;
		simplexe.controleur = scenario.controleur;
		// int max = 20;
		// int sleepTime = 1000;
		// for (int i = 1; i < max; i++) {
		// simplexe.sortie.println("-----------------------------------------");
		// String nomFichier = "pb" + i + ".txt";
		// String pathFile = Paths.get(System.getenv("PATH_TO_PBS"),
		// nomFichier).toString();
		// File file = new File(pathFile);
		// simplexe.choixDico(file);
		// simplexe.run();
		// simplexe.run();
		// try {
		// Thread.sleep(sleepTime);
		// } catch (Exception exc) {
		// exc.printStackTrace();
		// }
		// }
	}
}
