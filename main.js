const {
    default: makeWASocket,
	MessageType, 
    MessageOptions, 
    Mimetype,
	DisconnectReason,
    useSingleFileAuthState
} =require("@adiwajshing/baileys");

const { Boom } =require("@hapi/boom");
const {state, saveState} = useSingleFileAuthState("./auth_info.json");
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require("express");
const bodyParser = require("body-parser");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const axios = require("axios");
const port = process.env.PORT || 5001;


//fungsi suara capital 
function capital(textSound){
    const arr = textSound.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str = arr.join(" ");
    return str;

}

async function connectToWhatsApp() {
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
    	//console.log(update);
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
           let reason = new Boom(lastDisconnect.error).output.statusCode;
			if (reason === DisconnectReason.badSession) {
				console.log("Bad Session File, Please Delete file session and Scan Again");
				sock.logout();
				if (fs.existsSync('auth_info.json')) {
					fs.unlink('auth_info.json', function (err) {
						if (err) throw err;
						console.log('File deleted!');
					});
				};
				connectToWhatsApp();
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				connectToWhatsApp();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				connectToWhatsApp();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
				sock.logout();
			} else if (reason === DisconnectReason.loggedOut) {
				console.log("Device Logged Out, Please Delete sesion and Scan Again.");
				sock.logout();
				if (fs.existsSync('auth_info.json')) {
					fs.unlink('auth_info.json', function (err) {
						if (err) throw err;
						console.log('File deleted!');
					});
				};
				connectToWhatsApp();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
				connectToWhatsApp();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
				connectToWhatsApp();
			} else {
				sock.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);				
			}
        } else if(connection === 'open') {
            console.log('opened connection');

        }
    });

    sock.ev.on("creds.update", saveState);

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        
        //console.log(messages);

      if(type === "notify"){
            if(!messages[0].key.fromMe && !messages[0].key.participant) {
            
                

                //tentukan jenis pesan berbentuk text                
                const pesan = messages[0].message.conversation;
                //tentukan jenis pesan apakah bentuk list
                const responseList = messages[0].message.listResponseMessage;
                //tentukan jenis pesan apakah bentuk button
                const responseButton = messages[0].message.buttonsResponseMessage;
                
				//tentukan jenis pesan apakah bentuk templateButtonReplyMessage
                const responseReplyButton = messages[0].message.templateButtonReplyMessage;
                
				//nowa dari pengirim pesan sebagai id
                const noWa = messages[0].key.remoteJid;
                
				 sock.readMessages([messages[0].key]);
                //kecilkan semua pesan yang masuk lowercase 
                const pesanMasuk = pesan.toLowerCase();
                
 
const fs = require('fs');

  
  // Membaca file data.txt
 // let datsa = fs.readFileSync('data.txt', 'utf8');

  // Memecah data.txt menjadi array
  

  // Looping array
  
    // Cek apakah nomer tersebut valid
  // if (noWa === datsa) {
      // Kirim pesan

     // sock.sendMessage(noWa, {text:"Tesidak Ada" },{quoted: messages[0] });


pws =!messages[0].key.fromMe && pesan
                    

                
  let [folder] = pws.split(" ");
var locat ='/storage/emulated/0/MYPROJECTNOW/ForumDb/DataBase'
  fs.readdir(`${locat}/${folder}`, (err, files) => {
    if (err) {
      sock.sendMessage(noWa, {text:"DataBase Tidak Ada" },{quoted: messages[0] });
    } else {
      let isUserExist = false;
      files.forEach(file => {
        if (file === 'user.txt') {
          isUserExist = true;
          fs.readFile(`${locat}/${folder}/user.txt`, 'utf8', (err, data) => {
            if (err) throw err;

            if (noWa === data) {

              let isDataExist = false;

              files.forEach(file => {

                if (file === 'data.txt') {

                  isDataExist = true;
                  
                  fs.readFile(`${locat}/${folder}/${file}`, 'utf8', (err, data) => {
                  sock.sendMessage(noWa, {text:data },{quoted: messages[0] });
                    if (err) throw err;
                    let kata1 = data.split(" ")[0]; //ambil kata pertama dari kalimat yang diinputkan user 
                    let kata2 = data.split(" ")[1]; //ambil kata kedua dari kalimat yang diinputkan user 
                    console.log(`${kata1} ${kata2}`); //tampilkan 2 kata tersebut 
                  });  
                } 
              });  

              if (!isDataExist); 
            } else sock.sendMessage(noWa, {text:"Data Bukan Milik Anda" },{quoted: messages[0] });
          });  
        } 
      });  

      if (!isUserExist) sock.sendMessage(noWa, {text:"masukan Id Yang Benar" },{quoted: messages[0] });
    } }); 
                

                if(!messages[0].key.fromMe && pesanMasuk === "ping"){
                     sock.sendMessage(noWa, {text: "Pong"},{quoted: messages[0] });
                }
            /*     }
                 else{
                 console.log(noWa)
                 sock.sendMessage(noWa, {text: "cut"},{quoted: messages[0] });
                 }*/
 

            }		
		}

    });

}
// run in main file
connectToWhatsApp()
.catch (err => console.log("unexpected error: " + err) ) // catch any errors

server.listen(port, () => {
  console.log("Server Berjalan pada Port : " + port);
});
