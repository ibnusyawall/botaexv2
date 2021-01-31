const listMenu = (name, lh, lg, xp, role) => {
    return new Promise((resolve, reject) => {
        var menu = `*A E X B O T* | by. @isywl_

Halo *${name}*!👋🏻

🕹️ LIMIT GAME: ${lg}
💲 LIMIT HIT : ${lh}
➿ XP: ${xp}
📢 ROLE: ${role.toUpperCase()}

😼   \`\`\`AEX MAIN\`\`\` 😼                     

😼 .owner
😼 .menu                                  
😼 .help                               
😼 .donate                              
😼 .afk *alasan*
😼 .lapor *keluhan*
😼 .return *object*
😼 .readview *tagmessage*


😼   \`\`\`AEX SYSTEM\`\`\` 😼   

😼 .ping
😼 .cpu
😼 .batere


😼   \`\`\`AEX LEVELING\`\`\` 😼

😼 .level
😼 .rank
😼 .limit games
😼 .limit xp
😼 .limit hit
😼 .send xp *no* ? *jumlah*
😼 .send hit *no* ? *jumlah*
😼 .tukar xp2limit *jumlahxp*


😼   \`\`\`AEX GAMES\`\`\` 😼   

😼 .pup
😼 .put
😼 .pull
😼 .tup
😼 .tap
😼 .tic
😼 .up
😼 .right
😼 .down
😼 .get
😼 .rich
😼 .guy


😼   \`\`\`AEX CLOUD SYSTEM\`\`\` 😼

😼 .stiker_
😼 .stiker_add *nama stiker*
😼 .stiker_get *nama stikee*
😼 .stiker_del *nama stikee*


😼   \`\`\`AEX MANIPULATE\`\`\` 😼

😼 .gradient *#hex* *#hex*
😼 .botsay *botname* *message*
😼 .ohno *message*
😼 .joke *tagimage*
😼 .trigger *tagimage/taguser*


😼   \`\`\`AEX GROUP\`\`\` 😼   

😼 .del *tagmessage*
😼 .setgc open
😼 .setgc close
😼 .setgc name  *name*
😼 .setgc desc  *description*
😼 .setgc profile *photo*
😼 .setgc promote  *@tag*
😼 .setgc demote  *@tag*
😼 .setgc wellcome status *on/off*
😼 .setgc wellcome message *message*
😼 .leave
😼 .leave delay  *delay*
😼 .hidetag
😼 .hidetag  *pesan*
😼 .spadmin
😼 .tagall


😼   \`\`\`AEX RANDOM\`\`\` 😼                   

😼 .randomwibu                    
😼 .randomanim                     
😼 .randomanim2                   
😼 .randomhentai
😼 .randomyuri                           
😼 .randomdva                           
😼 .randomtrap
😼 .randomhug                            
😼 .randomnsfw


😼   \`\`\`AEX WIBU\`\`\` 😼

😼 .nekonime
😼 .nekonime2
😼 .quotesnime


😼   \`\`\`AEX MEDIA\`\`\` 😼                    

😼 .asu                                       
😼 .rubah                                  
😼 .mbe                                       
😼 .miaw                                   
😼 .emot *emoji*


😼   \`\`\`AEX INFORMATION\`\`\` 😼    

😼 .bmkg
😼 .togel
😼 .fakta
😼 .cuaca *daerah*
😼 .sholat *daerah*
😼 .quran *nomor*


😼   \`\`\`AEX CREATE\`\`\` 😼

😼 .albert *text*
😼 .avatar *text*
😼 .avanger *text1* *text2*
😼 .battlefield *text1* *text2*
😼 .blur *text*
😼 .bp *text*
😼 .csgo *text*
😼 .crossfire *text*
😼 .coffee *text*
😼 .draw *linkimage*
😼 .flaming *text*
😼 .fire1 *linkimage*
😼 .fire2 *linkimage*
😼 .fire3 *linkimage*
😼 .frame *linkimage*
😼 .facebook *linkimage* *text*
😼 .glass *linkimage*
😼 .glitch *linkimage*
😼 .gta *linkimage*
😼 .hujan *linkimage*
😼 .hbd1 *linkimage*
😼 .hbd2 *linkimage*
😼 .haha *text1* *text2*
😼 .harta *text1* *text2* *text3*
😼 .img2url *tagimage*
😼 .lines *linkimage*
😼 .lolcover1 *linkimage*
😼 .lolcover2 *linkimage*
😼 .love1 *text*
😼 .love2 *text*
😼 .metalic *text*
😼 .marvel1 *text1* *text2*
😼 .marvel2 *text1* *text2*
😼 .mirror *linkimage*
😼 .nulis *text*
😼 .phone1 *linkimage*
😼 .phone2 *linkimage*
😼 .pubg *text1* *text2*
😼 .pokemon *text*
😼 .pokeball *linkimage*
😼 .quotesmaker *type* *author* *quotes*
😼 .qr *text*
😼 .rainbow *linkimage*
😼 .sketch *linkimage*
😼 .sticker *tagimage*
😼 .swm *packagename* *author*
😼 .ss *linkweb*
😼 .tiktext *text1* *text2*
😼 .tato *text*
😼 .thunder *text*
😼 .toilet *linkimage*
😼 .versus *linkimage1* *linkimage2*
😼 .wanted *linkimage* *text1* *text2*
😼 .warface *text*


😼   \`\`\`AEX TRACK RESI\`\`\` 😼

😼 .resi jet *koderesi*
😼 .resi jnt *koderesi*
😼 .resi jne *koderesi*
😼 .resi dse *koderesi*
😼 .resi pos *koderesi*
😼 .resi rpx *koderesi*
😼 .resi sap *koderesi*
😼 .resi pcp *koderesi*
😼 .resi idl *koderesi*
😼 .resi rex *koderesi*
😼 .resi tiki *koderesi*
😼 .resi ninja *koderesi*
😼 .resi lion *koderesi*
😼 .resi first *koderesi*
😼 .resi wahana *koderesi*
😼 .resi sicepat *koderesi*


😼   \`\`\`AEX FUN\`\`\` 😼                     

😼 .alay *text*                     
😼 .hilih *text*                   
😼 .ninja *text*                   
😼 .cool *text*                     
😼 .lirik *lagu*
😼 .umur*nama*
😼 .nama *gender*
😼 .fitnah *@tag pesan | balasan*


😼   \`\`\`AEX EDUCATION\`\`\` 😼  

😼 .brainly *query*
😼 .wiki *query*     
😼 .chord *lagu*
😼 .jam *daerah*


😼   \`\`\`AEX SIMULATE\`\`\` 😼  

😼 .simulate typing
😼 .simulate recording
😼 .simulate stop


😼   \`\`\`AEX OWNER\`\`\` 😼  

😼 .shell *command*
😼 .eval *command*
😼 .block list
😼 .block add *number*     
😼 .block remove *number*
😼 .block addTag *@taguser*
😼 .block removeTag *@taguser*
😼 .premi add *number*
😼 .premi remove *number*
😼 .premi reset *number*
😼 .premi list


😼   \`\`\`AEX UTILITES\`\`\` 😼  

😼 .list chat
😼 .list group
😼 .list all
😼 .leave all
😼 .exec *lang* *syntax*

JOIN GROUP OFFICIAL: https://chat.whatsapp.com/HtrGfYgAz9iFxUaowKo2tf
`
    resolve(menu)
    })
}

//listMenu().then(d => console.log(d))
module.exports = listMenu
