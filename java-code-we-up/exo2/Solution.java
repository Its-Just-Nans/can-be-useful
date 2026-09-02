package exo2;

import java.util.Hashtable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map.Entry;

public class Solution {

    // DO NOT REMOVE THIS !
    // Use System.err.println for debug
    public static void main(String[] args) {
        String g = "thanks";
        String t = "java,novelis,lovenis,venolis,avaj,vaja,sivolen,nislove,lisnove";
        String t2 = "north,fresher,refresh,thorn,bye,thron";
        System.out.println(solution(g.split(",")));
        System.out.println(solution(t.split(",")));
        System.out.println(solution(t2.split(",")));
        // System.out.println(solution(args[0].split(",")));
    }

    private static int solution(String[] words) {
        HashSet<String> mySet = new HashSet<String>();
        Hashtable<String, Integer> p = new Hashtable<String, Integer>();
        for (String str : words) {
            char charArray[] = str.toCharArray();
            Arrays.sort(charArray);
            String a = new String(charArray);
            mySet.add(a);
            if (p.get(a) == null) {
                p.put(a, 1);
            } else {
                Integer co = p.get(a);
                p.put(a, co + 1);
            }
        }
        int count = 0;
        for (Entry<String, Integer> e : p.entrySet()) {
            Integer a = (Integer) e.getValue();
            if (a > count) {
                count = a;
            }
        }
        return count;
    }
}