##### SCRIPT FOR INSERT DATA IN ORACLE DATABASE USING CX_ORACLE #####
import cx_Oracle


try:

    #CREATE CONNECTION
    conn = cx_Oracle.connect("AIDAIA","AIDAIA2020","//51.178.140.57:1521/ORCLPDB1")
    
except Exception as err:
    print('Error with connection', err)

else:

    try:
        #CREATE CURSOR
        cur = conn.cursor()
        sql_script = """

            INSERT INTO AIDAIA.TESTE_CONNETION
            (FIRST, LAST, NUMB)
            VALUES
            ('two', 'knmj', 24)"""
        
        cur.execute(sql_script)
        
    except Exception as err:
        print('Error with inserting data', err)
    else:
        print('Insert Complete')
        conn.commit()

finally:
    cur.close()
    conn.close()