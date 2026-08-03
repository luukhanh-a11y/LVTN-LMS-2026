package com.LMS.LVTN;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DumpDB {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/lms?serverTimezone=UTC", "root", "");
            PreparedStatement stmt = conn.prepareStatement("SELECT id, loai, du_lieu_game, dap_an_chuan FROM dang_bai WHERE loai IN ('DIEN_KHUYET', 'TRAC_NGHIEM', 'NOI_CAP')");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id"));
                System.out.println("LOAI: " + rs.getString("loai"));
                System.out.println("DU_LIEU_GAME: " + rs.getString("du_lieu_game"));
                System.out.println("DAP_AN_CHUAN: " + rs.getString("dap_an_chuan"));
                System.out.println("--------------------------------------------------");
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
