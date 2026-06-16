import random
import pymysql
import mysql.connector
import mysql
import sys
import yaml
import os
import time
from time import mktime
from datetime import datetime as t
import datetime
import threading
import json
import subprocess
import logging
from datetime import datetime
import paho
import paho.mqtt.client as mqtt
from subprocess import STDOUT, check_output
from dateutil import tz



def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connesso!")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

def genera_numero_casuale(minimo, massimo):
    try:
        if minimo > massimo:
            print("Errore: il limite inferiore non può essere maggiore di quello superiore!")
        else:
            numero = random.randint(minimo, massimo)
            return numero

    except ValueError:
        print("Inserire solo numeri interi.")

#from_zone = tz.gettz('UTC')
#to_zone = tz.gettz('Europe/Rome')
#utc = t.now()
#utc = utc.replace(tzinfo=from_zone)
#italytime = utc.astimezone(to_zone)
italytime =  t.now()
#print("utc  time = " ,utc)
#print("italy time = " ,italytime)
today = italytime.today().strftime('%Y-%m-%d')
ora_lettura = str(italytime.strftime("%H:%M:%S"))
adesso_par = str(today) + " " + ora_lettura
#print("today = ",today)
#print("ora_lettura = " ,ora_lettura)
#print("adesso_par = ",adesso_par)

univoco = italytime.strftime("%Y%m%d%H%M%S")
univocomodbus = "TCP_21_"+ univoco

unix_time = time.time()
int_unix_time = int(unix_time)

_496EaTotImpAct = 31721
_560EaL1 = 10335
_564EaL2 = 10339
_568EaL3 = 10332

_496EaTotImpAct = _496EaTotImpAct + genera_numero_casuale(150,1500)

_560EaL1 = _560EaL1  + genera_numero_casuale(10,250)

_564EaL2 = _564EaL2 +  genera_numero_casuale(10,250)

_568EaL3 = _568EaL3 +  genera_numero_casuale(10,250)

mqtt_message =  {
    "univoco": univocomodbus,
    "sentOn": int_unix_time,
    "metrics": {
        "00Lifetimer_timestamp": int_unix_time,
        "00Lifetimer": int_unix_time,
        "01220_timestamp": int_unix_time,
        "01220": genera_numero_casuale(233,235),
        "02222_timestamp": int_unix_time,
        "02222": genera_numero_casuale(233,235),
        "03224_timestamp": int_unix_time,
        "03224": genera_numero_casuale(233,235),
        "04226_timestamp": int_unix_time,
        "04226": genera_numero_casuale(403,407),
        "05228_timestamp": int_unix_time,
        "05228": genera_numero_casuale(403,407),
        "06230_timestamp": int_unix_time,
        "06230": genera_numero_casuale(403,407),
        "07232_timestamp": int_unix_time,
        "07232": genera_numero_casuale(40,43),
        "08234_timestamp": int_unix_time,
        "08234": genera_numero_casuale(44,46),
        "09236_timestamp": int_unix_time,
        "09236": genera_numero_casuale(47,49),
        "10240_timestamp": int_unix_time,
        "10240": genera_numero_casuale(1700,5900),
        "11242_timestamp": int_unix_time,
        "11242": genera_numero_casuale(1700,5900),
        "12244_timestamp": int_unix_time,
        "12244": genera_numero_casuale(1700,5900),
        "13246_timestamp": int_unix_time,
        "13246":  genera_numero_casuale(4500,9500),
        "14248_timestamp": int_unix_time,
        "14248":  genera_numero_casuale(1700,5900),
        "15250_timestamp": int_unix_time,
        "15250":  genera_numero_casuale(1700,5900),
        "16276_timestamp": int_unix_time,
        "16276":  genera_numero_casuale(5700,19900),
        "17496_timestamp": int_unix_time,
        "17496": _496EaTotImpAct,
        "18560_timestamp": int_unix_time,
        "18560": _560EaL1,
        "19564_timestamp": int_unix_time,
        "19564": _564EaL2,
        "20568_timestamp": int_unix_time,
        "20568": _568EaL3,
        "univoco": univocomodbus
    }
}

#print (mqtt_message)
mqtt_message_to_send = json.dumps(mqtt_message,  indent=4)

MQTT_BROKER = "localhost"
MQTT_TOPIC = "/home/meter/21"

try:
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message
    client.username_pw_set(username='meter_user1', password='fsdgrg33ds34f3')
    print("Connecting to mqtt broker ...")
    client.connect(MQTT_BROKER, 1885, 60)
    ret= client.publish(MQTT_TOPIC,mqtt_message_to_send)
    if ret.rc == mqtt.MQTT_ERR_SUCCESS:
        print("SEND OK")
    else:
        print(f'ERROR SEND KO !!!!!')
    client.disconnect()
    client = None

except KeyboardInterrupt:
    print("Chiusura in corso...")





'''
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

{
    "univoco": "TCP_21_20260424084502",
    "sentOn": 1777013176354,
    "metrics": {
        "00Lifetimer_timestamp": 1777020302000,
        "00Lifetimer": 18653644.0,
        "01220_timestamp": 1777020302000,
        "01220": 238.0205078125,
        "02222_timestamp": 1777020302000,
        "02222": 237.7129669189453,
        "03224_timestamp": 1777020302000,
        "03224": 237.38958740234375,
        "04226_timestamp": 1777020302000,
        "04226": 411.6436462402344,
        "05228_timestamp": 1777020302000,
        "05228": 411.0644226074219,
        "06230_timestamp": 1777020302000,
        "06230": 410.9103698730469,
        "07232_timestamp": 1777020302000,
        "07232": 29.36884880065918,
        "08234_timestamp": 1777020302000,
        "08234": 27.471729278564453,
        "09236_timestamp": 1777020302000,
        "09236": 31.172351837158203,
        "10240_timestamp": 1777020302000,
        "10240": 3700.178466796875,
        "11242_timestamp": 1777020302000,
        "11242": 3751.429443359375,
        "12244_timestamp": 1777020302000,
        "12244": 4389.083984375,
        "13246_timestamp": 1777020302000,
        "13246": 5930.0751953125,
        "14248_timestamp": 1777020302000,
        "14248": 5348.216796875,
        "15250_timestamp": 1777020302000,
        "15250": 5907.04541015625,
        "16276_timestamp": 1777020302000,
        "16276": 11934.0126953125,
        "17496_timestamp": 1777020302000,
        "17496": 317237817.0,
        "18560_timestamp": 1777020302000,
        "18560": 75864969.0,
        "19564_timestamp": 1777020302000,
        "19564": 137989199.0,
        "20568_timestamp": 1777020302000,
        "20568": 103383661.0,
        "univoco": "TCP_21_20260424084502"
    }
}

'''
