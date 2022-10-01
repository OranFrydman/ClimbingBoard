//This is a JavaScript file for the Hangboard Algorithm page. as it only includes scripts to operate the main purpse application and not design scripts


//Choosing grades
var level=0;
const easy_btn = document.getElementById('Easy');
const med_btn = document.getElementById('Medium');
const hard_btn = document.getElementById('Hard');
document.getElementById('Easy').addEventListener('click', ()=>
{
if(SSclicked==0)
{
    level=1;
    easy_btn.style.background="lightgreen";
    med_btn.style.background="";
    hard_btn.style.background="";
}

});
document.getElementById('Medium').addEventListener('click', ()=>
{
if(SSclicked==0)
{
    level=2;
    easy_btn.style.background="";
    med_btn.style.background="lightgreen";
    hard_btn.style.background="";
}
});
document.getElementById('Hard').addEventListener('click', ()=>
{
if(SSclicked==0)
{
    level=3;
    easy_btn.style.background="";
    med_btn.style.background="";
    hard_btn.style.background="lightgreen"
}
});




//StopWatch for workout plan


var [second,minute,] = [0,0];
let timerRef = document.querySelector('.mainTime');
let int = null;
var SSclicked=0;
const btn = document.getElementById('StartStopButton')

//start+stop

document.getElementById('StartStopButton').addEventListener('click', ()=>
{
    if(level>0)
    {
        if(int!==null)
        {
            clearInterval(int);
            
        }
        
        if(SSclicked==0)
        {
            int = setInterval(mainTime,1000);
            SSclicked=1;
            btn.textContent='Stop Climbing';
            btn.style.background="pink";
            window.localStorage.setItem('ChosenLevel',level);
            StartAlgo();
            
        }
        else
        {
  
            
            SSclicked=0;
            document.getElementById("ChosenLevel").value=level;
            document.getElementById("TimeStamp").value=buildDuration(minute,second);
            ClearClock();
            document.getElementById('RecordQuery').click();
            //Later on send details to DataBase for statistics results
        }
    }
    else
    alert("Please choose youre level difficulty first")

});

//reset

document.getElementById('reset').addEventListener('click', ()=>
{
    ClearClock();
});
//maintime
function ClearClock()
{
    SSclicked=0;
    btn.textContent='Start Climbing';
    btn.style.background="";
    clearInterval(int);
    [second,minute] = [0,0];
    timerRef.innerHTML = '00 : 00 ';
    HideHold(RightName);
    HideHold(LeftName);
}
function mainTime()
{
        second++;
        if(second == 60)
            {
            second = 0;
            minute++;
            if(minute == 60)
                {
                minute = 0;
                }
            }
    let m = minute < 10 ? "0" + minute : minute;
    let s = second < 10 ? "0" + second : second;
    timerRef.innerHTML = ` ${m} : ${s} `;

// change hold every X seconds 
    if(second%4==0)
    {
        
        ChangeHold();
    }
}


//HangBoard Algorithm
const [H1,H2,H3,H4,H5,H6,H7,H8,H10,H11,H12,H13,H14,H15,H16,H18,H19,H20,H21,H22,H23,H24,H25,H26]=[7,7,8,8,7,7,4,6,2,4,3,10,3,4,2,5,1,2,3,7,3,2,1,5];
var [H9,H17]=[4,4];
const ArrayHolds = [H1,H2,H3,H4,H5,H6,H7,H8,H9,H10,H11,H12,H13,H14,H15,H16,H17,H18,H19,H20,H21,H22,H23,H24,H25,H26];
const [MaxEasy,MaxMed,MaxHard]= [10,6,1];
const MaxScore = [MaxEasy,MaxMed,MaxHard];
var [leftH,rightH]=[H9,H17];
var [leftI,rightI]=[8,16];
var [LeftName,RightName]=["H9","H17"];
var score=leftH+rightH;
var prob=0;

function StartAlgo()
{
    
    if(level==1)
    {
            H9=10;
            H17=10;
            score=leftH+rightH;
    }
    else if(level==2)
    {
        H9=6;
        H17=6;
        score=leftH+rightH;
    }
    ShowHold('H17');
    ShowHold('H9');
    
}
function ShowHold(name)
{
    document.getElementById(name).style.visibility="visible" 
}
function HideHold(name)
{
    document.getElementById(name).style.visibility="hidden" 
}

//HoldIndex 0-25 (total of 26 holds)
//array[HoldIndex] = actual hold score
//RightName = "H(XX)"(H1-H26)

function ChangeHold() //Randomly choose a different hold on the device
{
  
  let flag=0
  while(flag<1)
  {
    let HoldIndex=Math.floor(Math.random() * 26); 
    let side = Math.random();
    if(HoldIndex!=leftI&&HoldIndex!=rightI)
    {
        if(prob+side<0.5) // Change Right Hold
        {
          if(ArrayHolds[HoldIndex]+leftH>=MaxScore[level-1]) // Passing the Criteria for the level
          {

              prob=0.5; // Factor for disrandomize the sides. (Maybe add feature to let the user choose)
             
              HideHold(RightName); // Hiding last hold
              rightH=ArrayHolds[HoldIndex];  // Inserting new hold score
              RightName="H"+(HoldIndex+1); // Inserting the new Hold Name to memory
              rightI=HoldIndex; // Inserting the new Index 
              ShowHold(RightName); // show the hold
              score=leftH+ArrayHolds[HoldIndex]; // Calculating new score
              flag=1; //exit while iterations
              
          }
        }
        else // Change Left Hold 
        {
          if(ArrayHolds[HoldIndex]+rightH>=MaxScore[level-1])
          {
              prob=-0.5;
              leftH=ArrayHolds[HoldIndex];
              HideHold(LeftName);
              LeftName="H"+(HoldIndex+1);
              leftI=HoldIndex;
              ShowHold(LeftName);
              score=leftH+ArrayHolds[HoldIndex];
              flag=1;
          }
        }
    }
    else // Hold doesnt change this iteration. (Rest Mode)
    {
        flag=1;
    }
    
  }// end while

}
function buildDuration(min,sec)
{
    let duration ="00:";
    if(min>=10)
    {
        duration +=min;
    }
    else
    {
        duration +="0"+min;
    }
    duration+=":";
    if(sec>=10)
    {
        duration +=sec;
    }
    else
    {
        duration +="0"+sec;
    }
    return duration;

}