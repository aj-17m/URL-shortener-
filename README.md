# URL-shortener-

1. Setup MySQL Database
   Open MySQL Command Line or MySQL Workbench.

   Create a Database:
   CREATE DATABASE shorturls;
    Switch to the Database:

   USE shorturls;
   Create the links Table:

    CREATE TABLE links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    longurl TEXT NOT NULL,
    shorturl VARCHAR(255) UNIQUE NOT NULL,
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL
);

2. ........ Install All de endencies

