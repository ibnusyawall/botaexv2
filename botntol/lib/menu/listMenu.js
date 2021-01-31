const listMenu = (name, lh, lg, xp, role) => {
    return new Promise((resolve, reject) => {
        var menu = `*A E X B O T* | by. @isywl_

Halo *${name}*!👋🏻

🕹️ LIMIT GAME: ${lg}
💲 LIMIT HIT : ${lh}
➿ XP: ${xp}
📢 ROLE: ${role.toUpperCase()}

*#*  \`\`\`AEX MAIN\`\`\` *#*                    

*.*  owner
*.*  menu                                  
*.*  help                               
*.*  donate                              
*.*  lapor *keluhan*
*.*  return *object*
*.*  readview *tagmessage*


*#*  \`\`\`AEX SYSTEM\`\`\` *#*  

*.*  ping
*.*  cpu
*.*  batere


*#*  \`\`\`AEX LEVELING\`\`\` *#*

*.*  level
*.*  rank
*.*  limit games
*.*  limit xp
*.*  limit hit
*.*  send xp *no* ? *jumlah*
*.*  send hit *no* ? *jumlah*
*.*  tukar xp2limit *jumlahxp*


*#*  \`\`\`AEX GAMES\`\`\` *#*  

*.*  pup
*.*  put
*.*  pull
*.*  tup
*.*  tap
*.*  tic
*.*  up
*.*  right
*.*  down
*.*  get
*.*  rich
*.*  guy


*#*  \`\`\`AEX GROUP\`\`\` *#*  

*.*  del *tagmessage*
*.*  setgc open
*.*  setgc close
*.*  setgc name  *name*
*.*  setgc desc  *description*
*.*  setgc profile *photo*
*.*  setgc promote  *@tag*
*.*  setgc demote  *@tag*
*.*  setgc wellcome status *on/off*
*.*  setgc wellcome message *message*
*.*  leave
*.*  leave delay  *delay*
*.*  hidetag
*.*  hidetag  *pesan*
*.*  spadmin
*.*  tagall


*#*  \`\`\`AEX RANDOM\`\`\` *#*                  

*.*  randomwibu                    
*.*  randomanim                     
*.*  randomanim2                   
*.*  randomhentai
*.*  randomyuri                           
*.*  randomdva                           
*.*  randomtrap
*.*  randomhug                            
*.*  randomnsfw


*#*  \`\`\`AEX WIBU\`\`\` *#*

*.*  nekonime
*.*  nekonime2
*.*  quotesnime


*#*  \`\`\`AEX MEDIA\`\`\` *#*                   

*.*  asu                                       
*.*  rubah                                  
*.*  mbe                                       
*.*  miaw                                   
*.*  ss *link*                                   
*.*  qr *query*                              


*#*  \`\`\`AEX INFORMATION\`\`\` *#*   

*.*  bmkg
*.*  togel
*.*  fakta
*.*  cuaca *daerah*
*.*  sholat *daerah*
*.*  quran *nomor*


*#*  \`\`\`AEX CREATE\`\`\` *#*

*.*  sticker
*.*  nulis *text*
*.*  short *url*
*.*  tourl
*.* img2url *taggambar*


*#*  \`\`\`AEX FUN\`\`\` *#*                    

*.*  alay *text*                     
*.*  hilih *text*                   
*.*  ninja *text*                   
*.*  cool *text*                     
*.*  lirik *lagu*
*.*  umur*nama*
*.*  nama *gender*
*.*  fitnah *@tag pesan | balasan*


*#*  \`\`\`AEX EDUCATION\`\`\` *#* 

*.*  brainly *query*
*.*  wiki *query*     
*.*  chord *lagu*
*.*  jam *daerah*


*#*  \`\`\`AEX SIMULATE\`\`\` *#* 

*.*  simulate typing
*.*  simulate recording
*.*  simulate stop


*#*  \`\`\`AEX OWNER\`\`\` *#* 

*.*  shell *command*
*.*  eval *command*
*.*  block list
*.*  block add *number*     
*.*  block remove *number*
*.*  block addTag *@taguser*
*.*  block removeTag *@taguser*
*.*  premi add *number*
*.*  premi remove *number*
*.*  premi reset *number*
*.*  premi list


*#*  \`\`\`AEX UTILITES\`\`\` *#* 

*.*  list chat
*.*  list group
*.*  list all
*.*  leave all
*.*  exec *lang* *syntax*
`
    resolve(menu)
    })
}

//listMenu().then(d => console.log(d))
module.exports = listMenu
