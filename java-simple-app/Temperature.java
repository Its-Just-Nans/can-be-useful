/*
	Stocker une temperature
*/

public abstract class Temperature {
	private double valeur;

	public void affiche() {
		System.out.println("Temeprature :" + valeur + " échelle inconnue");
	}

	public double getTemperature() {
		return valeur;
	}

	public void setTemperature(double newValue) {
		valeur = newValue;
	}

	public Temperature() {
		valeur = 0;
	}

	public Temperature(double InitialValue) {
		valeur = InitialValue;
	}

	public abstract Celsius toCelsius();

	public abstract Fahrenheit toFahrenheit();

}