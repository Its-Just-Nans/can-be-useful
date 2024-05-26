import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class SimpleFenetre extends JFrame {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private JTextField input;
	private JLabel output;

	public SimpleFenetre() {
		super();
		setTitle("Ma première fenêtre");
		setSize(600, 600);
		setLocationRelativeTo(null);
		setResizable(false);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		super.setLayout(new GridLayout(4, 1));
		// add components
		input = new JTextField();
		super.add(input);

		JLabel label = new JLabel("JAVA CELSIUS CONVERTER");
		super.add(label);
		JButton button = new JButton("Try");
		super.add(button);

		output = new JLabel();
		super.add(output);

		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String chaine = input.getText();
				double temp;
				if (!chaine.isEmpty()) {
					temp = Double.parseDouble(chaine);
				} else {
					input.setText("0");
					temp = 0;
				}
				Celsius tempCelsius = new Celsius(temp);
				Temperature tempFara = new Fahrenheit();
				tempFara = tempCelsius.toFahrenheit();
				double retourTemp = tempFara.getTemperature();
				String retour = Double.toString(retourTemp);
				output.setText(retour);
			}
		});
	}

	public static void main(String[] args) {
		SimpleFenetre fenetre = new SimpleFenetre();
		fenetre.setVisible(true);
	}
}