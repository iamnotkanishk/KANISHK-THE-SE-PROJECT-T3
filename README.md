# PWA-YR-12-Software
Kanishk Prashanth's PWA

TO ACCESS ADMIN PANEL:

Make an account named 'admin' and then paste this into terminal. 

cd /workspaces/SCHOOL-MUSICAL-BOOKING-SYSTEM-PWA/myPWA/server
sqlite3 database.sqlite "UPDATE users SET role='admin' WHERE username='admin'; SELECT id, username, role FROM users WHERE username='admin';"

Now you have an admin account and can access the admin.html file and the other admin specific functions!
