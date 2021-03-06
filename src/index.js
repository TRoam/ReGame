import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';

let Tick;
class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kilometer : 0,
      heroLoc : 0,
      enemyLoc: 0,
      enemyType : 0,
      enemySpeed : 0,
      gameState : 0,
      gameStart :0,
      gameOver : 0,
      aniEnd : true,
      superMode :0,
      chunge : 0,
      hasSuper : 0,
    };
    this.gameStart = this.gameStart.bind(this);
    this.gameHandle = this.gameHandle.bind(this);
    this.mobileSuper = this.mobileSuper.bind(this);
    this.gameRestart = this.gameRestart.bind(this);
  }
  gameStart() {
    this.setState({
        kilometer : 0,
        heroLoc : 0,
        enemyLoc: 0,
        enemyType : 0,
        enemySpeed : 0,
        gameState : 1,
        gameStart :1,
        gameOver : 0,
        aniEnd : true,
        superMode :0,
        chunge : 0,
        hasSuper : 0,
    });
    this.gameTick(true);
    this.createEnemy(); 
  }
  gameTick (state) {
    let that = this,
        crash = 620,
        heroLoc,enemyLoc,trs,dis,kilometer = 0;

    if(state){
        Tick = setInterval(function(){
            trs = window.getComputedStyle(that.refs.enemy,null).getPropertyValue("transform");
            dis = trs.split(",")[5].replace(")","");
            heroLoc = that.state.heroLoc;
            enemyLoc = that.state.enemyLoc;
            if(dis>crash &&dis<(crash+220) && heroLoc == enemyLoc){
                if(that.state.superMode ==1){
                    that.superBuff();
                }else{
                    that.gameOver();
                }
            }
            kilometer ++;
            that.setState({kilometer:kilometer});
            //开启无敌模式
            if(kilometer%1000==0){
                that.superMode();
            }
        },10);
    }else{
        clearInterval(Tick);
    }
  }
  gameHandle(e) {
    if(this.state.gameState ==1){
      switch(e.keyCode){
          case 37:
              this.setState({heroLoc : 0});
              break;
          case 39:
              this.setState({heroLoc : 1});
              break;
          case 32:
              if(this.state.hasSuper==1){
                  this.setState({superMode : 1});
                  this.setState({hasSuper : 0});
              }
              break;
      }
  }
  }
  mobileSuper(){
    if(this.state.hasSuper==1){
        this.setState({superMode : 1});
        this.setState({hasSuper : 0});
    }
  }
  gameOver() {
    this.setState({gameState : 0});
    this.setState({gameOver : 1})
    this.gameTick(false);
  }
  gameRestart() {
    this.gameStart();
  }
  superBuff() {
    this.setState({chunge : 1});
    setTimeout(() => {
        this.setState({chunge : 0});
    },1000);
  }
  superMode(){
    this.setState({hasSuper : 1});
    setTimeout(() => {
        this.setState({superMode : 0});
    },5000);
  }
  createEnemy() {
    let  enemyClass,enemySpeed,enemyLoc,enemyType,
        animationEnd = true;
    setInterval(() => {
        if(this.state.aniEnd && this.state.gameState == 1){
            this.setState({aniEnd : false});
            enemyType = Math.floor(Math.random()*3);
            enemySpeed = Math.floor(Math.random()*3);
            enemyLoc = Math.round(Math.random());
            this.setState({enemyLoc : enemyLoc});
            this.setState({enemyType : enemyType});
            this.setState({enemySpeed : enemySpeed});
        }
    },1000);
    this.refs.enemy.addEventListener("webkitAnimationEnd",() => {
        this.setState({aniEnd : true});
    });
  }
  componentDidMount() {
    window.addEventListener("keydown", this.gameHandle, false);
    //重力感应
    window.addEventListener("devicemotion", (event) => {
        var eventaccelerationIncludingGravity = event.accelerationIncludingGravity;
        if(this.state.gameState == 1){
            if(eventaccelerationIncludingGravity.x < -1){
                this.setState({heroLoc : 0});
            }else if(eventaccelerationIncludingGravity.x > 1){
                this.setState({heroLoc : 1});
            }
        }
    }, false);
  }
  render() {
    let state = this.state;
    let enemyCls = state.gameStart == 0 || state.aniEnd ?"enemy":("enemy enemy"+ state.enemyType +" speed" + state.enemySpeed + " loc" + state.enemyLoc);
    let boardCls;
    if(state.gameOver==1){
        boardCls = "board crashed";
    }else if(state.superMode==1){
        boardCls = "board superMode";
    }else{
        boardCls = "board";
    }
    return (<div className={boardCls}>
               <div className={state.gameStart==1 ? "roadbed roadRun" : "roadbed"}></div> 
               <div className={state.gameStart==1?"road roadPlay":"road"}>
                   <div className={state.heroLoc == 0 ?"hero left":"hero right"} onClick={this.mobileSuper}>
                       <div className="body">
                           <span className="light"></span>
                       </div>
                   </div>
                   <div className={enemyCls} ref="enemy">
                       <div className={state.chunge == 1?"body chunge":"body"}></div>
                   </div>
                   <p className="help">方向键←→控制左右</p>
                   <p className={state.hasSuper==1?"helpsp show":"helpsp"}>空格键开启无敌模式！</p>
               </div>
               <span className={state.gameStart==1?"start hide":"start"} onClick={this.gameStart}></span> 
               <span className="kilo">{state.kilometer}</span>
               <div className="failbub">
                   <span className="failtext"></span>
                   <span className="retry" onClick={this.gameRestart}></span>
               </div>   
           </div>)
    }
}

// // ========================================
console.log(React);
ReactDOM.render(
  <GameBoard />,
  document.getElementById('root')
);
