public class Celsius extends Temperature {
	public Celsius() {
		super();
	}

	public Celsius(double valeur) {
		super(valeur);
	}

	public Fahrenheit toFahrenheit() {
		double temp = this.getTemperature();
		return new Fahrenheit(temp * 9 / 5 + 32);
	}

	public Celsius toCelsius() {
		return this;
	}

	@Override
	public void affiche() {
		System.out.println("Temeprature : " + super.getTemperature() + " en Celsius");
	}
}