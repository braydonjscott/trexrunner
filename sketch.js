var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudimage,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6
var score, obstaclegroup, cloudgroup
var PLAY = 1
var END = 0
var gameState = PLAY
var gameOverImage, restartImage
var jumpSound, dieSound, checkPointSound
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudimage = loadImage("cloud.png")
  groundImage = loadImage("ground2.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  gameOverImage = loadImage("gameOver-1.png")
  restartImage = loadImage("restart.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  score=0
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.setCollider("rectangle",0,0,80,80)
  trex.debug = true
  obstaclegroup = new Group()
  cloudgroup = new Group()
//create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
//create the invisible ground sprite
  invisibleGround = createSprite(300,195,600,20)
  invisibleGround.visible = false
  
  gameOver = createSprite(300,100,20,20)
  gameOver.addImage(gameOverImage)
  gameOver.scale=1

  
  restart = createSprite(300,150,20,20)
  restart.addImage(restartImage)
  restart.scale=0.5
}

function draw() {
  background("black");
  if(gameState === PLAY){
    ground.velocityX = -(3+score/100);
    spawnclouds()
    spawnobstacle()
    score = score + Math.round(getFrameRate()/40)
    if (keyDown("space")&&trex.y>100) {
      trex.velocityY = -10;
      //jumpSound.play()
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }   
    trex.velocityY=trex.velocityY + 0.8
    gameOver.visible=false
    restart.visible=false
  }
    //if(score>0&&score%100===0){
      //checkPointSound.play()
    //}
    if(mousePressedOver(restart)&&gameState===END){
      gameState = PLAY
      gameOver.visible=false
      restart.visible=false
      score=0
      cloudgroup.destroyEach()
      obstaclegroup.destroyEach()
      trex.changeAnimation("running", trex_running)
    }
  else if(gameState === END){
    trex.changeAnimation("collided", trex_collided)
    ground.velocityX = 0;
    trex.velocityY=0
    obstaclegroup.setVelocityXEach(0)
    cloudgroup.setVelocityXEach(0)
    cloudgroup.setLifetimeEach(-1)
    obstaclegroup.setLifetimeEach(-1)
    gameOver.visible=true
    restart.visible=true
  }
  fill("green")
  text("score="+score,500,50)

  if(trex.isTouching(obstaclegroup)){
    gameState = END
    //dieSound.play()
  }
  
  if(keyDown("r")&&gameState===END){
    gameState=PLAY
    trex.changeAnimation("running",trex_running)
    obstaclegroup.setLifetimeEach(0)
    cloudgroup.setLifetimeEach(0)
    score=0
  }
  //make the trex walk on the ground
  trex.collide(invisibleGround);
  console.log(gameState)
  
  if(score>0&&score>5000){
    background("black")
  }
  
  drawSprites();
}

function spawnclouds(){
  if(frameCount%60===0){
    var cloud = createSprite(600,50,40,20)
    cloud.y = Math.round(random(50,170))
    cloud.velocityX = -2
    cloud.addImage("cloud",cloudimage)
    cloud.scale = 0.5
    cloud.lifetime = 300
    cloudgroup.add(cloud)
    trex.depth = cloud.depth
    trex.depth += 1
  }
}

function spawnobstacle(){
  if(frameCount%60===0){
    var obstacle = createSprite(600, 165, 20, 40)
    obstacle.velocityX = -(3+score/100)
    var rand = Math.round(random(1,6))
    obstacle.lifetime = 200
    obstaclegroup.add(obstacle)
    switch(rand){
      case 1 : obstacle.addImage("obstacle",obstacle1)
      break
      case 2 : obstacle.addImage("obstacle",obstacle2)
      break
      case 3 : obstacle.addImage("obstacle",obstacle3)
      break
      case 4 : obstacle.addImage("obstacle",obstacle4)
      break
      case 5 : obstacle.addImage("obstacle",obstacle5)
      break
      case 6 : obstacle.addImage("obstacle",obstacle6)
      break
      default:break
    }
    obstacle.scale = 0.5
  }
}

