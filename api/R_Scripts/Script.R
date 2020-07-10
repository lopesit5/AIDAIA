
##### SCRIPT FOR INSERT DATA IN ORACLE DATABASE USING ROracle #####

library(DBI)
library(ROracle)
  
#CREATE CONNECTION
conn <- dbConnect(dbDriver("Oracle"),
                    username="AIDAIA",
                    password="AIDAIA2020",
                    dbname="51.178.140.57:1521/ORCLPDB1")
  
if(length(conn)==0){
  
  print('Error with connection')
  break;
  
  } else {
  
      #CREATE QUERY FOR DATABASE
      statement <- " INSERT INTO AIDAIA.TESTE_CONNETION
                    (FIRST, LAST, NUMB)
                    VALUES
                    ('tres', 'jjj', 270) "
      
      #EXECUTE SCRIPT INTO DATABASE
      dbSendQuery(conn, statement)
      
      if(length(statement)==0){
        
        print('null query for database')
        break;
      
      } else {
        
        print('Query executed in database')
        dbCommit(conn)
        dbDisconnect(conn)

  }
    
}