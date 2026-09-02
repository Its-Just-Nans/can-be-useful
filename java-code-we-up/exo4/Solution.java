package exo4;

import java.util.ArrayList;

public class Solution {

    // DO NOT REMOVE THIS !
    // Use System.err.println for debug
    public static void main(String[] args) {
        String a = "(2 (6 (7)) (3) (5 (1) (4)) (8))";
        System.out.println(solution(a));
        // System.out.println(solution(args[0]));
    }

    static class Node {
        int data;
        ArrayList<Node> list;
        Node parent;
    };

    /* Helper function that allocates a new node */
    static Node newNode(int data, Node parent) {
        Node node = new Node();
        node.data = data;
        node.list = new ArrayList<Node>();
        node.parent = parent;
        return node;
    }

    // function to construct tree from String
    static Node treeFromString(String str, Node parent) {
        // new root
        int val;
        if (str.indexOf("(") < 0) {
            val = Integer.parseInt(str);
        } else {
            val = Integer.parseInt(str.substring(0, str.indexOf("(")));
        }
        Node root = newNode(val, parent);
        String strWithoutVal;
        if (str.indexOf("(") < 0) {
            strWithoutVal = str;
        } else {
            strWithoutVal = str.substring(str.indexOf("("), str.length());
        }
        ArrayList<String> toto = strToTable(strWithoutVal);
        for (String oneString : toto) {
            Node temp = treeFromString(oneString, root);
            root.list.add(temp);
        }
        return root;
    }

    static ArrayList<String> strToTable(String str) {
        String[] splitted = str.split("");
        ArrayList<String> finalTable = new ArrayList<String>();
        int depthCount = 0;
        String toAdd = "";
        for (String oneChar : splitted) {
            if (oneChar.equals("(")) {
                if (depthCount > 0) {
                    toAdd += oneChar;
                }
                depthCount++;
            } else if (oneChar.equals(")")) {
                depthCount--;
                if (depthCount > 0) {
                    toAdd += oneChar;
                }
            } else {
                // a number
                toAdd += oneChar;
                continue;
            }
            if (depthCount == 0) {
                finalTable.add(toAdd);
                toAdd = "";
                depthCount = 0;
            }
        }
        return finalTable;
    }

    static Node findLowest(Node rootNode) {
        if (rootNode.list.size() > 0) {
            Node toReturn = null;
            for (Node oneNode : rootNode.list) {
                Node lowest = findLowest(oneNode);
                if (lowest == null) {
                    lowest = oneNode;
                }
                if (toReturn == null) {
                    toReturn = lowest;
                } else if (toReturn.data > lowest.data) {
                    toReturn = lowest;
                }
            }
            return toReturn;
        }
        return rootNode;
    }

    static String doMimi(Node rootNode) {
        String finalStr = "";
        while (rootNode != null) {
            if (rootNode != null) {
                Node temp = findLowest(rootNode);
                if (temp != null) {
                    if (temp.parent != null) {
                        finalStr += String.valueOf(temp.parent.data);
                        finalStr += " ";
                        temp.parent.list.remove(temp); // delete the lowest
                    } else {
                        rootNode = null;
                    }
                }
            }
        }
        return finalStr;
    }

    private static String solution(String input) {
        System.out.println(input);
        String clean = input;
        clean = clean.replaceAll(" ", "");
        clean = clean.substring(1);
        clean = clean.substring(0, clean.length() - 1);
        Node root = treeFromString(clean, null);
        return doMimi(root);
    }
}