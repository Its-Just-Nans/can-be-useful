public class Fahrenheit extends Temperature {
	public Fahrenheit() {
		super();
	}

	public Fahrenheit(double valeur) {
		super(valeur);
	}

	public Celsius toCelsius() {
		double temp = this.getTemperature();
		return new Celsius((temp - 32) * 5 / 9);
	}

	public Fahrenheit toFahrenheit() {
		return this;
	}

	@Override
	public void affiche() {
		System.out.println("Temeprature : " + super.getTemperature() + " en Fahrenheit");
	}
}