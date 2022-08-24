class Body{constructor(i,s){this.killMe=!1,void 0!==s?(this.fillColor=s,this.img=s.img):this.fillColor=color("white"),this.body=world.add(i)}getAxisAndAngelFromQuaternion(i){const s=2*Math.acos(i.w);var t;return t=1-i.w*i.w<1e-6?1:Math.sqrt(1-i.w*i.w),[i.x/t,i.y/t,i.z/t,s]}update(){this.bodyPosition=this.body.getPosition(),(this.bodyPosition.x<-50||this.bodyPosition.x>50||this.bodyPosition.y<-50||this.bodyPosition.y>50||this.bodyPosition.z<-50||this.bodyPosition.z>50)&&(this.killMe=!0),this.bodyQuaternionRaw=this.body.getQuaternion(),this.axisAngle=this.getAxisAndAngelFromQuaternion(this.bodyQuaternionRaw),this.r=this.axisAngle[3],this.v=createVector(this.axisAngle[0],this.axisAngle[1],this.axisAngle[2])}display(){push(),fill(color(this.fillColor)),noStroke(),smooth(),translate(this.bodyPosition.x*conv,this.bodyPosition.y*conv,this.bodyPosition.z*conv),1==this.body.quaternion.w&&0==this.body.quaternion.x||rotate(this.r,this.v),void 0!==this.img&&texture(this.img),2==this.body.shapes.type?box(this.body.shapes.width*conv,this.body.shapes.height*conv,this.body.shapes.depth*conv):3==this.body.shapes.type?cylinder(this.body.shapes.radius*conv,this.body.shapes.height*conv):1==this.body.shapes.type&&sphere(this.body.shapes.radius*conv),pop()}}class AppleSystem{constructor(i,s){this.bodies=[],this.initFall=s,this.appleSize=APPLESIZE;for(let s=0;s<i;s++){var t=getRandomFromList([{type:"box",size:[this.appleSize,this.appleSize,this.appleSize]}]),e=getRandomFromList(PALETTE),o=50-s*this.appleSize%100,h=this.appleSize/2-15;if(this.initFall)var n=-50+Math.floor(s*this.appleSize/100);else n=50+-1*Math.floor(s*this.appleSize/100);var a={type:t.type,size:t.size,pos:[o,h,n],rot:[0,0,0],move:!0,density:1,friction:0,restitution:RESTITUTION,noSleep:!0,name:"apple_"+s};this.bodies.push(new Body(a,e))}}updateDisplay(){for(var i=this.bodies.length-1;i>=0;i--)1==this.bodies[i].killMe?(this.bodies[i].body.remove(),this.bodies.splice(i,1)):(this.bodies[i].update(),this.bodies[i].display())}killAllCall(){for(let i=0;i<this.bodies.length;i++)this.bodies[i].killMe=!0}}class Pusher extends Body{constructor(i,s){super(i,s),this.startPosition=structuredClone(this.body.getPosition()),this.noiseOffset=this.startPosition.z,this.angle=300}fire(){this.angle=90}move(){this.waveLocation=this.noiseOffset,this.waveVel=0,this.waveAcc=0,this.sineValue=sin(this.angle),this.sineValue>sin(this.angle+.01)?(this.waveAcc=map(this.sineValue,-1,1,30,60),this.waveVel+=this.waveAcc,this.waveLocation+=this.waveVel,0==waveIndex?this.angle+=.025:1==waveIndex?this.angle+=.02:this.angle+=.01,this.body.setPosition({x:this.startPosition.x,y:0,z:this.waveLocation})):this.body.setPosition({x:this.startPosition.x,y:this.startPosition.y,z:this.startPosition.z})}}class PusherSystem{constructor(i){this.ground_width=i,this.createNoiseLine(),this.bodies=[];var s=color(0,0,255,100);for(let e=0;e<this.amount;e++){var t={type:"box",size:[this.widthPusher,30,this.widthPusher],pos:[e*this.widthPusher-i/2,100,this.noiseLine[e]],rot:[0,60,0],move:!0,density:1e3,kinematic:!0,noSleep:!0,material:"kinematic",name:"Pusher_"+e};this.bodies.push(new Pusher(t,s))}}createNoiseLine(){this.widthPusher=1,this.noiseStep=.3,this.noiseRange=10,this.amount=100,this.widthPusher=this.ground_width/this.amount,this.noiseLine=[];let i=0;for(let s=0;s<this.amount;s++)this.noiseLine.push(map(noise(i),0,1,-this.noiseRange,this.noiseRange)),i+=this.noiseStep}updateDisplay(){for(let i=0;i<this.bodies.length;i++)this.bodies[i].move(),this.bodies[i].update(),5==MODE&&this.bodies[i].display()}fire(){for(let i=0;i<this.bodies.length;i++)this.bodies[i].fire()}}class ObstacleSystem{constructor(i){this.amount=i,this.bodies=[];for(let i=0;i<this.amount;i++){var s={type:"cylinder",size:[1,30],pos:[getRandomFromInterval(-50,50),0,getRandomFromInterval(-30,30)],rot:[0,0,0],move:!1,density:1e3,friction:.2,restitution:.2,name:"obstacle"};this.bodies.push(new Body(s,color(0,155,0,100)))}}updateDisplay(){for(let i=0;i<this.bodies.length;i++)this.bodies[i].update(),5==MODE&&this.bodies[i].display()}}