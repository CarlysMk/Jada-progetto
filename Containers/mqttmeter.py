
'''
CREATE TABLE meter_data (
id INT AUTO_INCREMENT PRIMARY KEY,
data_insert timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
univoco VARCHAR(100),
sentOn BIGINT,
Lifetimer BIGINT,
220_U1N_Phase DOUBLE,
222_U2N_Phase DOUBLE,
224_U3N_Phase DOUBLE,
226_U12_Phase DOUBLE,
228_U23_Phase DOUBLE,
230_U31_Phase DOUBLE,
232_L1_Phase DOUBLE,
234_L2_Phase DOUBLE,
236_L3_Phase DOUBLE,
240_P1_ActivePower DOUBLE,
242_P2_ActivePower DOUBLE,
244_P3_ActivePower DOUBLE,
246_Q1_PRP DOUBLE,
248_Q2_PRP DOUBLE,
250_Q3_PRP DOUBLE,
276_TotActPower DOUBLE,
496_Ea_TotImpAct DOUBLE,
560_Ea_L1 DOUBLE,
564_Ea_L2 DOUBLE,
568_Ea_L3 DOUBLE,
data_ricezione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
'''


'''
mysql> describe meter_data;
+--------------------+--------------+------+-----+-------------------+-------------------+
| Field              | Type         | Null | Key | Default           | Extra             |
+--------------------+--------------+------+-----+-------------------+-------------------+
| id                 | int          | NO   | PRI | NULL              | auto_increment    |
| data_insert        | timestamp    | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| univoco            | varchar(100) | YES  |     | NULL              |                   |
| sentOn             | bigint       | YES  |     | NULL              |                   |
| Lifetimer          | bigint       | YES  |     | NULL              |                   |
| 220_U1N_Phase      | double       | YES  |     | NULL              |                   |
| 222_U2N_Phase      | double       | YES  |     | NULL              |                   |
| 224_U3N_Phase      | double       | YES  |     | NULL              |                   |
| 226_U12_Phase      | double       | YES  |     | NULL              |                   |
| 228_U23_Phase      | double       | YES  |     | NULL              |                   |
| 230_U31_Phase      | double       | YES  |     | NULL              |                   |
| 232_L1_Phase       | double       | YES  |     | NULL              |                   |
| 234_L2_Phase       | double       | YES  |     | NULL              |                   |
| 236_L3_Phase       | double       | YES  |     | NULL              |                   |
| 240_P1_ActivePower | double       | YES  |     | NULL              |                   |
| 242_P2_ActivePower | double       | YES  |     | NULL              |                   |
| 244_P3_ActivePower | double       | YES  |     | NULL              |                   |
| 246_Q1_PRP         | double       | YES  |     | NULL              |                   |
| 248_Q2_PRP         | double       | YES  |     | NULL              |                   |
| 250_Q3_PRP         | double       | YES  |     | NULL              |                   |
| 276_TotActPower    | double       | YES  |     | NULL              |                   |
| 496_Ea_TotImpAct   | double       | YES  |     | NULL              |                   |
| 560_Ea_L1          | double       | YES  |     | NULL              |                   |
| 564_Ea_L2          | double       | YES  |     | NULL              |                   |
| 568_Ea_L3          | double       | YES  |     | NULL              |                   |
| data_ricezione     | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+--------------------+--------------+------+-----+-------------------+-------------------+
'''


'''
Lifetimer
220_U1N_Phase
222_U2N_Phase
224_U3N_Phase
226_U12_Phase
228_U23_Phase
230_U31_Phase
232_L1_Phase
234_L2_Phase
236_L3_Phase
240_P1_ActivePower
242_P2_ActivePower
244_P3_ActivePower
246_Q1_PRP
248_Q2_PRP
250_Q3_PRP
276_TotActPower
496_Ea_TotImpAct
560_Ea_L1
564_Ea_L2
568_Ea_L3
'''


import json
import paho.mqtt.client as mqtt
import mysql.connector
from mysql.connector import Error

# Configurazione
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'qwe123',
    'database': 'stage'
}

MQTT_BROKER = "localhost"
#MQTT_TOPIC = "/home/meter/21"
MQTT_TOPIC = "#"


def save_to_mysql(payload_json):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            cursor = conn.cursor()

            # Estrazione dati dal JSON nidificato
            univoco = payload_json.get("univoco")
            sent_on = payload_json.get("sentOn")
            metrics = payload_json.get("metrics", {})

            data_values = (
                univoco,
                sent_on,
                metrics.get("00Lifetimer"),
                metrics.get("01220"),
                metrics.get("02222"),
                metrics.get("03224"),
                metrics.get("04226"),
                metrics.get("05228"),
                metrics.get("06230"),
                metrics.get("07232"),
                metrics.get("08234"),
                metrics.get("09236"),
                metrics.get("10240"),
                metrics.get("11242"),
                metrics.get("12244"),
                metrics.get("13246"),
                metrics.get("14248"),
                metrics.get("15250"),
                metrics.get("16276"),
                metrics.get("17496"),
                metrics.get("18560"),
                metrics.get("19564"),
                metrics.get("20568")
            )


            sql = """INSERT INTO meter_data (univoco, sentOn,
                     Lifetimer,220_U1N_Phase,222_U2N_Phase,224_U3N_Phase,226_U12_Phase,228_U23_Phase,230_U31_Phase,232_L1_Phase,234_L2_Phase,236_L3_Phase,
                     240_P1_ActivePower,242_P2_ActivePower,244_P3_ActivePower,246_Q1_PRP,248_Q2_PRP,250_Q3_PRP,276_TotActPower,496_Ea_TotImpAct,560_Ea_L1,
                     564_Ea_L2,568_Ea_L3) 
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s)"""

            cursor.execute(sql, data_values)
            conn.commit()
            print(f"Dati inseriti correttamente per ID: {univoco}")

    except Error as e:
        print(f"Errore Database: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        save_to_mysql(data)
    except Exception as e:
        print(f"Errore nel parsing del messaggio: {e}")

def on_connect(client, userdata, flags, rc):
    print(f"Connesso con codice {rc}. In attesa di messaggi...")
    client.subscribe(MQTT_TOPIC)

# Avvio Client MQTT
try:
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
    client.on_connect = on_connect
    client.on_message = on_message
    client.username_pw_set(username='meter_user1', password='fsdgrg33ds34f3')
    print("Connecting to mqtt broker ...")
    client.connect(MQTT_BROKER, 1885, 60)
    client.loop_forever()
except KeyboardInterrupt:
    print("Chiusura in corso...")

