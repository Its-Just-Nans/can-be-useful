/*
	Stocker une temperature
*/

public class TestTemperature {
	public static void main(String[] args) {
		System.out.println("Test en cours");
		Celsius c;
		Fahrenheit f;
		// On crée une biblio
		c = new Celsius();
		f = new Fahrenheit();

		c.affiche();
		f.affiche();

		f.setTemperature(17);
		f.affiche();

		c.setTemperature(17);
		c.affiche();
	}
}