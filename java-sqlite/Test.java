import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Test {
    private static final String TABLE_NAME = "DATA";

    public static void main(String[] args) {
        Connection c = null;
        File file = null;
        try {
            c = connect();
            createTable(c);
            file = new File("list.txt");
            int i = 0;
            try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                String line;
                while ((line = br.readLine()) != null) {
                    insertFile(c, i++, line);
                }
            }
        } catch (FileNotFoundException e) {
            // TODO
        } catch (IOException e) {
            // TODO
        } finally {
            if (c != null) {
                close(c);
            }
            // if (file != null) {
            // file.close();
            // }
        }
    }

    public static void insertFile(Connection c, int number, String line) {
        try {
            Statement stmt = null;
            stmt = c.createStatement();
            if (line.split("#").length < 4) {
                return;
            }
            String entree = line.split("#")[0].replace("'", " ");
            String nom_entree = line.split("#")[1].replace("'", " ");
            String sortie = line.split("#")[2].replace("'", " ");
            String nom_sortie = line.split("#")[3].replace("'", " ");
            String prix = line.split("#")[4];
            String sql = "INSERT INTO " + TABLE_NAME + " (ID,ENTREE,NOM_ENTREE,SORTIE,NOM_SORTIE,PRIX) " +
                    "VALUES (" + number + ",'" + entree + "','" + nom_entree + "','" + sortie + "','" + nom_sortie
                    + "','" + prix + "');";

            System.out.println(number);
            // System.out.println(sql);
            stmt.executeUpdate(sql);
            stmt.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    public static Connection connect() {
        Connection conn = null;
        try {
            String url = "jdbc:sqlite:test.db";
            conn = DriverManager.getConnection(url);
            System.out.println("Connection to SQLite has been established.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return conn;
    }

    public static void close(Connection c) {
        try {
            c.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    public static void createTable(Connection c) {
        try {
            Statement stmt = null;
            stmt = c.createStatement();
            String sql = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " " +
                    "(ID INTEGER PRIMARY KEY NOT NULL," +
                    " ENTREE        TEXT NOT NULL," +
                    " NOM_ENTREE    TEXT NOT NULL," +
                    " SORTIE        TEXT NOT NULL," +
                    " NOM_SORTIE    TEXT NOT NULL," +
                    " PRIX          REAL)";
            stmt.executeUpdate(sql);
            stmt.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
}