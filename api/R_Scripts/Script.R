
##### SCRIPT FOR INSERT DATA IN ORACLE DATABASE USING ROracle #####

library(DBI)
library(ROracle)

tryCatch({

    #CREATE CONNECTION
    conn <- dbConnect(dbDriver("Oracle"),
                    username="AIDAIA",
                    password="AIDAIA2020",
                    dbname="51.178.140.57:1521/ORCLPDB1")

    except Exception as err:
        print('Error with connection', err)

    else{

        tryCatch({
            
            cur <- conn.cursor()
            sql_query <- """ INSERT INTO AIDAIA.TESTE_CONNETION
                        (FIRST, LAST, NUMB)
                        VALUES
                        ('tres', 'jjj', 266) """
            cur.execute(sql_script)

            except Exception as err:
                print('Error with query', err)
            
            else{

                print('Query Executed')
                conn.commit()
            }
        })
    }

    finally:
        cur.close()
        conn.close()

})