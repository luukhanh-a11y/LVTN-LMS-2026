package com.LMS.LVTN;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@SpringBootTest
public class MigrateDB {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void migrateNguoiDungId() {
        System.out.println("Starting database migration for nguoi_dung_id to VARCHAR(36)...");

        try {
            // Find all foreign keys referencing nguoi_dung.nguoi_dung_id
            String findFkQuery = "SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME " +
                    "FROM information_schema.KEY_COLUMN_USAGE " +
                    "WHERE REFERENCED_TABLE_NAME = 'nguoi_dung' " +
                    "AND REFERENCED_COLUMN_NAME = 'nguoi_dung_id' " +
                    "AND TABLE_SCHEMA = 'lms'";

            List<Map<String, Object>> foreignKeys = jdbcTemplate.queryForList(findFkQuery);

            // 1. Drop foreign key constraints
            for (Map<String, Object> fk : foreignKeys) {
                String tableName = (String) fk.get("TABLE_NAME");
                String constraintName = (String) fk.get("CONSTRAINT_NAME");
                System.out.println("Dropping FK " + constraintName + " on " + tableName);
                jdbcTemplate.execute("ALTER TABLE " + tableName + " DROP FOREIGN KEY " + constraintName);
            }

            // 2. Alter column type in all referencing tables
            for (Map<String, Object> fk : foreignKeys) {
                String tableName = (String) fk.get("TABLE_NAME");
                String columnName = (String) fk.get("COLUMN_NAME");
                System.out.println("Altering column " + columnName + " on " + tableName + " to VARCHAR(36)");
                jdbcTemplate.execute("ALTER TABLE " + tableName + " MODIFY COLUMN " + columnName + " VARCHAR(36)");
            }

            // 3. Alter primary key column
            System.out.println("Altering primary key nguoi_dung_id on nguoi_dung to VARCHAR(36)");
            jdbcTemplate.execute("ALTER TABLE nguoi_dung MODIFY COLUMN nguoi_dung_id VARCHAR(36)");

            // 4. Re-add foreign key constraints
            for (Map<String, Object> fk : foreignKeys) {
                String tableName = (String) fk.get("TABLE_NAME");
                String columnName = (String) fk.get("COLUMN_NAME");
                String constraintName = (String) fk.get("CONSTRAINT_NAME");
                System.out.println("Re-adding FK " + constraintName + " on " + tableName);
                jdbcTemplate.execute("ALTER TABLE " + tableName + " ADD CONSTRAINT " + constraintName + 
                        " FOREIGN KEY (" + columnName + ") REFERENCES nguoi_dung(nguoi_dung_id)");
            }

            System.out.println("Migration completed successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Migration failed: " + e.getMessage());
        }
    }
}
