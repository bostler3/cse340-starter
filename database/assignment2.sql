-- Statement #1
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--
-- Statement #2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
--
-- Statement #3
DELETE FROM account
WHERE account_id = 1;
--
-- Statement #4
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'huge interior'
    )
WHERE inv_id = 10;
--
-- Statement #5
SELECT inv_make,
    inv_model
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
--
-- Statement #6 (got help from a Bing search for `postgresql replace one string in multiple columns`
-- because I didn't know if I needed two SET statements)
UPDATE inventory
SET inv_image = REPLACE(
        inv_image,
        'images',
        'images/vehicles'
    ),
    inv_thumbnail = REPLACE(
        inv_thumbnail,
        'images',
        'images/vehicles'
    );