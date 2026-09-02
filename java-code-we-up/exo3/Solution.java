package exo3;

import java.util.Hashtable;
import java.util.Map.Entry;

public class Solution {

    // DO NOT REMOVE THIS !
    // Use System.err.println for debug
    public static void main(String[] args) {
        String a = "10";
        String b = "3 9 -12 14 9 -3 5 -19";
        String c = "-12 3 -1 -2 1";
        System.out.println(solution(a.split(" ")));
        System.out.println(solution(b.split(" ")));
        System.out.println(solution(c.split(" ")));
        // System.out.println(solution(args[0].split(" ")));
    }

    private static String solution(String[] numbers) {
        int maxVal = 0;
        int indexSTART = 0;
        int indexEND = 0;
        Hashtable<Integer, String> p = new Hashtable<Integer, String>();
        int len = numbers.length;
        for (int i = 0; i < len + 1; i++) {
            for (int o = i; o < len + 1; o++) {
                int max = 0;
                for (int q = i; q < o; q++) {
                    int parse = Integer.parseInt(numbers[q]);
                    max += parse;
                }
                p.put(max, String.valueOf(i + 1) + " " + String.valueOf(o));
            }
        }
        int max = 0;
        for (Entry<Integer, String> e : p.entrySet()) {
            String a = (String) e.getValue();
            maxVal = (Integer) e.getKey();
            if (maxVal > max) {
                max = maxVal;
                indexSTART = Integer.parseInt(a.split(" ")[0]);
                indexEND = Integer.parseInt(a.split(" ")[1]);
            }
        }
        return String.valueOf(max) + " " + String.valueOf(indexSTART) + " " + String.valueOf(indexEND);
    }
}
