<?php
require_once __DIR__ . '/../config/db.php';

echo "Starting Doctors & Smart Pricing Migration (MySQL)...\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Create doctors table
    echo "Creating doctors table...\n";
    $conn->exec("
        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            specialty VARCHAR(255),
            city VARCHAR(100),
            phone VARCHAR(20),
            email VARCHAR(255),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    // Index creation slightly different or implicitly handled if exists check is tricky in one line
    // MySQL supports CREATE INDEX (without IF NOT EXISTS in older versions, but 8.0 supports it? No, standard SQL doesn't often have it)
    // We can skip index if likely exists or use a procedure.
    // For now, let's wrap in try-catch to ignore "Duplicate key" error.
    try {
        $conn->exec("CREATE INDEX idx_doctors_active ON doctors(is_active);");
    } catch (Exception $e) { /* ignore if exists */
    }

    echo "Doctors table created/verified.\n";

    // 2. Add columns to contact_submissions
    // Need to ensure contact_submissions exists first.
    // Using user prompt schema for contact_submissions creation if not exists
    $conn->exec("
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            message TEXT,
            read_status BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $columnsToAdd = [
        'home_service' => 'BOOLEAN DEFAULT FALSE',
        'address' => 'TEXT',
        'pregnancy_week' => 'INT',
        'has_doctor' => 'BOOLEAN DEFAULT FALSE',
        'doctor_id' => 'INT',
        'doctor_name' => 'VARCHAR(255)',
        'pricing_tier' => 'VARCHAR(50) DEFAULT "direct"'
    ];

    // Check existing columns
    // In MySQL: SHOW COLUMNS FROM contact_submissions
    $stmt = $conn->query("SHOW COLUMNS FROM contact_submissions");
    $existingColumns = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $existingColumns[] = $row['Field'];
    }

    foreach ($columnsToAdd as $colName => $colDef) {
        if (!in_array($colName, $existingColumns)) {
            echo "Adding column $colName...\n";
            try {
                $conn->exec("ALTER TABLE contact_submissions ADD COLUMN $colName $colDef");
                echo "Added $colName.\n";
            } catch (Exception $e) {
                echo "Error adding $colName: " . $e->getMessage() . "\n";
            }
        } else {
            echo "Column $colName already exists.\n";
        }
    }

    // Foreign Key (careful if constraint exists, simpler to just add column for now)
    // $conn->exec("ALTER TABLE contact_submissions ADD CONSTRAINT fk_contact_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL");

    echo "Migration completed successfully.\n";

} catch (Exception $e) {
    die("Migration Failed: " . $e->getMessage() . "\n");
}
