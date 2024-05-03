INSERT INTO account(account_firstname, account_lastname, account_email, account_password) 
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
	SET account_type = 'Admin'
	WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1;

UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') 
WHERE inv_model = 'Hummer';

SELECT inv_make AS make, inv_model AS model FROM inventory AS i
JOIN classification AS c 
    ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';

UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');
