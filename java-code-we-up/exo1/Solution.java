package exo1;

public class Solution {

  // DO NOT REMOVE THIS !
  // Use System.err.println for debug
  public static void main(String[] args) {
    System.out.println(solution(args[0]));
  }

  private static Boolean solution(String input) {
    String str1 = (new StringBuilder()).append(input.split("\\+")[0]).reverse().toString();
    int number1 = Integer.parseInt(str1);
    String str2 = (new StringBuilder()).append(input.split("\\+")[1].split("=")[0]).reverse().toString();
    int number2 = Integer.parseInt(str2);

    String str3 = (new StringBuilder()).append(input.split("=")[1]).reverse().toString();
    int number3 = Integer.parseInt(str3);

    if (number1 + number2 == number3) {
      return true;
    }

    return false;
  }
}