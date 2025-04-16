# Disaster Alert System (Flask + MySQL)

from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector
from datetime import datetime
import requests

app = Flask(__name__)
app.secret_key = 'sdfd8saf5a58dfzz57d2zdf5sff5asf5s8dffhgkj2kg5k2y6tm456k06'

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Ranadatabase@2006",
    database="college"
)
cursor = conn.cursor(dictionary=True)

# Get location using IP (for demo)
def get_location():
    try:
        response = requests.get("http://ip-api.com/json/").json()
        return response['city'], response['regionName'], response['country']
    except:
        return "Unknown", "Unknown", "Unknown"

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        pinCode = request.form['pinCode']
        role = request.form['role']
        auto_district, auto_state, auto_country = get_location()
        manual_district = request.form.get('manual_district') or auto_district
        manual_state = request.form.get('manual_state') or auto_state
        manual_country = request.form.get('manual_country') or auto_country
        cursor.execute("INSERT INTO users (name, email, phone, password,pinCode, role, district, state, country) VALUES (%s, %s, %s,%s, %s, %s, %s, %s, %s)",
                       (name, email, phone, password,pinCode, role, manual_district, manual_state, manual_country))
        conn.commit()
        flash("Registered successfully. Please login.", "success")
        return redirect(url_for('index'))
    return render_template('register.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()
    if user:
        session['user'] = user
        if user['role'] == 'public':
            return redirect(url_for('dashboard_public'))
        elif user['role'] == 'authority':
            return redirect(url_for('dashboard_authority'))
        elif user['role'] == 'admin':
            return redirect(url_for('dashboard_admin'))
    flash("Invalid credentials", "danger")
    return redirect(url_for('index'))

@app.route('/dashboard/public')
def dashboard_public():
    user = session.get('user')
    if not user or user['role'] != 'public':
        return redirect(url_for('index'))
    cursor.execute("SELECT * FROM alerts WHERE district = %s AND status = 'approved'", (user['district'],))
    alerts = cursor.fetchall()
    return render_template('dashboard_public.html', user=user, alerts=alerts)

@app.route('/report_disaster', methods=['POST'])
def report_disaster():
    user = session.get('user')
    if not user or user['role'] != 'public':
        return redirect(url_for('index'))
    disaster_type = request.form['type']
    description = request.form['description']
    manual_district = request.form.get('manual_district') or user['district']
    manual_state = request.form.get('manual_state') or user['state']
    now = datetime.now()
    cursor.execute("INSERT INTO alerts (type, description, status, reported_by, district, state, time) VALUES (%s, %s, 'pending', %s, %s, %s, %s)",
                   (disaster_type, description, user['id'], manual_district, manual_state, now))
    conn.commit()
    flash("Disaster reported. Awaiting authority approval.", "info")
    return redirect(url_for('dashboard_public'))

@app.route('/dashboard/authority')
def dashboard_authority():
    user = session.get('user')
    if not user or user['role'] != 'authority':
        return redirect(url_for('index'))
    cursor.execute("SELECT * FROM alerts WHERE status = 'pending' AND district = %s", (user['district'],))
    pending_alerts = cursor.fetchall()
    cursor.execute("SELECT * FROM shelters WHERE district = %s", (user['district'],))
    shelters = cursor.fetchall()
    cursor.execute("SELECT * FROM rescues WHERE district = %s", (user['district'],))
    rescues = cursor.fetchall()
    return render_template('dashboard_authority.html', user=user, pending_alerts=pending_alerts, shelters=shelters, rescues=rescues)

@app.route('/approve_alert/<int:alert_id>')
def approve_alert(alert_id):
    user = session.get('user')
    if not user or user['role'] != 'authority':
        return redirect(url_for('index'))
    cursor.execute("UPDATE alerts SET status = 'approved', approved_by = %s WHERE id = %s", (user['name'], alert_id))
    conn.commit()
    flash("Alert approved and public notified.", "success")
    return redirect(url_for('dashboard_authority'))

@app.route('/delete_alert/<int:alert_id>')
def delete_alert(alert_id):
    user = session.get('user')
    if not user or user['role'] not in ['admin', 'authority']:
        return redirect(url_for('index'))
    cursor.execute("DELETE FROM alerts WHERE id = %s", (alert_id,))
    conn.commit()
    flash("Alert deleted.", "info")
    return redirect(url_for('dashboard_' + user['role']))

@app.route('/add_shelter', methods=['POST'])
def add_shelter():
    user = session.get('user')
    if not user or user['role'] != 'authority':
        return redirect(url_for('index'))
    name = request.form['name']
    seats = request.form['seats']
    food = request.form['food']
    aid = request.form['aid']
    cursor.execute("INSERT INTO shelters (name, district, seats, food, aid) VALUES (%s, %s, %s, %s, %s)",
                   (name, user['district'], seats, food, aid))
    conn.commit()
    flash("Shelter added successfully.", "success")
    return redirect(url_for('dashboard_authority'))

@app.route('/request_rescue', methods=['POST'])
def request_rescue():
    user = session.get('user')
    if not user or user['role'] != 'public':
        return redirect(url_for('index'))
    location = request.form['location']
    description = request.form['description']
    cursor.execute("INSERT INTO rescues (requested_by, district, location, description, time) VALUES (%s, %s, %s, %s, %s)",
                   (user['id'], user['district'], location, description, datetime.now()))
    conn.commit()
    flash("Rescue request sent.", "info")
    return redirect(url_for('dashboard_public'))

# @app.route('/dashboard/admin')
# def dashboard_admin():
#     user = session.get('user')
#     if not user or user['role'] != 'admin':
#         return redirect(url_for('index'))
#     cursor.execute("SELECT * FROM users")
#     users = cursor.fetchall()
#     cursor.execute("SELECT * FROM alerts")
#     alerts = cursor.fetchall()
#     return render_template('dashboard_admin.html', user=user, users=users, alerts=alerts)






@app.route('/dashboard/admin')
def dashboard_admin():
    user = session.get('user')
    if not user or user['role'] != 'admin':
        return redirect(url_for('index'))
    
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()

    cursor.execute("SELECT * FROM alerts")
    alerts = cursor.fetchall()

    cursor.execute("SELECT DISTINCT state FROM users")
    states = [row['state'] for row in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT district FROM users")
    districts = [row['district'] for row in cursor.fetchall()]

    return render_template('dashboard_admin.html', user=user, users=users, alerts=alerts, states=states, districts=districts)






@app.route('/logout')
def logout():
    session.clear()
    flash("Logged out successfully.", "info")
    return redirect(url_for('index'))



@app.route('/add_alert', methods=['POST'])
def add_alert():
    user = session.get('user')
    if not user or user['role'] != 'authority':
        return redirect(url_for('index'))
    
    disaster_type = request.form['type']
    description = request.form['description']
    district = request.form.get('district') or user['district']
    state = request.form.get('state') or user['state']
    now = datetime.now()
    
    cursor.execute("INSERT INTO alerts (type, description, status, reported_by, district, state, time, approved_by) VALUES (%s, %s, 'approved', %s, %s, %s, %s, %s)",
                   (disaster_type, description, user['id'], district, state, now, user['name']))
    conn.commit()
    flash("Disaster alert added and public notified.", "success")
    return redirect(url_for('dashboard_authority'))








@app.route('/admin_add_alert', methods=['POST'])
def admin_add_alert():
    user = session.get('user')
    if not user or user['role'] != 'admin':
        return redirect(url_for('index'))

    disaster_type = request.form['type']
    description = request.form['description']
    district = request.form.get('district')
    state = request.form.get('state')
    broadcast = request.form.get('broadcast') == 'on'
    now = datetime.now()

    if broadcast:
        # Send to all districts
        cursor.execute("SELECT DISTINCT district, state FROM users WHERE role = 'public'")
        locations = cursor.fetchall()
        for loc in locations:
            cursor.execute("INSERT INTO alerts (type, description, status, reported_by, district, state, time, approved_by) VALUES (%s, %s, 'approved', %s, %s, %s, %s, %s)",
                           (disaster_type, description, user['id'], loc['district'], loc['state'], now, user['name']))
    else:
        cursor.execute("INSERT INTO alerts (type, description, status, reported_by, district, state, time, approved_by) VALUES (%s, %s, 'approved', %s, %s, %s, %s, %s)",
                       (disaster_type, description, user['id'], district, state, now, user['name']))
    
    conn.commit()
    flash("Alert added and public notified.", "success")
    return redirect(url_for('dashboard_admin'))










if __name__ == '__main__':
    app.run(debug=True)