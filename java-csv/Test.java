package test;

import java.util.*;
// Pour deboguer votre code
// System.err.println("deboguer");

public class Test {

    // NE PAS ENLEVER CECI !
    public static void main(String[] args) {
        String cellule = "R53C17602";
        System.out.println(ExcelSolution("R1C1")); // A1
        System.out.println(ExcelSolution("R299999999C26")); // Z299999999
        System.out.println(ExcelSolution("R53C17602"));// YZZ53
        System.out.println(ExcelSolution("R26501C24")); // X26501
        System.out.println(ExcelSolution("R42C21")); // U42

    }

    private static String getCharForNumber(int i) {
        return i > 0 && i < 27 ? String.valueOf((char) (i + 64)) : "";
    }

    public static String IndexToColumn(int index) {
        final int ColumnBase = 26;
        final int DigitMax = 7; // ceil(log26(Int32.Max))
        final String Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (index <= 0) {
            throw "";
        }

        if (index <= ColumnBase)
            return Digits[index - 1].ToString();

        var sb = new StringBuilder().append(' ', DigitMax);
        var current = index;
        var offset = DigitMax;
        while (current > 0) {
            sb[--offset] = Digits[--current % ColumnBase];
            current /= ColumnBase;
        }
        return sb.toString(offset, DigitMax - offset);
    }

    private static String ExcelSolution(String input) {
        String[] parts = input.split("C");
        String ligne = parts[0].substring(1);
        int col = Integer.parseInt(parts[1]);
        int reste = col % 26;
        int quotient = col / 26;
        String pok = quotient == 0 ? "" : "Z".repeat(quotient);
        String str = pok + getCharForNumber(reste) + ligne;
        return str;
    }

}