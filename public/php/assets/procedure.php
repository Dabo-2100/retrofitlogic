<?php
$Content = `
-- Add the new columns
ALTER TABLE project_tasks
ADD COLUMN level_1 INT,
ADD COLUMN level_2 INT,
ADD COLUMN level_3 INT;

-- Create the procedure
DELIMITER //

CREATE PROCEDURE SplitTaskName(condition VARCHAR(255))
BEGIN
    DECLARE taskName VARCHAR(255);
    DECLARE l1 INT;
    DECLARE l2 INT;
    DECLARE l3 INT;
    DECLARE dot1 INT;
    DECLARE dot2 INT;

    DECLARE done INT DEFAULT FALSE;

    DECLARE cur CURSOR FOR 
    SELECT task_name FROM project_tasks WHERE FIND_IN_SET(condition, task_name);

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO taskName;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Initialize variables
        SET l1 = NULL;
        SET l2 = NULL;
        SET l3 = NULL;
        SET dot1 = LOCATE('.', taskName);
        SET dot2 = LOCATE('.', taskName, dot1 + 1);

        IF dot1 > 0 THEN
            SET l1 = CAST(SUBSTRING(taskName, 1, dot1 - 1) AS UNSIGNED);
            IF dot2 > 0 THEN
                SET l2 = CAST(SUBSTRING(taskName, dot1 + 1, dot2 - dot1 - 1) AS UNSIGNED);
                SET l3 = CAST(SUBSTRING(taskName, dot2 + 1) AS UNSIGNED);
            ELSE
                SET l2 = CAST(SUBSTRING(taskName, dot1 + 1) AS UNSIGNED);
            END IF;
        ELSE
            SET l1 = CAST(taskName AS UNSIGNED);
        END IF;

        SET @sql = CONCAT('UPDATE project_tasks SET level_1 = ', l1, ', level_2 = ', l2, ', level_3 = ', l3, ' WHERE task_name = "', taskName, '" AND ', condition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END //

DELIMITER ;

-- Call the procedure with a condition
CALL SplitTaskName('some_column = ''some_value''');`;
