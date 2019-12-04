	
const sqlite3 = require('sqlite3').verbose();
let sqlCustmore = `SELECT CustomerName name, 
                  Email email,
                  RoomNumber room,
                  DatesReserved date,
                  ReservationID ID,
                  Password pass
                  FROM Customer`;
let sqlEmployee = `SELECT EmployeeName EmpName, 
                  AdminStatus AS,
                  EmployeeId ID                 
                  FROM Employee`;
let sqlReservation =`SELECT ReservationID ID, 
                  AmountOwed AO,
                  AmountPaid AP,
                  DatePaid DP                
                  FROM Reservation`;
let sqlRoom = `SELECT  RoomNumber RN,
                  CurrentlyAvailable CA,    
                  Datesreserved DR             
                  FROM Room`;
let sqlAvalRoom = `SELECT  RoomNumber RN,
                  CurrentlyAvailable CA,    
                  Datesreserved DR             
                  FROM Room
                  WHERE CurrentlyAvailable=?`;

let roomN = 0;
let roomArray = new Array(45);
let vaild = 'F';
// open the database
let db = new sqlite3.Database('../database/Ophelias database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the Ophelias database.');
});

          
  function addcustomer(name,email,roomnumber,dateRese,ReseID){    
      let x ='INSERT INTO Customer(CustomerName,Email,RoomNumber,DatesReserved,ReservationID) VALUES('+name+','+email+','+roomnumber+','+dateRese+','+ReseID+')';
       db.run(x, [], function(err) {
      if (err) {
          return console.log(err.message);
      }
        // get the last insert id
       console.log(`A row has been inserted with rowid ${this.lastID}`);
    }); 
  }         
 
  function checkcuslogin(username,password){      

      db.all(sqlCustmore, [], (err, rows) => {
          if (err) {
                    throw err;
          }
          rows.forEach((row) => {    
                if(row.pass == password && row.email == username){
                    return true;
                    console.log("logged in");
                }else{
                     return false;
                     console.log("wrong info");
               }      
          });
        });
  }
  function getReservation(ID){
    db.all(sqlReservation, [], (err, rows) => {
      if (err) {
                throw err;
      }
      rows.forEach((row) => {    
            if(row.ID == ID){                
                console.log('Reservation ID : '+row.ID+' , Amount paid : $'+row.AP+' , AmountOwed : $'+row.AO+' , date paid '+row.DP+'');
                return true;
            }else{                 
                 console.log("wrong info or Reservation Dose not exist");
                 return false;
           }      
      });
    });


  }
 function deleteCustomre(email){
    db.run(`DELETE FROM Customer WHERE Email=?`, email, function(err) {
      if (err) {
        return console.error(err.message);
      }
        console.log(`Row(s) deleted ${this.changes}`);
      });
}

function checkAvailRoom(){
 
   db.all(sqlRoom, [], (err, rows) => {
    if (err) {
              throw err;
    }
    rows.forEach((row) => {    
          if(row.CA == 'T' ){                
              console.log('Room Number  : '+row.RN+' , Ava? : $'+row.CA+' , Date reserved : $'+row.DR+' ');              
              vaild ='T';
             
              roomN = row.RN;             
                   
            
          }
    });
    if (vaild == 'F'){
        console.log("no rooms are available");
        
    }

    
                    
  });
  
  
   
}

function lookRoomUp(RoomNumber){
  
  db.all(sqlRoom, [], (err, rows) => {
    if (err) {
              throw err;
    }else{

    rows.forEach((row) => {    
          if(row.RN == RoomNumber ){                
              console.log('Room Number : '+row.RN+' , Ava? : $'+row.CA+' , Date reserved : $'+row.DR+' ');
              vaild = 'T';
              return row.RN;
          }
    });
      if (vaild == 'F'){
        console.log("no room matches");
        return 'F';
      }          
    }  
  });

}



function getNextAvailRoom(temp){
  
      db.run('UPDATE Room SET CurrentlyAvailable=? WHERE RoomNumber=?', ['F',temp], function(err) {
        if (err) {
          return console.error(err.message);
        }else{
               console.log(`Row(s) updated: ${this.changes}`);
              }
       
      
             
      });
      

       

      
}

getNextAvailRoom();
checkAvailRoom();









db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
 
});